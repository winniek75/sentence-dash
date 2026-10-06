import { Level } from './Launch';

export interface SessionRecord {
  sessionId: string;
  date: string;
  score: number;
  level: Level;
  tfCorrect: number;
  tfTotal: number;
  qCorrect: number;
  qTotal: number;
  bestStreak: number;
  timeBonus: number;
  /** 以下は 2026-10 以降の記録のみ */
  mode?: 'careful' | 'speed';
  passages?: number;
  /** 時間切れの問題数（誤答とは別に数える） */
  timeouts?: number;
}

export interface WrongAnswer {
  date: string;
  passageTitle: string;
  level: Level;
  type: 'trueFalse' | 'question';
  question: string;
  playerAnswer: string;
  correctAnswer: string;
  explanation: string;
  timesWrong: number;
}

export interface GameProgress {
  playerName: string;
  selectedLevel: Level;
  selectedMode?: 'careful' | 'speed';
  selectedCount?: number;
  /** 最近読んだ文章のID（同じ文章ばかり出ないようにするため） */
  recentPassages?: string[];
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
  public static getWrongAnswers(level?: Level): WrongAnswer[] {
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
    // 以前の版が保存した「時間切れ」は誤答ではないので除く
    return progress.wrongAnswers
      .filter(w => w.playerAnswer !== 'Time up')
      .sort((a, b) => b.timesWrong - a.timesWrong)
      .slice(0, limit);
  }

  /** 今回読んだ文章を記録する（直近24件まで） */
  public static rememberPassages(ids: string[]): void {
    const progress = this.loadProgress();
    const recent = (progress.recentPassages || []).filter(id => !ids.includes(id));
    progress.recentPassages = [...recent, ...ids].slice(-24);
    this.saveProgress(progress);
  }
}
