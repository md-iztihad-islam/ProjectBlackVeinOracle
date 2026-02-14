import {
  addCellBlockService,
  getAllCellBlocksService,
  getCellBlockByIdService,
  getCellBlocksByJailService,
  updateCellBlockService,
  deleteCellBlockService,
} from "../services/cellBlockService.js";

export const addCellBlockController = async (req, res) => {
  try {
    const result = await addCellBlockService(req.body);
    if (!result) {
      return res.status(400).json({
        success: false,
        message: "Failed to add cell block",
      });
    }
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Error at addCellBlockController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCellBlocksController = async (_, res) => {
  try {
    const result = await getAllCellBlocksService();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Error at getAllCellBlocksController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCellBlockByIdController = async (req, res) => {
  try {
    const result = await getCellBlockByIdService(req.params.blockId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Cell block not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log("Error at getCellBlockByIdController:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCellBlocksByJailController = async(req, res) => {
    try {
        const result = await getCellBlocksByJailService(req.params.jailId);
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log("Error at getCellBlocksByJailController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
};

export const updateCellBlockController = async (req, res) => {
    try {
        const result  = await updateCellBlockService(req.params.blockId, req.body);
        if(!result){
            return res.status(404).json({
                success: false,
                message: 'Cell block not found'
            });
        }
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log("Error at updateCellBlockController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const deleteCellBlockController = async (req, res) => {
    try {
        const result = await deleteCellBlockService(req.params.blockId);
        if(!result){
            return res.status(404).json({
                success: false,
                message: 'Cell block not found'
            })
        }
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.log("Error at deleteCellBlockController:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


