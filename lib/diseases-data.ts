export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  suggestedDoctorType: string;
  severity: "mild" | "moderate" | "severe";
}

export const diseases: Disease[] = [
  {
    id: "1",
    name: "Common Cold",
    description: "A viral infection of the upper respiratory tract affecting the nose and throat. Usually harmless and resolves within a week or two.",
    symptoms: ["Runny nose", "Sneezing", "Sore throat", "Mild headache", "Body aches"],
    suggestedDoctorType: "General Physician",
    severity: "mild",
  },
  {
    id: "2",
    name: "Fever",
    description: "An elevated body temperature, usually indicating an infection or illness. Normal body temperature is around 98.6°F (37°C).",
    symptoms: ["High temperature", "Chills", "Sweating", "Headache", "Muscle aches", "Fatigue"],
    suggestedDoctorType: "General Physician",
    severity: "moderate",
  },
  {
    id: "3",
    name: "Diabetes",
    description: "A chronic condition affecting how your body processes blood sugar (glucose). Requires ongoing management and lifestyle modifications.",
    symptoms: ["Increased thirst", "Frequent urination", "Unexplained weight loss", "Fatigue", "Blurred vision"],
    suggestedDoctorType: "Endocrinologist",
    severity: "severe",
  },
  {
    id: "4",
    name: "Hypertension",
    description: "A condition where blood pressure against artery walls is too high. Often called the 'silent killer' as it may have no symptoms.",
    symptoms: ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness", "Chest pain"],
    suggestedDoctorType: "Cardiologist",
    severity: "severe",
  },
  {
    id: "5",
    name: "Migraine",
    description: "A severe headache often accompanied by nausea, vomiting, and sensitivity to light and sound. Can last hours to days.",
    symptoms: ["Intense headache", "Nausea", "Sensitivity to light", "Visual disturbances", "Dizziness"],
    suggestedDoctorType: "Neurologist",
    severity: "moderate",
  },
  {
    id: "6",
    name: "Asthma",
    description: "A chronic respiratory condition causing airway inflammation and difficulty breathing. Requires proper management and medication.",
    symptoms: ["Shortness of breath", "Wheezing", "Chest tightness", "Coughing", "Difficulty sleeping due to breathing"],
    suggestedDoctorType: "Pulmonologist",
    severity: "moderate",
  },
  {
    id: "7",
    name: "Arthritis",
    description: "Inflammation of one or more joints, causing pain and stiffness that can worsen with age. Multiple types exist.",
    symptoms: ["Joint pain", "Stiffness", "Swelling", "Reduced range of motion", "Redness around joints"],
    suggestedDoctorType: "Rheumatologist",
    severity: "moderate",
  },
  {
    id: "8",
    name: "Allergies",
    description: "Immune system reactions to substances that are usually harmless. Can range from mild to severe reactions.",
    symptoms: ["Sneezing", "Itchy eyes", "Runny nose", "Skin rashes", "Swelling"],
    suggestedDoctorType: "Allergist",
    severity: "mild",
  },
  {
    id: "9",
    name: "Depression",
    description: "A mood disorder causing persistent feelings of sadness and loss of interest. Affects how you feel, think, and behave.",
    symptoms: ["Persistent sadness", "Loss of interest", "Sleep disturbances", "Fatigue", "Difficulty concentrating"],
    suggestedDoctorType: "Psychiatrist",
    severity: "moderate",
  },
  {
    id: "10",
    name: "Skin Infection",
    description: "Bacterial, viral, or fungal infections affecting the skin. Can range from minor to serious conditions requiring treatment.",
    symptoms: ["Redness", "Swelling", "Pain or tenderness", "Warmth", "Pus or discharge"],
    suggestedDoctorType: "Dermatologist",
    severity: "mild",
  },
  {
    id: "11",
    name: "Gastritis",
    description: "Inflammation of the stomach lining, often caused by infection, regular use of pain relievers, or excessive alcohol.",
    symptoms: ["Stomach pain", "Nausea", "Vomiting", "Bloating", "Loss of appetite"],
    suggestedDoctorType: "Gastroenterologist",
    severity: "moderate",
  },
  {
    id: "12",
    name: "Back Pain",
    description: "Pain affecting the lower, middle, or upper back. Can result from injury, activity, or medical conditions.",
    symptoms: ["Muscle ache", "Shooting pain", "Limited flexibility", "Difficulty standing", "Pain radiating down legs"],
    suggestedDoctorType: "Orthopedic",
    severity: "moderate",
  },
];

export const doctorTypes = [
  "General Physician",
  "Cardiologist",
  "Dermatologist",
  "Neurologist",
  "Orthopedic",
  "Pediatrician",
  "Psychiatrist",
  "Pulmonologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Allergist",
  "Rheumatologist",
];

export const doctors: { name: string; type: string; available: boolean }[] = [
  { name: "Dr. Sarah Johnson", type: "General Physician", available: true },
  { name: "Dr. Michael Chen", type: "General Physician", available: true },
  { name: "Dr. Emily Williams", type: "Cardiologist", available: true },
  { name: "Dr. James Brown", type: "Cardiologist", available: false },
  { name: "Dr. Lisa Anderson", type: "Dermatologist", available: true },
  { name: "Dr. Robert Taylor", type: "Neurologist", available: true },
  { name: "Dr. Jennifer Davis", type: "Orthopedic", available: true },
  { name: "Dr. William Martinez", type: "Pediatrician", available: true },
  { name: "Dr. Amanda Wilson", type: "Psychiatrist", available: true },
  { name: "Dr. David Garcia", type: "Pulmonologist", available: true },
  { name: "Dr. Jessica Lee", type: "Endocrinologist", available: true },
  { name: "Dr. Christopher Moore", type: "Gastroenterologist", available: true },
  { name: "Dr. Rachel Thompson", type: "Allergist", available: true },
  { name: "Dr. Daniel White", type: "Rheumatologist", available: true },
];

export const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export function searchDiseases(query: string): Disease[] {
  const lowercaseQuery = query.toLowerCase().trim();
  if (!lowercaseQuery) return [];
  
  return diseases.filter(
    (disease) =>
      disease.name.toLowerCase().includes(lowercaseQuery) ||
      disease.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(lowercaseQuery)
      )
  );
}

export function getDoctorsByType(type: string): typeof doctors {
  return doctors.filter((doctor) => doctor.type === type && doctor.available);
}
