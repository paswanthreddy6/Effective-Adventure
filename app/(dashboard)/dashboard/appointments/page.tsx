"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAppointments, type Appointment } from "@/lib/appointments-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatTime } from "@/lib/utils";
import { timeSlots } from "@/lib/diseases-data";
import {
  Calendar,
  Clock,
  User,
  CalendarCheck,
  X,
  RefreshCw,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { getAppointmentsByPatient, cancelAppointment, rescheduleAppointment } = useAppointments();
  
  const [rescheduleModal, setRescheduleModal] = useState<{
    open: boolean;
    appointment: Appointment | null;
  }>({ open: false, appointment: null });
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [filter, setFilter] = useState<"all" | "confirmed" | "cancelled" | "rescheduled" | "completed">("all");

  const appointments = user ? getAppointmentsByPatient(user.id) : [];
  
  const filteredAppointments = appointments
    .filter((apt) => filter === "all" || apt.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      cancelAppointment(id);
    }
  };

  const handleReschedule = () => {
    if (rescheduleModal.appointment && newDate && newTime) {
      rescheduleAppointment(rescheduleModal.appointment.id, newDate, newTime);
      setRescheduleModal({ open: false, appointment: null });
      setNewDate("");
      setNewTime("");
    }
  };

  const downloadPDF = async (apt: Appointment) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(2, 132, 199);
    doc.text("TeleMed - Appointment Details", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const details = [
      ["Appointment ID:", apt.id],
      ["Patient Name:", apt.patientName],
      ["Condition:", apt.disease],
      ["Doctor:", apt.doctorName],
      ["Specialty:", apt.doctorType],
      ["Date:", formatDate(new Date(apt.date))],
      ["Time:", formatTime(apt.time)],
      ["Status:", apt.status.toUpperCase()],
      ["Booked On:", new Date(apt.createdAt).toLocaleDateString()],
    ];
    
    let y = 40;
    details.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, y);
      y += 10;
    });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This is a computer-generated document.", 20, 140);
    doc.text("For any queries, contact support@telemed.com", 20, 148);
    
    doc.save(`appointment-${apt.id}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="success">Confirmed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "rescheduled":
        return <Badge variant="warning">Rescheduled</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your booked appointments
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(["all", "confirmed", "rescheduled", "cancelled", "completed"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== "all" && (
              <span className="ml-1 text-xs">
                ({appointments.filter((a) => a.status === status).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{apt.doctorName}</h3>
                        {getStatusBadge(apt.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{apt.doctorType}</p>
                      <p className="text-sm text-foreground">{apt.disease}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(new Date(apt.date))}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(apt.time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {apt.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPDF(apt)}
                      className="gap-1"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                    {(apt.status === "confirmed" || apt.status === "rescheduled") && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRescheduleModal({ open: true, appointment: apt });
                            setNewDate(apt.date);
                            setNewTime(apt.time);
                          }}
                          className="gap-1"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Reschedule
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(apt.id)}
                          className="gap-1"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CalendarCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filter === "all" ? "No appointments yet" : `No ${filter} appointments`}
            </h3>
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "Start by booking your first appointment with one of our specialists"
                : "Try selecting a different filter to see more appointments"}
            </p>
            {filter === "all" && (
              <Button asChild>
                <a href="/dashboard/book">Book Appointment</a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal.open && rescheduleModal.appointment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Reschedule Appointment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Current appointment</p>
                <p className="font-medium text-foreground">
                  {formatDate(new Date(rescheduleModal.appointment.date))} at{" "}
                  {formatTime(rescheduleModal.appointment.time)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Date</label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={getTomorrowDate()}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTime(slot)}
                      className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                        newTime === slot
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setRescheduleModal({ open: false, appointment: null })}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReschedule}
                  disabled={!newDate || !newTime}
                  className="flex-1"
                >
                  Confirm Reschedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
