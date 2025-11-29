export enum LocationContext {
  Bedroom = '卧室',
  Bathroom = '浴室/淋浴间',
  Travel = '旅行/酒店',
  Public = '公共场所/远程',
}

export enum SocialContext {
  Solo = '独处自娱',
  Partnered = '伴侣互动',
  LongDistance = '异地远程',
}

export enum TimeContext {
  Morning = '早晨匆忙',
  Evening = '晚间放松',
  LateNight = '深夜',
  Weekend = '周末闲暇',
}

export enum MoodContext {
  Adventurous = '探索/冒险',
  Relaxing = '放松/治愈',
  Intense = '激情/强烈',
  Playful = '趣味/调皮',
}

export enum ModelProvider {
  Gemini = 'gemini',
  ChatGPT = 'chatgpt',
  DeepSeek = 'deepseek',
}

export interface ContextVariables {
  location: LocationContext;
  social: SocialContext;
  time: TimeContext;
  mood: MoodContext;
}

export interface JourneyStage {
  stageName: string;
  goal: string; // New field
  userAction: string;
  thinking: string;
  feeling: string;
  touchpoints: string; // New field
  painPoints: string;
  designOpportunities: string;
  technicalSupport: string; // 技术实现支撑点
  emotionScore: number; // 1-10 scale for visualization
}

export interface JourneyData {
  title: string;
  summary: string;
  personaName: string;
  stages: JourneyStage[];
  isFallback?: boolean;
}

export interface AppState {
  prompt: string;
  isLoading: boolean;
  variables: ContextVariables;
  data: JourneyData | null;
  error: string | null;
}

declare global {
  interface Window {
    aistudio: any;
  }
}