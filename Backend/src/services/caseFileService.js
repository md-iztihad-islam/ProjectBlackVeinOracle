import {
  addCaseFileRepository,
  getAllCaseFilesRepository,
  getCaseFileByIdRepository,
  getCaseFilesByThanaRepository,
  getCaseFilesByCriminalRepository,
  updateCaseFileRepository,
  deleteCaseFileRepository,
} from "../repositories/caseFileRepository.js";

const ALLOWED_CASE_TYPES = [
  "theft",
  "robbery",
  "murder",
  "assault",
  "kidnapping",
  "fraud",
  "cyber_crime",
  "drug_offense",
  "domestic_violence",
  "extortion",
  "illegal_firearms",
  "human_trafficking",
  "other",
];

const normalizeCaseType = (value) => String(value || "").trim().toLowerCase();

const validateCaseFilePayload = (data, { partial = false } = {}) => {
  const caseTitle = data?.case_title;
  const caseTypeRaw = data?.case_type;
  const caseType = normalizeCaseType(caseTypeRaw);
  const description = String(data?.description || "").trim();

  if (!partial || typeof caseTitle !== "undefined") {
    if (!String(caseTitle || "").trim()) {
      throw new Error("case_title is required");
    }
  }

  if (!partial || typeof caseTypeRaw !== "undefined") {
    if (!ALLOWED_CASE_TYPES.includes(caseType)) {
      throw new Error(`Invalid case_type. Allowed values: ${ALLOWED_CASE_TYPES.join(", ")}`);
    }
  }

  if ((!partial && caseType === "other") || (partial && typeof caseTypeRaw !== "undefined" && caseType === "other")) {
    if (description.length < 10) {
      throw new Error("For case_type 'other', description must be at least 10 characters");
    }
  }
};

export const addCaseFileService = async (data) => {
  try {
    validateCaseFilePayload(data, { partial: false });
    const normalized = {
      ...data,
      case_type: normalizeCaseType(data?.case_type),
      case_title: String(data?.case_title || "").trim(),
    };
    return await addCaseFileRepository(normalized);
  } catch (e) {
    throw e;
  }
};
export const getAllCaseFilesService = async () => {
  try {
    return await getAllCaseFilesRepository();
  } catch (e) {
    throw e;
  }
};
export const getCaseFileByIdService = async (id) => {
  try {
    return await getCaseFileByIdRepository(id);
  } catch (e) {
    throw e;
  }
};
export const getCaseFilesByThanaService = async (thanaId) => {
  try {
    return await getCaseFilesByThanaRepository(thanaId);
  } catch (e) {
    throw e;
  }
};
export const getCaseFilesByCriminalService = async (criminalId) => {
  try {
    return await getCaseFilesByCriminalRepository(criminalId);
  } catch (e) {
    throw e;
  }
};
export const updateCaseFileService = async (id, data) => {
  try {
    validateCaseFilePayload(data, { partial: true });
    const normalized = {
      ...data,
      ...(typeof data?.case_type !== "undefined" ? { case_type: normalizeCaseType(data?.case_type) } : {}),
      ...(typeof data?.case_title !== "undefined" ? { case_title: String(data?.case_title || "").trim() } : {}),
    };
    return await updateCaseFileRepository(id, normalized);
  } catch (e) {
    throw e;
  }
};
export const deleteCaseFileService = async (id) => {
  try {
    return await deleteCaseFileRepository(id);
  } catch (e) {
    throw e;
  }
};