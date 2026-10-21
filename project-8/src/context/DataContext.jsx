import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import {
  doctors as seedDoctors,
  appointments as seedAppointments,
} from "../data/seed.js";

// DataContext holds the doctors list and all appointments.
// It also gives functions to book, approve, and reject appointments.
const DataContext = createContext(null);

export function DataProvider({ children }) {
  // Doctors don't change much, but we still keep them here so
  // every page reads from one place.
  const [doctors, setDoctors] = useLocalStorage(
    "medibook:doctors",
    seedDoctors,
  );
  const [appointments, setAppointments] = useLocalStorage(
    "medibook:appointments",
    seedAppointments,
  );

  // A patient books a new appointment. It always starts as "pending".
  function bookAppointment(newAppt) {
    const appt = {
      id: "a" + Date.now(), // simple unique id
      status: "pending",
      ...newAppt,
    };
    setAppointments([appt, ...appointments]);
  }

  // Change the status of one appointment (used by doctors + admin).
  function setStatus(id, status) {
    setAppointments(
      appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    );
  }

  // Find a doctor's name by id (handy for showing in lists).
  function getDoctorName(doctorId) {
    const doc = doctors.find((d) => d.id === doctorId);
    return doc ? doc.name : "Unknown";
  }

  // Put the data back to the original seed values.
  // Useful in class after editing seed.js, because localStorage
  // keeps the old data until we overwrite it.
  function resetData() {
    setDoctors(seedDoctors);
    setAppointments(seedAppointments);
  }

  const value = {
    doctors,
    appointments,
    bookAppointment,
    setStatus,
    getDoctorName,
    resetData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Instead of writing useContext(DataContext) everywhere, we just call useData().
export function useData() {
  const context = useContext(DataContext);

  // This will be null if we forgot to wrap the app in <DataProvider>.
  if (!context) {
    throw new Error("useData must be used inside a <DataProvider>");
  }

  return context;
}
