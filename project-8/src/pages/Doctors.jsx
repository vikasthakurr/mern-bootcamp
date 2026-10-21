import { useData } from "../context/DataContext.jsx";

// A simple list of all doctors. Every logged-in user can view this.
export default function Doctors() {
  const { doctors } = useData();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900">Our Doctors</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {doc.name}
            </h2>
            <p className="text-sm text-blue-600">{doc.specialty}</p>
            <p className="mt-2 text-sm text-slate-500">
              Consultation fee: ₹{doc.fee}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
