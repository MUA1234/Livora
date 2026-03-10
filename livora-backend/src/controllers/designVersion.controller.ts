import mongoose, { Request, Response } from "express";
import Design from "../models/design.model";
import DesignVersion, { IDesignVersion } from "../models/designVersion.model";

// GET /api/designs/:id/versions - Return timeline of saved versions
export const getDesignVersions = async (req: Request, res: Response): Promise<void> => {
  try {
    const versions = await DesignVersion.find({ designId: req.params.id })
      .select("_id id label createdAt layoutData")
      .sort({ createdAt: -1 });
      
    res.status(200).json(versions);
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching design versions", error: error.message });
  }
};

// POST /api/designs/:id/versions - Save a snapshot of current design state
export const createDesignVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const design = await Design.findOne({ _id: req.params.id, deletedAt: null });
    if (!design) {
      res.status(404).json({ message: "Design not found" });
      return;
    }

    const { label } = req.body;

    const newVersion: IDesignVersion = new DesignVersion({
      designId: design._id,
      label: label || "Manual save",
      layoutData: design.layoutData, // Take the CURRENT layoutData from the design document
    });

    const savedVersion = await newVersion.save();
    res.status(201).json(savedVersion);
  } catch (error: any) {
    res.status(500).json({ message: "Error saving design version", error: error.message });
  }
};

// POST /api/designs/:id/versions/:versionId/restore - Overwrite current design layoutData
export const restoreDesignVersion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, versionId } = req.params;
    console.log(`Attempting to restore design ${id} to version ${versionId}`);

    // Ensure we are comparing ObjectIds correctly if needed
    const version = await DesignVersion.findOne({ 
      _id: versionId, 
      designId: id 
    });

    if (!version) {
      console.log(`Version ${versionId} not found for design ${id}`);
      res.status(404).json({ message: "Version not found for this design" });
      return;
    }

    const updatedDesign = await Design.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { layoutData: version.layoutData } },
      { new: true }
    );

    if (!updatedDesign) {
      console.log(`Design ${id} not found or is deleted`);
      res.status(404).json({ message: "Design not found" });
      return;
    }

    console.log(`Successfully restored design ${id} to version ${versionId}`);
    res.status(200).json({ message: "Design restored successfully", design: updatedDesign });
  } catch (error: any) {
    console.error("Restore error:", error);
    res.status(500).json({ message: "Error restoring design version", error: error.message });
  }
};

// GET /api/designs/:id/versions/:v1/compare/:v2 - Return both version snapshots
export const compareDesignVersions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, v1, v2 } = req.params;

    const [version1, version2] = await Promise.all([
      DesignVersion.findOne({ _id: v1, designId: id }),
      DesignVersion.findOne({ _id: v2, designId: id })
    ]);

    if (!version1) {
      res.status(404).json({ message: `Version 1 (${v1}) not found for this design` });
      return;
    }
    
    if (!version2) {
      res.status(404).json({ message: `Version 2 (${v2}) not found for this design` });
      return;
    }

    res.status(200).json({
      v1: {
        id: version1._id,
        label: version1.label,
        createdAt: version1.createdAt,
        layoutData: version1.layoutData
      },
      v2: {
        id: version2._id,
        label: version2.label,
        createdAt: version2.createdAt,
        layoutData: version2.layoutData
      }
    });

  } catch (error: any) {
    res.status(500).json({ message: "Error comparing design versions", error: error.message });
  }
};
