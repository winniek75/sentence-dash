export interface Question {
  id: string;
  sentence: string;
  blank_index?: number;
  correct_answer?: string;
  distractors?: string[];
  image_url: string;
  grammar_tag: string;
  ease_factor: number;
  interval_days: number;
  next_review_date: string;
  times_seen: number;
  times_correct: number;
  is_mistake_card: boolean;
  last_played_session: string;
  words_shuffled?: string[];
  correct_order?: string[];
}

export const questionBank: Question[] = [
  {
    id: "q001",
    sentence: "The dog ___ in the park.",
    blank_index: 2,
    correct_answer: "runs",
    distractors: ["run", "running"],
    image_url: "dog_park.png",
    grammar_tag: "present_simple_3rd",
    ease_factor: 2.5,
    interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0,
    times_correct: 0,
    is_mistake_card: false,
    last_played_session: ""
  },
  {
    id: "q002",
    sentence: "She ___ her homework every night.",
    blank_index: 1,
    correct_answer: "does",
    distractors: ["do", "doing"],
    image_url: "girl_homework.png",
    grammar_tag: "present_simple_3rd",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q003",
    sentence: "The cat sits ___ the mat.",
    blank_index: 2,
    correct_answer: "on",
    distractors: ["in", "at"],
    image_url: "cat_mat.png",
    grammar_tag: "preposition_place",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q004",
    sentence: "I like ___ apples.",
    blank_index: 2,
    correct_answer: "eating",
    distractors: ["eat", "eats"],
    image_url: "child_apple.png",
    grammar_tag: "gerund_after_like",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q005",
    sentence: "They ___ playing soccer now.",
    blank_index: 1,
    correct_answer: "are",
    distractors: ["is", "am"],
    image_url: "kids_soccer.png",
    grammar_tag: "present_continuous_they",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q006",
    sentence: "He ___ to school by bus.",
    blank_index: 1,
    correct_answer: "goes",
    distractors: ["go", "going"],
    image_url: "boy_bus.png",
    grammar_tag: "present_simple_3rd",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q007",
    sentence: "There ___ a cat on the chair.",
    blank_index: 1,
    correct_answer: "is",
    distractors: ["are", "be"],
    image_url: "cat_chair.png",
    grammar_tag: "there_is_are",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q008",
    sentence: "My mom ___ dinner in the kitchen.",
    blank_index: 1,
    correct_answer: "makes",
    distractors: ["make", "making"],
    image_url: "mom_cooking.png",
    grammar_tag: "present_simple_3rd",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q009",
    sentence: "The bird flies high in the sky.",
    words_shuffled: ["flies", "the sky", "The bird", "high in"],
    correct_order: ["The bird", "flies", "high in", "the sky"],
    image_url: "bird_sky.png",
    grammar_tag: "word_order_basic",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
  {
    id: "q010",
    sentence: "We ___ TV after dinner.",
    blank_index: 1,
    correct_answer: "watch",
    distractors: ["watches", "watching"],
    image_url: "family_tv.png",
    grammar_tag: "present_simple_we",
    ease_factor: 2.5, interval_days: 1,
    next_review_date: "2025-03-10",
    times_seen: 0, times_correct: 0,
    is_mistake_card: false, last_played_session: ""
  },
    { id: "q011", sentence: "The sun ___ in the east.", blank_index: 2, correct_answer: "rises", distractors: ["rise", "rising"], image_url: "sun.png", grammar_tag: "present_simple", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q012", sentence: "I want to ___ a doctor.", blank_index: 3, correct_answer: "be", distractors: ["am", "is"], image_url: "doctor.png", grammar_tag: "infinitive", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q013", sentence: "They are ___ basketball now.", blank_index: 2, correct_answer: "playing", distractors: ["play", "plays"], image_url: "basketball.png", grammar_tag: "present_continuous", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q014", sentence: "My sister ___ two cats.", blank_index: 2, correct_answer: "has", distractors: ["have", "having"], image_url: "cats.png", grammar_tag: "have_has", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q015", sentence: "We go to sleep ___ night.", blank_index: 4, correct_answer: "at", distractors: ["in", "on"], image_url: "night.png", grammar_tag: "preposition_time", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q016", sentence: "The book is ___ the table.", blank_index: 3, correct_answer: "on", distractors: ["in", "at"], image_url: "table.png", grammar_tag: "preposition_place", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q017", sentence: "That apple is very ___.", blank_index: 4, correct_answer: "red", distractors: ["read", "blue"], image_url: "apple.png", grammar_tag: "adjective", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q018", sentence: "He is jumping on the bed.", words_shuffled: ["on the", "bed", "He is", "jumping"], correct_order: ["He is", "jumping", "on the", "bed"], image_url: "bed.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q019", sentence: "Can you ___ me?", blank_index: 2, correct_answer: "help", distractors: ["helps", "helping"], image_url: "help.png", grammar_tag: "modal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q020", sentence: "The ___ are in the garden.", blank_index: 1, correct_answer: "flowers", distractors: ["flower", "flowering"], image_url: "garden.png", grammar_tag: "plural_noun", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q021", sentence: "I ___ a book yesterday.", blank_index: 1, correct_answer: "read", distractors: ["reading", "reads"], image_url: "book.png", grammar_tag: "past_simple", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q022", sentence: "He ___ a new car.", blank_index: 1, correct_answer: "bought", distractors: ["buy", "buys"], image_url: "car.png", grammar_tag: "past_simple", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q023", sentence: "We went to the beach.", words_shuffled: ["to the", "beach", "We", "went"], correct_order: ["We", "went", "to the", "beach"], image_url: "beach.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q024", sentence: "She is __ than me.", blank_index: 2, correct_answer: "taller", distractors: ["tall", "tallest"], image_url: "tall.png", grammar_tag: "comparative", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q025", sentence: "It is the ___ day of the year.", blank_index: 3, correct_answer: "hottest", distractors: ["hot", "hotter"], image_url: "hot.png", grammar_tag: "superlative", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q026", sentence: "Look ___ the window.", blank_index: 1, correct_answer: "at", distractors: ["on", "in"], image_url: "window.png", grammar_tag: "preposition", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q027", sentence: "___ is your name?", blank_index: 0, correct_answer: "What", distractors: ["Where", "Who"], image_url: "question.png", grammar_tag: "wh_question", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q028", sentence: "___ are you going?", blank_index: 0, correct_answer: "Where", distractors: ["What", "Why"], image_url: "go.png", grammar_tag: "wh_question", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q029", sentence: "The monkey eats banana.", words_shuffled: ["eats", "banana", "The", "monkey"], correct_order: ["The", "monkey", "eats", "banana"], image_url: "monkey.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q030", sentence: "He is my best ___.", blank_index: 4, correct_answer: "friend", distractors: ["friends", "friendly"], image_url: "friend.png", grammar_tag: "noun", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q031", sentence: "Please ___ the door.", blank_index: 1, correct_answer: "close", distractors: ["closes", "closing"], image_url: "door.png", grammar_tag: "imperative", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q032", sentence: "I don't ___ any money.", blank_index: 2, correct_answer: "have", distractors: ["has", "having"], image_url: "money.png", grammar_tag: "have_has", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q033", sentence: "Do you ___ English?", blank_index: 2, correct_answer: "speak", distractors: ["speaks", "speaking"], image_url: "english.png", grammar_tag: "present_simple", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q034", sentence: "The baby is crying.", words_shuffled: ["is", "The", "baby", "crying"], correct_order: ["The", "baby", "is", "crying"], image_url: "baby.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q035", sentence: "She ___ playing the piano.", blank_index: 1, correct_answer: "is", distractors: ["are", "am"], image_url: "piano.png", grammar_tag: "present_continuous", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q036", sentence: "I am ___ TV series.", blank_index: 2, correct_answer: "watching", distractors: ["watch", "watches"], image_url: "tv.png", grammar_tag: "present_continuous", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q037", sentence: "He __ walk to school.", blank_index: 1, correct_answer: "doesn't", distractors: ["don't", "isn't"], image_url: "walk.png", grammar_tag: "present_simple_negative", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q038", sentence: "They don't ___ meat.", blank_index: 2, correct_answer: "eat", distractors: ["eats", "eating"], image_url: "meat.png", grammar_tag: "present_simple_negative", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q039", sentence: "My favorite color is blue.", words_shuffled: ["color", "My favorite", "is", "blue"], correct_order: ["My favorite", "color", "is", "blue"], image_url: "blue.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q040", sentence: "His name ___ John.", blank_index: 2, correct_answer: "is", distractors: ["are", "am"], image_url: "name.png", grammar_tag: "verb_to_be", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q041", sentence: "She ___ a blue dress.", blank_index: 1, correct_answer: "wears", distractors: ["wear", "wearing"], image_url: "dress.png", grammar_tag: "present_simple_3rd", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q042", sentence: "He drives a fast car.", words_shuffled: ["drives", "a fast", "car", "He"], correct_order: ["He", "drives", "a fast", "car"], image_url: "fast_car.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q043", sentence: "It ___ raining outside.", blank_index: 1, correct_answer: "is", distractors: ["are", "am"], image_url: "rain.png", grammar_tag: "present_continuous", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q044", sentence: "I want ___ ice cream.", blank_index: 2, correct_answer: "an", distractors: ["a", "the"], image_url: "ice_cream.png", grammar_tag: "article", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q045", sentence: "We saw a big elephant.", words_shuffled: ["a big", "elephant", "saw", "We"], correct_order: ["We", "saw", "a big", "elephant"], image_url: "elephant.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q046", sentence: "This is ___ book.", blank_index: 2, correct_answer: "my", distractors: ["mine", "me"], image_url: "my_book.png", grammar_tag: "possessive", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q047", sentence: "The shoes are ___.", blank_index: 3, correct_answer: "yours", distractors: ["your", "you"], image_url: "shoes.png", grammar_tag: "possessive", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q048", sentence: "A week has seven days.", words_shuffled: ["has", "seven", "days", "A week"], correct_order: ["A week", "has", "seven", "days"], image_url: "week.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q049", sentence: "There are four ___.", blank_index: 3, correct_answer: "seasons", distractors: ["season", "seasonal"], image_url: "seasons.png", grammar_tag: "plural_noun", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q050", sentence: "She is a beautiful girl.", words_shuffled: ["a beautiful", "girl", "is", "She"], correct_order: ["She", "is", "a beautiful", "girl"], image_url: "girl.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" }
];
