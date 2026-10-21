// This is our fake "database". In a real app this would come from a server.
// We keep it simple: a few users, a few doctors, and some appointments.

// Every user has a role: "admin", "doctor", or "patient".
// The role decides what pages and actions they are allowed to use.
export const users = [
  // Admins
  {
    id: "u1",
    name: "Admin Avni",
    email: "admin@med.com",
    password: "admin",
    role: "admin",
  },

  // Doctors (each doctor user is linked to a doctor record by doctorId)
  {
    id: "u2",
    name: "Dr. Rao",
    email: "rao@med.com",
    password: "doctor",
    role: "doctor",
    doctorId: "d1",
  },
  {
    id: "u3",
    name: "Dr. Mehta",
    email: "mehta@med.com",
    password: "doctor",
    role: "doctor",
    doctorId: "d2",
  },
  {
    id: "u4",
    name: "Dr. Khan",
    email: "khan@med.com",
    password: "doctor",
    role: "doctor",
    doctorId: "d3",
  },
  {
    id: "u5",
    name: "Dr. Iyer",
    email: "iyer@med.com",
    password: "doctor",
    role: "doctor",
    doctorId: "d4",
  },

  // Patients
  {
    id: "u6",
    name: "Patient Sam",
    email: "sam@med.com",
    password: "patient",
    role: "patient",
  },
  {
    id: "u7",
    name: "Patient Priya",
    email: "priya@med.com",
    password: "patient",
    role: "patient",
  },
  {
    id: "u8",
    name: "Patient John",
    email: "john@med.com",
    password: "patient",
    role: "patient",
  },
];

export const doctors = [
  { id: "d1", name: "Dr. Rao", specialty: "Cardiologist", fee: 600 },
  { id: "d2", name: "Dr. Mehta", specialty: "Dermatologist", fee: 450 },
  { id: "d3", name: "Dr. Khan", specialty: "Pediatrician", fee: 500 },
  { id: "d4", name: "Dr. Iyer", specialty: "Orthopedic", fee: 700 },
  { id: "d5", name: "Dr. Bose", specialty: "Neurologist", fee: 850 },
  { id: "d6", name: "Dr. Fernandes", specialty: "ENT Specialist", fee: 400 },
];

// status can be: "pending", "approved", or "rejected".
export const appointments = [
  // Sam's appointments
  {
    id: "a1",
    patientName: "Patient Sam",
    patientEmail: "sam@med.com",
    doctorId: "d1",
    date: "2026-11-02",
    reason: "Chest pain check-up",
    status: "pending",
  },
  {
    id: "a2",
    patientName: "Patient Sam",
    patientEmail: "sam@med.com",
    doctorId: "d2",
    date: "2026-11-05",
    reason: "Skin rash",
    status: "approved",
  },
  {
    id: "a3",
    patientName: "Patient Sam",
    patientEmail: "sam@med.com",
    doctorId: "d4",
    date: "2026-11-10",
    reason: "Knee pain after running",
    status: "rejected",
  },

  // Priya's appointments
  {
    id: "a4",
    patientName: "Patient Priya",
    patientEmail: "priya@med.com",
    doctorId: "d1",
    date: "2026-11-03",
    reason: "High blood pressure follow-up",
    status: "approved",
  },
  {
    id: "a5",
    patientName: "Patient Priya",
    patientEmail: "priya@med.com",
    doctorId: "d3",
    date: "2026-11-08",
    reason: "Child vaccination",
    status: "pending",
  },

  // John's appointments
  {
    id: "a6",
    patientName: "Patient John",
    patientEmail: "john@med.com",
    doctorId: "d2",
    date: "2026-11-06",
    reason: "Acne treatment",
    status: "pending",
  },
  {
    id: "a7",
    patientName: "Patient John",
    patientEmail: "john@med.com",
    doctorId: "d4",
    date: "2026-11-12",
    reason: "Back pain",
    status: "approved",
  },
  {
    id: "a8",
    patientName: "Patient John",
    patientEmail: "john@med.com",
    doctorId: "d1",
    date: "2026-11-15",
    reason: "Routine heart check-up",
    status: "pending",
  },
];
