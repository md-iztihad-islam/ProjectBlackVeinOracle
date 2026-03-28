import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteLocation,
  getLocationById,
  updateLocation,
} from "@/services/Thana/thanaApi";
import { useMutation, useQuery } from "@tanstack/react-query";

function UpdateLocation() {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [locationIdInput, setLocationIdInput] = useState(locationId || "");
  const [form, setForm] = useState({ district: "", address: "", zone: "" });
  const [currentLocation, setCurrentLocation] = useState(null);
  const set = (k, v) => setForm({ ...form, [k]: v });
  const targetLocationId = locationId || locationIdInput;
  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/50";

  const { data: autoLocationData } = useQuery({
    queryKey: ["location-by-id", locationId],
    queryFn: () => getLocationById(locationId),
    enabled: Boolean(locationId),
  });

  const effectiveCurrentLocation = currentLocation || autoLocationData?.data || null;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        district: form.district || effectiveCurrentLocation?.district || "",
        address: form.address || effectiveCurrentLocation?.address || "",
        zone: form.zone || effectiveCurrentLocation?.zone || "",
      };
      return updateLocation(targetLocationId, payload);
    },
    onSuccess: (r) => {
      if (r.success) {
        alert("Location updated!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  const { mutate: removeLocation, isPending: isRemoving } = useMutation({
    mutationFn: () => deleteLocation(targetLocationId),
    onSuccess: (r) => {
      if (r.success) {
        alert("Location removed!");
        navigate("/thana/dashboard");
      } else alert(r.message || "Failed");
    },
  });

  const { mutate: loadLocation, isPending: isLoadingLocation } = useMutation({
    mutationFn: () => getLocationById(targetLocationId),
    onSuccess: (r) => {
      if (!r?.success || !r?.data) {
        alert(r?.message || "Location not found");
        return;
      }
      setCurrentLocation(r.data);
      setForm({
        district: r.data.district || "",
        address: r.data.address || "",
        zone: r.data.zone || "",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 border border-white/[0.07] rounded-2xl p-6">
        <button
          onClick={() => navigate("/thana/dashboard")}
          className="text-sm text-blue-400 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-slate-100 mb-2">
          Update Location
        </h1>
        <p className="text-sm text-slate-500 mb-6 font-mono">{targetLocationId || "No ID selected"}</p>
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              if (!targetLocationId) {
                alert("Location ID is required");
                return;
              }
              loadLocation();
            }}
            disabled={isLoadingLocation}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm"
          >
            {isLoadingLocation ? "Loading..." : "Load Current Data"}
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!targetLocationId) {
              alert("Location ID is required");
              return;
            }
            mutate();
          }}
          className="flex flex-col gap-4"
        >
          {!locationId && (
            <div>
              <label className="text-xs text-slate-400 uppercase">Location ID</label>
              <input
                value={locationIdInput}
                onChange={(e) => setLocationIdInput(e.target.value)}
                placeholder="LOC-0000001"
                className={inputCls}
                required
              />
            </div>
          )}
          <div>
            <label className="text-xs text-slate-400 uppercase">District</label>
            <input
              value={form.district}
              onChange={(e) => set("district", e.target.value)}
              placeholder={effectiveCurrentLocation?.district || "District"}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Address</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder={effectiveCurrentLocation?.address || "Address"}
              className={inputCls}
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase">Zone</label>
            <input
              value={form.zone}
              onChange={(e) => set("zone", e.target.value)}
              placeholder={effectiveCurrentLocation?.zone || "Zone"}
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Update Location"}
          </button>
          <button
            type="button"
            disabled={isRemoving}
            onClick={() => {
              if (!targetLocationId) {
                alert("Location ID is required");
                return;
              }
              if (window.confirm("Remove this location? This cannot be undone.")) {
                removeLocation();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-medium"
          >
            {isRemoving ? "Removing..." : "Remove Location"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateLocation;