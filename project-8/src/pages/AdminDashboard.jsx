import { useData } from "../context/DataContext.jsx";

// A small stat card for the top of the admin page.
function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center">
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { appointments, doctors, getDoctorName, setStatus } = useData();

  // Count appointments by status for the stat cards.
  const pending = appointments.filter((a) => a.status === "pending").length;
  const approved = appointments.filter((a) => a.status === "approved").length;
  const rejected = appointments.filter((a) => a.status === "rejected").length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
      <p className="mt-1 text-sm text-slate-500">
        Overview of every appointment in the system.
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Doctors" value={doctors.length} color="text-blue-600" />
        <StatCard label="Pending" value={pending} color="text-amber-600" />
        <StatCard label="Approved" value={approved} color="text-green-600" />
        <StatCard label="Rejected" value={rejected} color="text-red-600" />
      </div>

      {/* Full appointments table */}
      <h2 className="mt-10 text-lg font-semibold text-slate-900">
        All appointments
      </h2>
      <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-t border-slate-100">
                <td className="px-4 py-3">{appt.patientName}</td>
                <td className="px-4 py-3">{getDoctorName(appt.doctorId)}</td>
                <td className="px-4 py-3">{appt.date}</td>
                <td className="px-4 py-3 capitalize">{appt.status}</td>
                <td className="px-4 py-3">
                  {/* Admin can cancel any appointment */}
                  {appt.status !== "rejected" ? (
                    <button
                      onClick={() => setStatus(appt.id, "rejected")}
                      className="rounded-lg bg-slate-100 px-3 py-1 text-xs hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
