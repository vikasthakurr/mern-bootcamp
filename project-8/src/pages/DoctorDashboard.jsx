import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

export default function DoctorDashboard() {
  const { currentUser } = useAuth();
  const { appointments, setStatus } = useData();

  // How the link works:
  // - A doctor's login (in seed.js) has a "doctorId" like "d1".
  // - Each appointment also has a "doctorId".
  // So we keep only the appointments whose doctorId matches THIS doctor.
  const myAppointments = appointments.filter(
    (a) => a.doctorId === currentUser.doctorId,
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My Patients</h1>
      <p className="mt-1 text-sm text-slate-500">
        Approve or reject the appointments requested for you.
      </p>

      <div className="mt-6 space-y-3">
        {myAppointments.length === 0 && (
          <p className="text-slate-500">No appointment requests yet.</p>
        )}

        {myAppointments.map((appt) => (
          <div
            key={appt.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">
                  {appt.patientName}
                </p>
                <p className="text-sm text-slate-500">
                  {appt.date} — {appt.reason}
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">
                {appt.status}
              </span>
            </div>

            {/* Only show buttons while it's still pending */}
            {appt.status === "pending" && (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setStatus(appt.id, "approved")}
                  className="rounded-lg bg-green-600 px-4 py-1.5 text-sm text-white hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => setStatus(appt.id, "rejected")}
                  className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
