import { AgeGroup, Office, SubmissionRecord } from './types';

export const OFFICES: Office[] = [
  { id: 'off_01', name: 'Headquarters - Manila', region: 'NCR' },
  { id: 'off_02', name: 'Regional Office - Cebu', region: 'Visayas' },
  { id: 'off_03', name: 'Regional Office - Davao', region: 'Mindanao' },
  { id: 'off_04', name: 'Satellite Office - Baguio', region: 'Luzon' },
];

export const INITIAL_RECORDS: SubmissionRecord[] = [
  {
    id: 'rec_init_1',
    officeId: 'off_01',
    officeName: 'Headquarters - Manila',
    timestamp: Date.now() - 86400000,
    data: [
      { ageGroup: AgeGroup.CHILD_0_14, male: 45, female: 50 },
      { ageGroup: AgeGroup.YOUTH_15_24, male: 120, female: 135 },
      { ageGroup: AgeGroup.ADULT_25_59, male: 300, female: 280 },
      { ageGroup: AgeGroup.SENIOR_60_PLUS, male: 60, female: 75 },
    ]
  },
  {
    id: 'rec_init_2',
    officeId: 'off_02',
    officeName: 'Regional Office - Cebu',
    timestamp: Date.now() - 172800000,
    data: [
      { ageGroup: AgeGroup.CHILD_0_14, male: 30, female: 25 },
      { ageGroup: AgeGroup.YOUTH_15_24, male: 80, female: 90 },
      { ageGroup: AgeGroup.ADULT_25_59, male: 150, female: 160 },
      { ageGroup: AgeGroup.SENIOR_60_PLUS, male: 40, female: 45 },
    ]
  }
];

export const EMPTY_DEMOGRAPHICS = [
  { ageGroup: AgeGroup.CHILD_0_14, male: 0, female: 0 },
  { ageGroup: AgeGroup.YOUTH_15_24, male: 0, female: 0 },
  { ageGroup: AgeGroup.ADULT_25_59, male: 0, female: 0 },
  { ageGroup: AgeGroup.SENIOR_60_PLUS, male: 0, female: 0 },
];
