"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useAppointments } from "@/lib/appointments-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatTime } from "@/lib/utils";
import { Bell, X, Calendar, Clock } from "lucide-react";

interface Notification {
  id: string;
  type: "appointment_reminder" | "appointment_confirmed" | "info";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationsPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { getAppointmentsByPatient } = useAppointments();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const appointments = getAppointmentsByPatient(user.id);
    const upcomingAppointments = appointments.filter(
      (apt) =>
        (apt.status === "confirmed" || apt.status === "rescheduled") &&
        new Date(apt.date) >= new Date()
    );

    const newNotifications: Notification[] = upcomingAppointments.map((apt) => ({
      id: apt.id,
      type: "appointment_reminder" as const,
      title: "Upcoming Appointment",
      message: `Your appointment with ${apt.doctorName} is scheduled for ${formatDate(new Date(apt.date))} at ${formatTime(apt.time)}`,
      time: apt.date,
      read: false,
    }));

    // Add a welcome notification if no appointments
    if (newNotifications.length === 0) {
      newNotifications.push({
        id: "welcome",
        type: "info",
        title: "Welcome to TeleMed",
        message: "Start by searching for a condition and booking your first appointment.",
        time: new Date().toISOString(),
        read: false,
      });
    }

    setNotifications(newNotifications);
  }, [user, getAppointmentsByPatient]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <Card className="fixed top-16 right-4 w-80 max-h-96 overflow-hidden z-50 shadow-lg lg:top-4 lg:right-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardContent className="p-0 max-h-72 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.type === "appointment_reminder"
                          ? "bg-primary/10"
                          : "bg-secondary/10"
                      }`}
                    >
                      {notification.type === "appointment_reminder" ? (
                        <Calendar className="w-4 h-4 text-primary" />
                      ) : (
                        <Bell className="w-4 h-4 text-secondary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
