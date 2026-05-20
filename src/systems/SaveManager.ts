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

export interface WrongAnswer {
  date: string;
  passageTitle: string;
  level: 'easy' | 'medium' | 'hard';
  type: 'trueFalse' | 'question';
  question: string;
  playerAnswer: string;
  correctAnswer: string;
  explanation: string;
  timesWrong: number;
}

export interface GameProgress {
  playerName: string;
  selectedLevel: 'easy' | 'medium' | 'hard';
  totalScore: number;
  highScore: number;
  sessionHistory: SessionRecord[];
  wrongAnswers: WrongAnswer[];
}

export class SaveManager {
  private static readonly SAVE_KEY = 'reading_dash_save';

  public static loadProgress(): GameProgress {
    const data = localStorage.getItem(this.SAVE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Ensure wrongAnswers array exists (migration for old saves)
        if (!parsed.wrongAnswers) {
          parsed.wrongAnswers = [];
        }
        return parsed;
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
      sessionHistory: [],
      wrongAnswers: []
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

  /**
   * Record a wrong answer. If the same question was already wrong before,
   * increment its timesWrong counter instead of adding a duplicate.
   */
  public static recordWrongAnswer(entry: Omit<WrongAnswer, 'timesWrong'>): void {
    const progress = this.loadProgress();

    // Check if this exact question was already recorded
    const existing = progress.wrongAnswers.find(
      w => w.question === entry.question && w.passageTitle === entry.passageTitle
    );

    if (existing) {
      existing.timesWrong++;
      existing.date = entry.date;
      existing.playerAnswer = entry.playerAnswer;
    } else {
      progress.wrongAnswers.push({ ...entry, timesWrong: 1 });
    }

    // Keep only the most recent 200 wrong answers
    if (progress.wrongAnswers.length > 200) {
      progress.wrongAnswers = progress.wrongAnswers.slice(-200);
    }

    this.saveProgress(progress);
  }

  /**
   * Get wrong answers, optionally filtered by level
   */
  public static getWrongAnswers(level?: 'easy' | 'medium' | 'hard'): WrongAnswer[] {
    const progress = this.loadProgress();
    if (level) {
      return progress.wrongAnswers.filter(w => w.level === level);
    }
    return progress.wrongAnswers;
  }

  /**
   * Get the most frequently wrong answers (sorted by timesWrong descending)
   */
  public static getMostMissed(limit: number = 10): WrongAnswer[] {
    const progress = this.loadProgress();
    return [...progress.wrongAnswers]
      .sort((a, b) => b.timesWrong - a.timesWrong)
      .slice(0, limit);
  }
}
