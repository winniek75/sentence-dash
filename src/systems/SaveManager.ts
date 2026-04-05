import { Question, questionBank as defaultQuestions } from '../data/questions';

export interface MySentence {
  date: string;
  sentence: string;
  sessionScore: number;
}

export interface Session {
  sessionId: string;
  date: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  targetGrammar: string;
  mySentence: string;
}

export interface GameProgress {
  playerName: string;
  playerProfile: {
    favoriteAnimal: string;
    favoriteFood: string;
    favoriteSport: string;
  };
  totalScore: number;
  highScore: number;
  currentStreak: number;
  lastPlayedDate: string;
  questionBank: Question[];
  collectedCards: string[];
  mySentences: MySentence[];
  sessionHistory: Session[];
}

export class SaveManager {
  private static readonly SAVE_KEY = 'sentence_dash_save';

  public static loadProgress(): GameProgress {
    const data = localStorage.getItem(this.SAVE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse save data', e);
      }
    }
    return this.createDefaultProgress();
  }

  public static saveProgress(progress: GameProgress): void {
    try {
      // Small hack for MVP: regenerate personalized questions if profile exists but questions missing
      // (in a full app, we'd do this explicitly on profile save)
      if (progress.playerProfile.favoriteAnimal || progress.playerProfile.favoriteFood || progress.playerProfile.favoriteSport) {
          const hasPersonalized = progress.questionBank.some(q => q.id.startsWith('p_q'));
          if (!hasPersonalized) {
               import('../data/personalized').then(({ generatePersonalizedQuestions }) => {
                   const newQs = generatePersonalizedQuestions(progress.playerProfile);
                   progress.questionBank.push(...newQs);
                   localStorage.setItem(this.SAVE_KEY, JSON.stringify(progress));
               });
               return; // Skip normal save as it will be done async
          }
      }
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }

  private static createDefaultProgress(): GameProgress {
    return {
      playerName: 'Player',
      playerProfile: {
        favoriteAnimal: '',
        favoriteFood: '',
        favoriteSport: ''
      },
      totalScore: 0,
      highScore: 0,
      currentStreak: 0,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      questionBank: JSON.parse(JSON.stringify(defaultQuestions)), // Clone default question bank
      collectedCards: [],
      mySentences: [],
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
