import { Request, Response } from "express";
import PDFDocument from "pdfkit";
import Design from "../models/design.model";
import { Product } from "../models/Product.model";
import Room from "../models/room.model";

// Helper to extract items from layoutData
// Assuming layoutData contains an 'items' array where each item has a 'productId' and optional 'quantity'
const extractDesignItems = (layoutData: any): { productId: string; quantity: number }[] => {
  if (!layoutData || typeof layoutData !== "object") return [];
  
  // If there's an explicit items array
  if (Array.isArray(layoutData.items)) {
    return layoutData.items
      .filter((item: any) => item.productId)
      .map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity || 1
      }));
  }

  // Fallback: search the entire object for 'productId'
  const items: { productId: string; quantity: number }[] = [];
  const searchProductIds = (obj: any) => {
    if (!obj || typeof obj !== "object") return;
    if (obj.productId) {
      items.push({
        productId: obj.productId,
        quantity: obj.quantity || 1
      });
    }
    Object.values(obj).forEach(value => {
      if (typeof value === "object") {
        searchProductIds(value);
      }
    });
  };
  
  searchProductIds(layoutData);
  return items;
};

// Calculate cost summary data
export const getCostData = async (designId: string) => {
  const design = await Design.findById(designId).populate("roomId");
  if (!design) {
    throw new Error("Design not found");
  }

  const items = extractDesignItems(design.layoutData);
  
  // Aggregate quantities by productId
  const itemMap = new Map<string, number>();
  for (const item of items) {
    const currentQty = itemMap.get(item.productId) || 0;
    itemMap.set(item.productId, currentQty + item.quantity);
  }

  const productIds = Array.from(itemMap.keys());
  
  // Fetch actual products from DB
  const products = await Product.find({ _id: { $in: productIds } });

  let grandTotal = 0;
  const itemizedList = products.map(product => {
    const qty = itemMap.get(product._id.toString()) || 0;
    const subtotal = product.price * qty;
    grandTotal += subtotal;
    
    return {
      productId: product._id,
      name: product.name,
      sku: product.sku,
      quantity: qty,
      unitPrice: product.price,
      subtotal
    };
  });

  return {
    design,
    itemizedList,
    grandTotal
  };
};

// GET /api/designs/:id/cost-summary
export const getCostSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const costData = await getCostData(req.params.id as string);
    
    res.status(200).json({
      designId: costData.design._id,
      designName: costData.design.name,
      roomDetails: costData.design.roomId,
      itemizedList: costData.itemizedList,
      grandTotal: costData.grandTotal
    });
  } catch (error: any) {
    if (error.message === "Design not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error calculating cost summary", error: error.message });
  }
};

// GET /api/designs/:id/cost-report/pdf
export const getCostReportPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    const costData = await getCostData(req.params.id as string);
    
    const doc = new PDFDocument({ margin: 50 });
    
    let filename = `Cost-Report-${costData.design.name.replace(/\s+/g, '-')}.pdf`;
    filename = encodeURIComponent(filename);
    
    res.setHeader("Content-disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-type", "application/pdf");
    
    doc.pipe(res);
    
    // PDF Header
    doc.fontSize(20).text("Design Cost Report", { align: "center" });
    doc.moveDown();
    
    // Design and Room Info
    doc.fontSize(12).text(`Design Name: ${costData.design.name}`);
    const room = costData.design.roomId as any;
    if (room && room.name) {
      doc.text(`Room: ${room.name} (${room.dimensions?.length}x${room.dimensions?.width} ${room.dimensions?.unit})`);
    }
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown(2);
    
    // Table Header
    const tableTop = doc.y;
    doc.font("Helvetica-Bold");
    doc.text("Item Name (SKU)", 50, tableTop);
    doc.text("Qty", 300, tableTop, { width: 50, align: "right" });
    doc.text("Unit Price", 380, tableTop, { width: 80, align: "right" });
    doc.text("Subtotal", 480, tableTop, { width: 80, align: "right" });
    
    doc.moveTo(50, tableTop + 15).lineTo(560, tableTop + 15).stroke();
    
    // Table Rows
    doc.font("Helvetica");
    let y = tableTop + 25;
    
    costData.itemizedList.forEach(item => {
      // Check for page break
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
      
      const itemNameSku = `${item.name} (${item.sku})`;
      doc.text(itemNameSku, 50, y, { width: 240 });
      doc.text(item.quantity.toString(), 300, y, { width: 50, align: "right" });
      doc.text(`$${item.unitPrice.toFixed(2)}`, 380, y, { width: 80, align: "right" });
      doc.text(`$${item.subtotal.toFixed(2)}`, 480, y, { width: 80, align: "right" });
      
      y += 20;
    });
    
    doc.moveTo(50, y + 5).lineTo(560, y + 5).stroke();
    
    // Grand Total
    y += 15;
    doc.font("Helvetica-Bold");
    doc.text("Grand Total:", 380, y, { width: 80, align: "right" });
    doc.text(`$${costData.grandTotal.toFixed(2)}`, 480, y, { width: 80, align: "right" });
    
    doc.end();
    
  } catch (error: any) {
    if (error.message === "Design not found") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error generating PDF report", error: error.message });
  }
};
