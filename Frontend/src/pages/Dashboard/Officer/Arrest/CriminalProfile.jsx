import getCriminalProfileApi from "@/services/Analytics/getCriminalProfileApi";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (str) =>
  str ? str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const riskBadgeClass = (level) => {
  if (level >= 8) return "bg-red-100 text-red-600";
  if (level >= 5) return "bg-amber-100 text-amber-600";
  return "bg-emerald-100 text-emerald-600";
};

const statusBadgeClass = (status) => {
  if (!status) return "bg-gray-100 text-gray-500";
  const s = status.toLowerCase();
  if (s === "in_custody") return "bg-red-100 text-red-600";
  if (s === "released") return "bg-emerald-100 text-emerald-600";
  if (s === "open") return "bg-blue-100 text-blue-600";
  return "bg-gray-100 text-gray-500";
};

/* ─── Sub-components ─────────────────────────────────────────── */
function Badge({ label, className }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${className}`}
    >
      {fmt(label)}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
      {children}
    </p>
  );
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-xl">{icon}</span>
      <span className="text-3xl font-bold text-gray-900 font-mono leading-none">
        {value ?? "—"}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </Card>
  );
}

function ArrestRow({ arrest }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/officer/dashboard/arrest-record-details/${arrest.arrest_id}`)} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-2 gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-gray-800 font-mono">
          {arrest.arrest_id}
        </span>
        <span className="text-[11px] text-gray-400">{fmtDate(arrest.arrest_date)}</span>
      </div>
      <Badge
        label={arrest.custody_status}
        className={statusBadgeClass(arrest.custody_status)}
      />
    </div>
  );
}

function CaseRow({ c }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`case-file/${c.case_id}`)} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-2 gap-3 flex-wrap">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-gray-800">{c.case_title}</span>
        <span className="text-[11px] text-gray-400 font-mono">
          #{c.case_id} · {fmt(c.case_type)} · {fmtDate(c.filed_at)}
        </span>
      </div>
      <Badge label={c.status} className={statusBadgeClass(c.status)} />
    </div>
  );
}

function OrgRow({ org }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`organization/${org.org_id}`)} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-2 gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-gray-800">{org.org_name}</span>
        <span className="text-[11px] text-gray-400">{org.role}</span>
      </div>
      <span
        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${riskBadgeClass(
          org.threat_level
        )}`}
      >
        Threat {org.threat_level}/10
      </span>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────── */
function Skeleton({ className = "" }) {
  return <div className={`rounded-lg bg-gray-100 animate-pulse ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Card className="flex gap-5 items-center">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
function CriminalProfile() {
  const { criminalId } = useParams();

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ["criminalProfile", criminalId],
    queryFn: () => getCriminalProfileApi(criminalId),
    enabled: !!criminalId,
  });

  const p = profileData?.data;

  console.log("Profile data:", p);

  const initials = p?.full_name
    ? p.full_name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* ── Page header ── */}
        <div className="mb-7">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            Law Enforcement Portal
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Criminal Profile
          </h1>
        </div>

        {/* ── Error ── */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-600 text-sm font-medium">
            ⚠️ Failed to load profile. Please try again.
          </div>
        )}

        {/* ── Loading ── */}
        {isLoading && <LoadingSkeleton />}

        {/* ── Profile ── */}
        {!isLoading && !isError && p && (
          <div className="flex flex-col gap-4">

            {/* Hero card */}
            <Card>
              <div className="flex gap-5 items-start flex-wrap">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xl font-extrabold shrink-0 tracking-tight">
                  <img src={p.image_url} alt="" className="rounded-full" />
                </div>

                {/* Name / IDs / badges */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mb-1 truncate">
                    {p.full_name}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap mb-2.5">
                    <span className="text-[11px] text-gray-400 font-mono">
                      {p.criminal_id}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      NID: {p.nid}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge label={p.status} className={statusBadgeClass(p.status)} />
                    <Badge
                      label={`Risk ${p.risk_level}/10`}
                      className={riskBadgeClass(p.risk_level)}
                    />
                  </div>
                </div>

                {/* Thana */}
                <div className="flex flex-col items-end gap-0.5 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Registered Thana
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    {p.registered_thana}
                  </span>
                </div>
              </div>
            </Card>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Total Arrests" value={p.total_arrests} icon="🔒" />
              <StatCard label="Total Cases" value={p.total_cases} icon="📁" />
              <StatCard label="Organizations" value={p.total_organizations} icon="🏴" />
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <Card>
                <SectionTitle>Arrest History</SectionTitle>
                {p.arrests?.length ? (
                  p.arrests.map((a) => <ArrestRow key={a.arrest_id} arrest={a} />)
                ) : (
                  <p className="text-xs text-gray-400">No arrests recorded.</p>
                )}
              </Card>

              <Card>
                <SectionTitle>Cases</SectionTitle>
                {p.cases?.length ? (
                  p.cases.map((c) => <CaseRow key={c.case_id} c={c} />)
                ) : (
                  <p className="text-xs text-gray-400">No cases filed.</p>
                )}
              </Card>

              <Card>
                <SectionTitle>Organizations</SectionTitle>
                {p.organizations?.length ? (
                  p.organizations.map((o, i) => <OrgRow key={i} org={o} />)
                ) : (
                  <p className="text-xs text-gray-400">No organization ties.</p>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {!isLoading && !isError && !p && (
          <Card className="text-center py-14">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-base font-bold text-gray-800">No profile found</p>
            <p className="text-sm text-gray-400 mt-1">
              No criminal record exists for ID:{" "}
              <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                {criminalId}
              </code>
            </p>
          </Card>
        )}

      </div>
    </div>
  );
}

export default CriminalProfile;