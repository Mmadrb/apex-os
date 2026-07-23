export type UserRole = 'coach' | 'athlete' | 'franchise_owner' | 'investor';

export interface EvidenceItem {
  confidenceScorePercent: number;
  dataSource: string; // e.g. "120 skeletal frames logged via MediaPipe" or "WHOOP 14-day baseline"
  reasoning: string;
}

export interface AthleteProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  goal: string;
  phase: string;
  coachId: string;
  coachName: string;
  membershipTier: string;
  riskScore: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskReason?: string;
  affiliatedGyms?: string[];
  previousCoaches?: string[];
  healthProfile?: {
    bloodType?: string;
    allergies?: string[];
    conditions?: string[];
    emergencyContact?: string;
    medicalClearance?: string;
  };
  
  // Physical Metrics
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  bodyFatPercent: number;
  bmi: number;
  muscleMassKg: number;
  
  // 8 Circumference Zones (cm)
  circumferences: {
    waist: number;
    chest: number;
    arms: number;
    thighs: number;
    calves: number;
    neck: number;
    hips: number;
    forearms: number;
  };

  // Progress Photos
  photos: {
    date: string;
    front: string;
    side: string;
    back: string;
  }[];

  // Daily Nutrition & Targets
  caloriesTarget: number;
  caloriesLogged: number;
  proteinTargetG: number;
  proteinLoggedG: number;
  carbsTargetG: number;
  carbsLoggedG: number;
  fatsTargetG: number;
  fatsLoggedG: number;
  hydrationOzTarget: number;
  hydrationOzLogged: number;

  // Bio-Wearables Telemetry
  wearableSync: {
    device: string;
    lastSynced: string;
    hrvMs: number;
    hrvBaselineMs: number;
    restingHeartRateBpm: number;
    sleepScore: number;
    sleepHours: number;
    recoveryScore: number;
    acwrRatio: number;
    strainIndex: number;
  };

  // Subjective Biofeedback
  biofeedback: {
    mood: string;
    energyLevel: number;
    stressLevel: number;
    muscleSoreness: number;
    jointAches: string[];
  };

  // Clinical & Biomarkers
  labResults: {
    testDate: string;
    totalTestosteroneNgDl?: number;
    freeTestosteronePgMl?: number;
    fastingGlucoseMgDl?: number;
    hba1cPercent?: number;
    hsCrpMgL?: number;
    t3NgDl?: number;
    t4McgDl?: number;
    cortisolMcgDl?: number;
    ldlMgDl?: number;
    hdlMgDl?: number;
    triglyceridesMgDl?: number;
    flaggedMarkers: string[];
  };

  // Supplements & Medications
  supplements: { name: string; dosage: string; timing: string; status: 'Taken' | 'Pending' }[];
  medications: string[];

  // Movement & Pathology Indicators
  injuries: { area: string; severity: 'Mild' | 'Moderate' | 'Severe'; notes: string }[];

  // Compliance & History
  workoutCompliancePercent: number;
  nutritionCompliancePercent: number;
  activeStreakDays: number;
}

export type WorkoutType = 'abs' | 'everything' | 'cardio' | 'combat' | 'HIIT' | 'RPG fitness' | 'running' | 'strength' | 'stretching' | 'yoga';
export type WorkoutDifficultyTier = 'light' | 'easy' | 'normal' | 'hard' | 'advanced';
export type WorkoutEquipmentMode = 'no equipment' | 'with equipment';

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  equipmentMode: WorkoutEquipmentMode;
  trainingType: WorkoutType;
  intensity: WorkoutDifficultyTier;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tempoDefault: string;
  substitutes: string[];
  caloriesPer10Min?: number;
  videoUrl?: string;
  instructions: string;
}

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  targetRpe: number;
  weightKg: number;
  actualRpe?: number;
  completed: boolean;
  tempo?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  notes?: string;
  sets: WorkoutSet[];
  restSeconds: number;
}

export interface ProgramDay {
  dayName: string;
  focus: string;
  isRestDay: boolean;
  exercises: WorkoutExercise[];
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  targetGoal: string;
  durationWeeks: number;
  periodizationType: 'Linear Block' | 'Daily Undulating (DUP)' | 'Conjugate' | 'Overload Peak';
  days: ProgramDay[];
}

export interface LabMarker {
  name: string;
  value: number;
  unit: string;
  rangeMin: number;
  rangeMax: number;
  status: 'Optimal' | 'Borderline' | 'Critical';
  category: string;
}

export interface FranchiseLocation {
  id: string;
  name: string;
  city: string;
  country: string;
  coachesCount: number;
  activeClientsCount: number;
  monthlyRevenueUsd: number;
  retentionRatePercent: number;
  complianceAveragePercent: number;
  managerName: string;
}

export interface AIRecommendation {
  id: string;
  athleteId: string;
  athleteName: string;
  timestamp: string;
  category: string;
  insight: string;
  suggestedAction: string;
  applied: boolean;
  evidence?: EvidenceItem;
}
