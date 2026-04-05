export interface SessionRecord {
  sessionId: string;
  date: string;
  score: number;
  level: 'easy' | 'medium' | 'hard';
  tfCorrect: number;
  tfTotal: number;
  qCorrect: number;
  qTotal: number;
  bestStreak: number;
  timeBonus: number;
}

export interface GameProgress {
  playerName: string;
  selectedLevel: 'easy' | 'medium' | 'hard';
  totalScore: number;
  highScore: number;
  sessionHistory: SessionRecord[];
}

export class SaveManager {
  private static readonly SAVE_KEY = 'reading_dash_save';

  public static loadProgress(): GameProgress {
    const data = localStorage.getItem(this.SAVE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (_e) {
        console.error('Failed to parse save data');
      }
    }
    return this.createDefaultProgress();
  }

  public static saveProgress(progress: GameProgress): void {
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(progress));
    } catch (_e) {
      console.error('Failed to save progress');
    }
  }

  private static createDefaultProgress(): GameProgress {
    return {
      playerName: '',
      selectedLevel: 'easy',
      totalScore: 0,
      highScore: 0,
      sessionHistory: []
    };
  }

  public static updateHighScore(score: number): void {
    const progress = this.loadProgress();
    progress.totalScore += score;
    if (score > progress.highScore) {
      progress.highScore = score;
    }
    this.saveProgress(progress);
  }
}
