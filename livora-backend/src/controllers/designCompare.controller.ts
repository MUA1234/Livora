import { Request, Response } from "express";
import { getCostData } from "../controllers/designCost.controller";

// GET /api/designs/compare?designA=X&designB=Y
export const getDesignsComparison = async (req: Request, res: Response): Promise<void> => {
  try {
    const { designA, designB } = req.query;

    if (!designA || !designB) {
      res.status(400).json({ message: "Both 'designA' and 'designB' query parameters are required" });
      return;
    }

    // Process both cost summaries concurrently
    const [costDataA, costDataB] = await Promise.allSettled([
      getCostData(designA as string),
      getCostData(designB as string)
    ]);

    // Check for errors (e.g. invalid ID or design not found)
    if (costDataA.status === "rejected" || costDataB.status === "rejected") {
       let errorMsg = "Failed to fetch designs for comparison.";
       
       if (costDataA.status === "rejected" && costDataA.reason.message === "Design not found") {
           errorMsg = `Design A (${designA}) not found or invalid.`;
       } else if (costDataB.status === "rejected" && costDataB.reason.message === "Design not found") {
           errorMsg = `Design B (${designB}) not found or invalid.`;
       }

       res.status(404).json({ message: errorMsg });
       return;
    }

    const dataA = costDataA.value;
    const dataB = costDataB.value;

    res.status(200).json({
      designA: {
        id: dataA.design._id,
        name: dataA.design.name,
        status: dataA.design.status,
        createdAt: dataA.design.createdAt,
        roomId: dataA.design.roomId,
        layoutData: dataA.design.layoutData,
        costSummary: {
          itemizedList: dataA.itemizedList,
          grandTotal: dataA.grandTotal
        }
      },
      designB: {
        id: dataB.design._id,
        name: dataB.design.name,
        status: dataB.design.status,
        createdAt: dataB.design.createdAt,
        roomId: dataB.design.roomId,
        layoutData: dataB.design.layoutData,
        costSummary: {
          itemizedList: dataB.itemizedList,
          grandTotal: dataB.grandTotal
        }
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: "Error generating design comparison", error: error.message });
  }
};
