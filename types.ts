export enum UserRole {
  ADMIN = 'ADMIN',
  INPUTER = 'INPUTER',
  GUEST = 'GUEST',
}

export enum AgeGroup {
  CHILD_0_14 = '0-14',
  YOUTH_15_24 = '15-24',
  ADULT_25_59 = '25-59',
  SENIOR_60_PLUS = '60+',
}

export interface Demographics {
  ageGroup: AgeGroup;
  male: number;
  female: number;
}

export interface Office {
  id: string;
  name: string;
  region: string;
}

export interface SubmissionRecord {
  id: string;
  officeId: string;
  officeName: string; // Denormalized for easier display
  timestamp: number;
  data: Demographics[];
  notes?: string;
}

export interface DashboardStats {
  totalMale: number;
  totalFemale: number;
  totalPopulation: number;
  byOffice: { name: string; count: number }[];
}
