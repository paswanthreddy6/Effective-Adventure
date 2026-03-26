"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { generateAppointmentId } from "./utils";

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  disease: string;
  doctorType: string;
  doctorName: string;
  date: string;
  time: string;
  status: "confirmed" | "cancelled" | "completed" | "rescheduled";
  createdAt: string;
}

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id" | "status" | "createdAt">) => Appointment;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  getAppointmentsByPatient: (patientId: string) => Appointment[];
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem("appointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem("appointments", JSON.stringify(newAppointments));
  };

  const addAppointment = (appointmentData: Omit<Appointment, "id" | "status" | "createdAt">): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateAppointmentId(),
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    
    const newAppointments = [...appointments, newAppointment];
    saveAppointments(newAppointments);
    return newAppointment;
  };

  const cancelAppointment = (id: string) => {
    const newAppointments = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: "cancelled" as const } : apt
    );
    saveAppointments(newAppointments);
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    const newAppointments = appointments.map((apt) =>
      apt.id === id
        ? { ...apt, date: newDate, time: newTime, status: "rescheduled" as const }
        : apt
    );
    saveAppointments(newAppointments);
  };

  const getAppointmentsByPatient = (patientId: string) => {
    return appointments.filter((apt) => apt.patientId === patientId);
  };

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        addAppointment,
        cancelAppointment,
        rescheduleAppointment,
        getAppointmentsByPatient,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentsProvider");
  }
  return context;
}
