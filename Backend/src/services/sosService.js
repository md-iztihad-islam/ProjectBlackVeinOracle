import {
  acknowledgeSosByOfficerRepository,
  addNotificationRepository,
  assignOfficerToSosRepository,
  createSosAlertRepository,
  createSosAlertsForDistrictRepository,
  ensureSosSchemaRepository,
  getDistrictThanaOptionsRepository,
  getThanasByDistrictRepository,
  getSosAlertsForOfficerRepository,
  getSosAlertsForThanaRepository,
  getSosAlertsForUserRepository,
  getThanaBasicsRepository,
  getUserBasicsRepository,
} from "../repositories/sosRepository.js";

const roleNameFromId = (id = "") => {
  if (id.startsWith("ADM")) return "admin";
  if (id.startsWith("THN")) return "thana";
  if (id.startsWith("OFC")) return "officer";
  if (id.startsWith("JAL")) return "jail";
  if (id.startsWith("USR")) return "user";
  return "unknown";
};

export const getDistrictThanaOptionsService = async () => {
  await ensureSosSchemaRepository();
  return getDistrictThanaOptionsRepository();
};

export const autoTriggerSosService = async ({
  userId,
  district,
  detectedAddress,
  latitude,
  longitude,
  description,
  imageUrl,
}) => {
  await ensureSosSchemaRepository();

  let normalizedDistrict = String(district || "").trim();

  const user = await getUserBasicsRepository(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!normalizedDistrict) {
    const districtRows = await getDistrictThanaOptionsRepository();
    const knownDistricts = districtRows.map((row) => String(row.district || "").trim()).filter(Boolean);
    const hints = `${detectedAddress || ""} ${user.address || ""}`.toLowerCase();
    const inferredDistrict = knownDistricts.find((known) => hints.includes(known.toLowerCase()));
    normalizedDistrict = inferredDistrict || "";
  }

  if (!normalizedDistrict) {
    throw new Error("Unable to detect district from GPS location");
  }

  const thanas = await getThanasByDistrictRepository(normalizedDistrict);

  if (!thanas.length) {
    throw new Error(`No thana found for detected district: ${normalizedDistrict}`);
  }

  const thanaIds = thanas.map((thana) => thana.thana_id);

  const alerts = await createSosAlertsForDistrictRepository({
    userId,
    district: normalizedDistrict,
    thanaIds,
    description,
    imageUrl,
    latitude,
    longitude,
    detectedAddress,
  });

  const locationHint = detectedAddress || `Lat ${latitude}, Lon ${longitude}`;

  await Promise.all(
    thanaIds.map((thanaId) =>
      addNotificationRepository({
        targetRole: "thana",
        targetId: thanaId,
        title: "SOS Emergency Alert",
        message: `SOS from ${user.full_name} (${user.user_id}) at ${locationHint}. Contact: ${user.phone || "N/A"}.`,
      })
    )
  );

  return {
    broadcast_count: alerts.length,
    district: normalizedDistrict,
    location: {
      latitude,
      longitude,
      detected_address: detectedAddress || null,
    },
    alerts,
  };
};

export const triggerSosService = async ({ userId, district, thanaId, description, imageUrl }) => {
  await ensureSosSchemaRepository();

  const normalizedDistrict = String(district || "").trim();

  const [user, thana] = await Promise.all([
    getUserBasicsRepository(userId),
    getThanaBasicsRepository(thanaId),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  if (!thana) {
    throw new Error("Thana not found");
  }

  if (thana.district.toLowerCase() !== normalizedDistrict.toLowerCase()) {
    throw new Error("Selected thana does not belong to selected district");
  }

  const alert = await createSosAlertRepository({
    userId,
    district: normalizedDistrict,
    thanaId,
    description,
    imageUrl,
  });

  const message = `SOS from ${user.full_name} (${user.user_id}) in ${normalizedDistrict}. Contact: ${user.phone || "N/A"}.`;

  await addNotificationRepository({
    targetRole: "thana",
    targetId: thanaId,
    title: "SOS Emergency Alert",
    message,
  });

  return alert;
};

export const getMySosAlertsService = async (userId) => {
  await ensureSosSchemaRepository();
  return getSosAlertsForUserRepository(userId);
};

export const getThanaSosAlertsService = async (thanaId) => {
  await ensureSosSchemaRepository();
  return getSosAlertsForThanaRepository(thanaId);
};

export const assignOfficerToSosService = async ({ sosId, thanaId, officerId, assignedById }) => {
  await ensureSosSchemaRepository();

  const alert = await assignOfficerToSosRepository({ sosId, thanaId, officerId });

  if (!alert) return null;

  await Promise.all([
    addNotificationRepository({
      targetRole: "officer",
      targetId: officerId,
      title: "SOS Assignment",
      message: `You have been assigned to SOS #${alert.sos_id}. Reach the user immediately.`,
    }),
    addNotificationRepository({
      targetRole: "user",
      targetId: alert.user_id,
      title: "SOS Team Assigned",
      message: `An officer has been assigned to your SOS request (#${alert.sos_id}).`,
    }),
  ]);

  return {
    ...alert,
    assigned_by_role: roleNameFromId(assignedById),
  };
};

export const getOfficerSosAlertsService = async (officerId) => {
  await ensureSosSchemaRepository();
  return getSosAlertsForOfficerRepository(officerId);
};

export const acknowledgeSosByOfficerService = async ({ sosId, officerId }) => {
  await ensureSosSchemaRepository();

  const alert = await acknowledgeSosByOfficerRepository({ sosId, officerId });

  if (!alert) return null;

  await addNotificationRepository({
    targetRole: "user",
    targetId: alert.user_id,
    title: "SOS Acknowledged",
    message: `Officer accepted your SOS request (#${alert.sos_id}) and is responding now.`,
  });

  return alert;
};
