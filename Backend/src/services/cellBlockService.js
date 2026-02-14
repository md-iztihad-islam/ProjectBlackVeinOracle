import { addCellBlocksRepository, getAllCellBlocksRepository, getCellBlockByIdRepository, getCellBlocksByJailRepository, updateCellBlockRepository, deleteCellBlockRepository } from "../repositories/cellBlockRepository.js";

export const addCellBlockService = async (cellBlockData) => {
    try {
        return await addCellBlocksRepository(cellBlockData);
    } catch (error) {
        console.log("Error at addCellBlockService:", error);
        throw error;
    }
};

export const getAllCellBlocksService = async () => {
    try {
        return await getAllCellBlocksRepository();
    } catch (error) {
        console.log("Error at getAllCellBlocksService:", error);
        throw error;
    }
};

export const getCellBlockByIdService = async (cell_block_id) => {
    try {
        return await getCellBlockByIdRepository(cell_block_id);
    } catch (error) {
        console.log("Error at getCellBlockByIdService:", error);
        throw error;
    }
};

export const getCellBlocksByJailService = async (jail_id) => {
    try {
        return await getCellBlocksByJailRepository(jail_id);
    } catch (error) {
        console.log("Error at getCellBlocksByJailService:", error);
        throw error;
    }
};

export const updateCellBlockService = async (cell_block_id, cellBlockData) => {
    try {
        return await updateCellBlockRepository(cell_block_id, cellBlockData);
    } catch (error) {
        console.log("Error at updateCellBlockService:", error);
        throw error;
    }
};

export const deleteCellBlockService = async (blockId) => {
    try {
        return await deleteCellBlockRepository(blockId);
    } catch (error) {
        console.log("Error at deleteCellBlockService:", error);
        throw error;
    }
};      

