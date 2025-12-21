
export enum GradeLevel {
  P1 = '小学一年级',
  P2 = '小学二年级',
  P3 = '小学三年级',
  P4 = '小学四年级',
  P5 = '小学五年级',
  P6 = '小学六年级',
  M1 = '初中一年级',
  M2 = '初中二年级',
  M3 = '初中三年级',
  H1 = '高中一年级',
  H2 = '高中二年级',
  H3 = '高中三年级'
}

export enum Location {
  Office = '县衙',
  Market = '集市',
  Bank = '钱庄',
  Suburbs = '县郊',
  Farmland = '农田'
}

export enum TimeOfDay {
  Morning = '清晨',
  Noon = '正午',
  Dusk = '傍晚',
  Night = '深夜'
}

export type Subject = '语文' | '数学' | '科学' | '历史' | '地理' | '道德与法治';

export type QuestionType = 'choice' | 'boolean' | 'fill';

export interface Scenario {
  type: QuestionType;
  title: string;
  villagerName: string;
  description: string;
  question: string; // For 'fill', use '___' as a placeholder
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  educationalNote: string;
  subject: Subject;
  knowledgePoint: string;
}

export interface GameState {
  playerName: string;
  grade: GradeLevel;
  currentScore: number;
  reputation: number;
  casesSolved: number;
  currentLocation: Location;
  currentTime: TimeOfDay;
  day: number;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  portrait: string;
  location: Location;
  greeting: string;
  availableTimes: TimeOfDay[];
}
