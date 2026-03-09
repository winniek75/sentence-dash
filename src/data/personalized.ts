import { Question } from "./questions";

export function generatePersonalizedQuestions(profile: { favoriteAnimal: string, favoriteFood: string, favoriteSport: string }): Question[] {
    const questions: Question[] = [];
    let idCounter = 100;

    if (profile.favoriteAnimal) {
        questions.push({
            id: `p_q${idCounter++}`,
            sentence: `My ${profile.favoriteAnimal} ___ in the yard.`,
            blank_index: 2,
            correct_answer: "plays",
            distractors: ["play", "playing"],
            image_url: "animal.png",
            grammar_tag: "present_simple_3rd_personalized",
            ease_factor: 2.5,
            interval_days: 1,
            next_review_date: new Date().toISOString().split('T')[0],
            times_seen: 0,
            times_correct: 0,
            is_mistake_card: false,
            last_played_session: ""
        });
    }

    if (profile.favoriteFood) {
        questions.push({
            id: `p_q${idCounter++}`,
            sentence: `I like eating ___.`,
            blank_index: 3,
            correct_answer: profile.favoriteFood,
            distractors: ["rocks", "paper"], // Naive distractors for MVP
            image_url: "food.png",
            grammar_tag: "vocab_food_personalized",
            ease_factor: 2.5,
            interval_days: 1,
            next_review_date: new Date().toISOString().split('T')[0],
            times_seen: 0,
            times_correct: 0,
            is_mistake_card: false,
            last_played_session: ""
        });
    }
    
    if (profile.favoriteSport) {
        questions.push({
            id: `p_q${idCounter++}`,
            sentence: `We play ___ on weekends.`,
            blank_index: 2,
            correct_answer: profile.favoriteSport,
            distractors: ["sleep", "book"],
            image_url: "sport.png",
            grammar_tag: "vocab_sport_personalized",
            ease_factor: 2.5,
            interval_days: 1,
            next_review_date: new Date().toISOString().split('T')[0],
            times_seen: 0,
            times_correct: 0,
            is_mistake_card: false,
            last_played_session: ""
        });
    }

    return questions;
}
