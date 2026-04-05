import { Question } from '../data/questions';
import { SaveManager, GameProgress } from './SaveManager';

export class MemoryEngine {
  private progress: GameProgress;

  constructor() {
    this.progress = SaveManager.loadProgress();
  }

  /**
   * Returns questions that are due for review today or are mistake cards.
   */
  public getDueQuestions(limit: number = 5): Question[] {
    const today = new Date().toISOString().split('T')[0];
    
    // Sort by: mistakes first, then due today, then lowest times seen
    const sorted = [...this.progress.questionBank].sort((a, b) => {
      if (a.is_mistake_card && !b.is_mistake_card) return -1;
      if (!a.is_mistake_card && b.is_mistake_card) return 1;
      
      const aDue = a.next_review_date <= today;
      const bDue = b.next_review_date <= today;
      
      if (aDue && !bDue) return -1;
      if (!aDue && bDue) return 1;
      
      return a.times_seen - b.times_seen;
    });

    return sorted.slice(0, limit);
  }

  /**
   * Update question based on SM-2 algorithm
   */
  public processAnswer(questionId: string, isCorrect: boolean, sessionId: string): void {
    const qIndex = this.progress.questionBank.findIndex(q => q.id === questionId);
    if (qIndex === -1) return;

    const q = this.progress.questionBank[qIndex];
    q.times_seen++;
    q.last_played_session = sessionId;

    if (isCorrect) {
      q.times_correct++;
      // SM-2 correct logic
      if (q.is_mistake_card) {
        // Recovered from a mistake
        q.is_mistake_card = false;
        q.interval_days = 2; // slight bump after fixing a mistake
      } else {
        q.interval_days = Math.min(Math.round(q.interval_days * q.ease_factor), 30);
      }
      
      // Calculate next review date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + q.interval_days);
      q.next_review_date = nextDate.toISOString().split('T')[0];
      
      // Collect card if not already collected and hit a threshold
      if (q.times_correct === 1 && !this.progress.collectedCards.includes(q.id)) {
        this.progress.collectedCards.push(q.id);
      }
    } else {
      // SM-2 incorrect logic
      q.is_mistake_card = true;
      q.interval_days = 1;
      q.ease_factor = Math.max(1.3, q.ease_factor - 0.2); // Decrease ease but never drop below 1.3
      
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + q.interval_days);
      q.next_review_date = nextDate.toISOString().split('T')[0];
    }

    SaveManager.saveProgress(this.progress);
  }

  public getProgress(): GameProgress {
    return this.progress;
  }
}
