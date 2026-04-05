import { MemoryEngine } from './MemoryEngine';
import { Question } from '../data/questions';

export class QuestionBankManager {
  private memoryEngine: MemoryEngine;
  private sessionQueue: Question[] = [];

  constructor(memoryEngine: MemoryEngine) {
    this.memoryEngine = memoryEngine;
  }

  public initializeSessionQueue(targetGrammar: string, size: number = 10) {
    this.sessionQueue = [];
    
    const progress = this.memoryEngine.getProgress();
    const today = new Date().toISOString().split('T')[0];

    // Priority 1: Mistake cards from previous plays
    const mistakes = progress.questionBank.filter(q => q.is_mistake_card);
    
    // Priority 2: Due for review today
    const dues = progress.questionBank.filter(q => q.next_review_date <= today && !q.is_mistake_card);
    
    // Priority 3: Target grammar questions that are new
    const targetNews = progress.questionBank.filter(q => 
        q.grammar_tag === targetGrammar && q.times_seen === 0 && !q.is_mistake_card && q.next_review_date > today
    );

    // Priority 4: Random other new questions
    const generalNews = progress.questionBank.filter(q => 
        q.grammar_tag !== targetGrammar && q.times_seen === 0 && !q.is_mistake_card && q.next_review_date > today
    );

    // Build queue
    // We want the first question to be Target Grammar ( इजीレベル固定 - simple)
    const firstTargetQuestion = targetNews.length > 0 ? targetNews.shift() : 
                               (dues.find(q => q.grammar_tag === targetGrammar) || progress.questionBank[0]);
    
    if (firstTargetQuestion) {
        this.sessionQueue.push(firstTargetQuestion);
    }

    // Mix the rest up to `size`
    let pool = [...mistakes, ...dues, ...targetNews, ...generalNews];
    // Remove duplicates if any (e.g. firstTargetQuestion was in dues)
    pool = pool.filter(q => q.id !== firstTargetQuestion?.id);
    
    // Shuffle pool partly to add variety
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    // Take what we need
    while (this.sessionQueue.length < size && pool.length > 0) {
        this.sessionQueue.push(pool.shift()!);
    }

    // If still not enough, repeat questions (shouldn't happen with large banks but good fallback)
    while (this.sessionQueue.length < size) {
        const randomQ = progress.questionBank[Math.floor(Math.random() * progress.questionBank.length)];
        this.sessionQueue.push(randomQ);
    }
  }

  public getNextQuestion(): Question {
    // If we run out of questions in queue, repeat the last one or pull a random one
    if (this.sessionQueue.length === 0) {
        const progress = this.memoryEngine.getProgress();
        return progress.questionBank[Math.floor(Math.random() * progress.questionBank.length)];
    }
    return this.sessionQueue.shift()!;
  }
}
