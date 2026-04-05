import axiosInstance from "@/helpers/axiosInstance";

export async function getSosDistrictOptions() {
  const res = await axiosInstance.get("/sos/options");
  return res.data;
}

export async function triggerSosAlert(payload) {
  const res = await axiosInstance.post("/sos/trigger", payload);
  return res.data;
}

export async function autoTriggerSosAlert(payload) {
  const res = await axiosInstance.post("/sos/auto-trigger", payload);
  return res.data;
}

export async function getMySosAlerts() {
  const res = await axiosInstance.get("/sos/my-alerts");
  return res.data;
}

export async function getThanaSosAlerts() {
  const res = await axiosInstance.get("/sos/thana-alerts");
  return res.data;
}

export async function assignSosOfficer({ sosId, officer_id }) {
  const res = await axiosInstance.post(`/sos/${sosId}/assign-officer`, { officer_id });
  return res.data;
}

export async function getOfficerSosAlerts() {
  const res = await axiosInstance.get("/sos/officer-alerts");
  return res.data;
}

export async function acknowledgeSosAlert(sosId) {
  const res = await axiosInstance.post(`/sos/${sosId}/acknowledge`);
  return res.data;
}
