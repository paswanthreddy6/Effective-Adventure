"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useAppointments } from "@/lib/appointments-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { doctorTypes, getDoctorsByType, timeSlots, diseases } from "@/lib/diseases-data";
import { formatTime } from "@/lib/utils";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

function BookAppointmentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addAppointment } = useAppointments();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<{
    id: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    patientName: "",
    disease: "",
    doctorType: "",
    doctorName: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const diseaseParam = searchParams.get("disease");
    const doctorTypeParam = searchParams.get("doctorType");

    if (user?.name) {
      setFormData((prev) => ({ ...prev, patientName: user.name }));
    }
    if (diseaseParam) {
      setFormData((prev) => ({ ...prev, disease: diseaseParam }));
    }
    if (doctorTypeParam) {
      setFormData((prev) => ({ ...prev, doctorType: doctorTypeParam }));
    }
  }, [searchParams, user]);

  const availableDoctors = formData.doctorType
    ? getDoctorsByType(formData.doctorType)
    : [];

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const appointment = addAppointment({
      patientName: formData.patientName,
      patientId: user.id,
      disease: formData.disease,
      doctorType: formData.doctorType,
      doctorName: formData.doctorName,
      date: formData.date,
      time: formData.time,
    });

    setConfirmedAppointment({
      id: appointment.id,
      patientName: appointment.patientName,
      doctorName: appointment.doctorName,
      date: appointment.date,
      time: appointment.time,
    });

    setIsSubmitting(false);
    setStep(4);
  };

  const canProceedToStep2 = formData.disease && formData.doctorType;
  const canProceedToStep3 = canProceedToStep2 && formData.doctorName;
  const canSubmit = canProceedToStep3 && formData.date && formData.time;

  if (step === 4 && confirmedAppointment) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-secondary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Appointment Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Your appointment has been successfully booked
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Appointment ID</p>
                <p className="font-mono font-semibold text-foreground">{confirmedAppointment.id}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="success">Confirmed</Badge>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Patient Name</p>
                <p className="font-semibold text-foreground">{confirmedAppointment.patientName}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Doctor</p>
                <p className="font-semibold text-foreground">{confirmedAppointment.doctorName}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold text-foreground">
                  {new Date(confirmedAppointment.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-semibold text-foreground">{formatTime(confirmedAppointment.time)}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => router.push("/dashboard/appointments")}
                className="flex-1"
              >
                View All Appointments
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1);
                  setFormData({
                    patientName: user?.name || "",
                    disease: "",
                    doctorType: "",
                    doctorName: "",
                    date: "",
                    time: "",
                  });
                  setConfirmedAppointment(null);
                }}
                className="flex-1"
              >
                Book Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Book Appointment</h1>
        <p className="text-muted-foreground mt-1">
          Schedule a consultation with our healthcare professionals
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-xl">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 sm:w-24 h-1 mx-2 ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Disease & Doctor Type */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Condition & Specialty</CardTitle>
              <CardDescription>
                Tell us about your condition and choose a doctor specialty
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Patient Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="pl-10"
                    placeholder="Enter patient name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Disease / Condition</label>
                <select
                  value={formData.disease}
                  onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">Select a condition</option>
                  {diseases.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Doctor Specialty</label>
                <select
                  value={formData.doctorType}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorType: e.target.value, doctorName: "" })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                >
                  <option value="">Select a specialty</option>
                  {doctorTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canProceedToStep2}
                className="w-full"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Choose Your Doctor</CardTitle>
              <CardDescription>
                Select from available {formData.doctorType}s
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDoctors.length > 0 ? (
                <div className="grid gap-3">
                  {availableDoctors.map((doctor) => (
                    <div
                      key={doctor.name}
                      onClick={() => setFormData({ ...formData, doctorName: doctor.name })}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.doctorName === doctor.name
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">{doctor.type}</p>
                        </div>
                        {formData.doctorName === doctor.name && (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No doctors available for this specialty</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className="flex-1"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Select Date & Time</CardTitle>
              <CardDescription>
                Choose your preferred appointment slot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={getTomorrowDate()}
                  max={getMaxDate()}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setFormData({ ...formData, time: slot })}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        formData.time === slot
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <Card className="bg-muted/50 border-0">
                <CardContent className="p-4">
                  <h4 className="font-medium text-foreground mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Patient:</span>
                      <span className="text-foreground">{formData.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition:</span>
                      <span className="text-foreground">{formData.disease}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <span className="text-foreground">{formData.doctorName}</span>
                    </div>
                    {formData.date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="text-foreground">
                          {new Date(formData.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                    {formData.time && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="text-foreground">{formatTime(formData.time)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button type="submit" disabled={!canSubmit || isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
