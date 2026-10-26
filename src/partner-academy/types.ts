export type UserRole = 'partner_installer' | 'partner_admin' | 'quext_director';

export interface PartnerCompany {
  id: string;
  name: string;
  code: string;
  region: string;
  tier: 'Gold Certified' | 'Premier Elite' | 'Authorized Partner';
  activeTechnicians: number;
  contactEmail: string;
  joinedDate: string;
  logoUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  companyName: string;
  avatarUrl?: string;
  certifications: string[]; // Certificate IDs
  progress: Record<string, number>; // moduleId -> completion percentage (0-100)
  completedLessons: string[]; // lessonIds
  quizScores: Record<string, number>; // moduleId -> score (0-100)
  certificationDate?: string;
  fieldIdNumber: string;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  chapterId: string;
  title: string;
  durationMinutes: number;
  type: 'concept' | 'interactive_wiring' | 'hardware_install' | 'qa_checklist' | 'field_troubleshooting' | 'interactive_schematic' | 'interactive_onboarding';
  brief: string;
  introParagraph: string;
  stepList?: {
    label?: string;
    text: string;
    subSteps?: string[];
  }[];
  alertWarning?: string;
  infoBox?: string;
  schematicDiagram?: 'rc_elevator_stairwell' | 'rc_electric_strike' | 'rc_double_strike' | 'rc_rb5_elevator' | 'rc_ps914_power' | 'thermostat_wiring_board';
  schematicData?: {
    title: string;
    drawnBy: string;
    projectNumber: string;
    specNotes: string[];
    circuitFlow: { component: string; detail: string }[];
  };
  onboardingScreenshots?: {
    stepNumber: number;
    title: string;
    instruction: string;
    appScreenDescription: string;
  }[];
  specs?: { label: string; value: string }[];
  hardwareImageCallout?: {
    title: string;
    imageUrl: string;
    deviceModel: string;
    description: string;
    badge?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  number: string;
  title: string;
  code: string;
  shortDescription: string;
  overview: string;
  category: 'Climate & IoT' | 'Smart Access' | 'Commercial Hardware' | 'Reader Controllers' | 'Portal Operations' | 'IoT Infrastructure & Gateways';
  hardwareImage: string;
  officialDeviceName?: string;
  officialModel?: string;
  durationMinutes: number;
  difficulty: 'Foundation' | 'Core Field' | 'Advanced Specialist';
  chapters: Chapter[];
  lessons: Lesson[]; // flattened reference for convenience
  practiceQuiz?: {
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
  quiz: {
    passingScore: number;
    questions: QuizQuestion[];
  };
  keyTakeaways: string[];
}

export interface IssuedCertificate {
  certificateId: string;
  technicianId: string;
  technicianName: string;
  technicianEmail: string;
  fieldIdNumber: string;
  companyName: string;
  companyId: string;
  courseTitle: string;
  issueDate: string;
  expiryDate: string;
  score: number;
  credentialCode: string;
  authorizedSigner: string;
  signerTitle: string;
}
