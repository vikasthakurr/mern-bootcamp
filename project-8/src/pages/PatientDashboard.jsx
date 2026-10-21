import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

// A small colored badge to show the appointment status.
function StatusBadge({ status }) {
  const colors = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function PatientDashboard() {
  const { currentUser } = useAuth();
  const { doctors, appointments, bookAppointment, getDoctorName } = useData();

  // Form state for booking a new appointment.
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || "");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");

  // Only show THIS patient's appointments (filter by their email).
  const myAppointments = appointments.filter(
    (a) => a.patientEmail === currentUser.email
  );

  function handleBook(e) {
    e.preventDefault();
    if (!date || !reason) return; // keep it simple: need both fields

    bookAppointment({
      patientName: currentUser.name,
      patientEmail: currentUser.email,
      doctorId,
      date,
      reason,
    });

    // Clear the form after booking.
    setDate("");
    setReason("");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>

      {/* Booking form */}
      <form
        onSubmit={handleBook}
        className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-6 sm:grid-cols-2"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Doctor
          </label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} — {doc.specialty}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Reason
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Regular check-up"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="sm:col-span-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700"
          >
            Book appointment
          </button>
        </div>
      </form>

      {/* List of this patient's appointments */}
      <div className="mt-8 space-y-3">
        {myAppointments.length === 0 && (
          <p className="text-slate-500">You have no appointments yet.</p>
        )}

        {myAppointments.map((appt) => (
          <div
            key={appt.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {getDoctorName(appt.doctorId)}
              </p>
              <p className="text-sm text-slate-500">
                {appt.date} — {appt.reason}
              </p>
            </div>
            <StatusBadge status={appt.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
