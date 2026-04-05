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
    { id: "q050", sentence: "She is a beautiful girl.", words_shuffled: ["a beautiful", "girl", "is", "She"], correct_order: ["She", "is", "a beautiful", "girl"], image_url: "girl.png", grammar_tag: "word_order", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Future Tense (will / be going to) ===
    { id: "q051", sentence: "I ___ help you tomorrow.", blank_index: 1, correct_answer: "will", distractors: ["am", "do", "was"], image_url: "help.png", grammar_tag: "future_will", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q052", sentence: "She ___ visit her grandma next week.", blank_index: 1, correct_answer: "will", distractors: ["is", "does", "has"], image_url: "grandma.png", grammar_tag: "future_will", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q053", sentence: "It ___ rain later today.", blank_index: 1, correct_answer: "will", distractors: ["is", "does", "has"], image_url: "rain.png", grammar_tag: "future_will", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q054", sentence: "We are ___ to have a party.", blank_index: 2, correct_answer: "going", distractors: ["go", "gone", "went"], image_url: "party.png", grammar_tag: "future_going_to", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q055", sentence: "He is going ___ study abroad.", blank_index: 3, correct_answer: "to", distractors: ["for", "at", "in"], image_url: "study.png", grammar_tag: "future_going_to", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q056", sentence: "They ___ not come to the meeting.", blank_index: 1, correct_answer: "will", distractors: ["are", "do", "have"], image_url: "meeting.png", grammar_tag: "future_will", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q057", sentence: "I am ___ to learn Japanese.", blank_index: 2, correct_answer: "going", distractors: ["go", "gone", "went"], image_url: "japanese.png", grammar_tag: "future_going_to", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q058", sentence: "___ you be at home tonight?", blank_index: 0, correct_answer: "Will", distractors: ["Do", "Are", "Have"], image_url: "home.png", grammar_tag: "future_will", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q059", sentence: "She is going to ___ a cake.", blank_index: 4, correct_answer: "bake", distractors: ["bakes", "baking", "baked"], image_url: "cake.png", grammar_tag: "future_going_to", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q060", sentence: "We will ___ the game.", blank_index: 2, correct_answer: "win", distractors: ["wins", "winning", "won"], image_url: "game.png", grammar_tag: "future_will", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Conditionals (if clauses) ===
    { id: "q061", sentence: "If it rains, I ___ stay home.", blank_index: 4, correct_answer: "will", distractors: ["am", "do", "was"], image_url: "rain.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q062", sentence: "If you ___ hard, you will pass.", blank_index: 2, correct_answer: "study", distractors: ["studies", "studying", "studied"], image_url: "study.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q063", sentence: "If she ___ early, she won't be late.", blank_index: 2, correct_answer: "leaves", distractors: ["leave", "leaving", "left"], image_url: "clock.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q064", sentence: "I will call you ___ I arrive.", blank_index: 4, correct_answer: "when", distractors: ["but", "or", "so"], image_url: "phone.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q065", sentence: "If we ___ now, we can catch the bus.", blank_index: 2, correct_answer: "leave", distractors: ["leaves", "leaving", "left"], image_url: "bus.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q066", sentence: "If he ___ sick, he will see a doctor.", blank_index: 2, correct_answer: "is", distractors: ["are", "am", "be"], image_url: "doctor.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q067", sentence: "If I ___ rich, I would travel.", blank_index: 2, correct_answer: "were", distractors: ["am", "is", "be"], image_url: "travel.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q068", sentence: "If you mix red and blue, you ___ purple.", blank_index: 7, correct_answer: "get", distractors: ["gets", "getting", "got"], image_url: "colors.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q069", sentence: "If they ___ us, we will go.", blank_index: 2, correct_answer: "invite", distractors: ["invites", "inviting", "invited"], image_url: "invite.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q070", sentence: "If the weather ___ nice, let's go out.", blank_index: 3, correct_answer: "is", distractors: ["are", "were", "be"], image_url: "weather.png", grammar_tag: "conditional", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Passive Voice ===
    { id: "q071", sentence: "The cake was ___ by my mom.", blank_index: 3, correct_answer: "made", distractors: ["make", "making", "makes"], image_url: "cake.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q072", sentence: "English is ___ all over the world.", blank_index: 2, correct_answer: "spoken", distractors: ["speak", "speaking", "speaks"], image_url: "english.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q073", sentence: "The window was ___ by the ball.", blank_index: 3, correct_answer: "broken", distractors: ["break", "breaking", "broke"], image_url: "window.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q074", sentence: "The letter ___ written yesterday.", blank_index: 2, correct_answer: "was", distractors: ["is", "are", "were"], image_url: "letter.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q075", sentence: "These books are ___ by many students.", blank_index: 3, correct_answer: "read", distractors: ["reading", "reads", "reader"], image_url: "books.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q076", sentence: "The song was ___ by a famous singer.", blank_index: 3, correct_answer: "sung", distractors: ["sing", "singing", "sings"], image_url: "music.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q077", sentence: "The homework ___ done every day.", blank_index: 2, correct_answer: "is", distractors: ["are", "were", "am"], image_url: "homework.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q078", sentence: "Rice is ___ in many countries.", blank_index: 2, correct_answer: "grown", distractors: ["grow", "growing", "grows"], image_url: "rice.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q079", sentence: "The movie was ___ in 2020.", blank_index: 3, correct_answer: "released", distractors: ["release", "releasing", "releases"], image_url: "movie.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q080", sentence: "The car was ___ by a mechanic.", blank_index: 3, correct_answer: "repaired", distractors: ["repair", "repairing", "repairs"], image_url: "car.png", grammar_tag: "passive_voice", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Relative Clauses ===
    { id: "q081", sentence: "The boy ___ lives next door is kind.", blank_index: 2, correct_answer: "who", distractors: ["which", "where", "what"], image_url: "boy.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q082", sentence: "This is the book ___ I bought.", blank_index: 4, correct_answer: "that", distractors: ["who", "where", "when"], image_url: "book.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q083", sentence: "The school ___ I study is big.", blank_index: 2, correct_answer: "where", distractors: ["who", "which", "when"], image_url: "school.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q084", sentence: "The girl ___ is singing is my sister.", blank_index: 2, correct_answer: "who", distractors: ["which", "where", "what"], image_url: "girl.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q085", sentence: "The pen ___ you gave me is nice.", blank_index: 2, correct_answer: "that", distractors: ["who", "where", "when"], image_url: "pen.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q086", sentence: "I know the man ___ works here.", blank_index: 4, correct_answer: "who", distractors: ["which", "where", "what"], image_url: "man.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q087", sentence: "The house ___ is painted blue is ours.", blank_index: 2, correct_answer: "which", distractors: ["who", "where", "when"], image_url: "house.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q088", sentence: "The day ___ we met was special.", blank_index: 2, correct_answer: "when", distractors: ["who", "which", "where"], image_url: "calendar.png", grammar_tag: "relative_clause", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Present Perfect ===
    { id: "q089", sentence: "I ___ finished my homework.", blank_index: 1, correct_answer: "have", distractors: ["has", "had", "am"], image_url: "homework.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q090", sentence: "She ___ been to Paris.", blank_index: 1, correct_answer: "has", distractors: ["have", "had", "is"], image_url: "paris.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q091", sentence: "We have ___ that movie twice.", blank_index: 2, correct_answer: "seen", distractors: ["see", "saw", "seeing"], image_url: "movie.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q092", sentence: "He has ___ three books this month.", blank_index: 2, correct_answer: "read", distractors: ["reads", "reading", "reader"], image_url: "books.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q093", sentence: "They have ___ here since 2020.", blank_index: 2, correct_answer: "lived", distractors: ["live", "living", "lives"], image_url: "house.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q094", sentence: "I have never ___ sushi.", blank_index: 3, correct_answer: "eaten", distractors: ["eat", "ate", "eating"], image_url: "sushi.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q095", sentence: "She has ___ her keys.", blank_index: 2, correct_answer: "lost", distractors: ["lose", "losing", "loses"], image_url: "keys.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q096", sentence: "Have you ever ___ to London?", blank_index: 3, correct_answer: "been", distractors: ["be", "was", "being"], image_url: "london.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q097", sentence: "We have ___ known each other.", blank_index: 2, correct_answer: "always", distractors: ["never", "yet", "still"], image_url: "friends.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q098", sentence: "He has ___ arrived at school.", blank_index: 2, correct_answer: "just", distractors: ["yet", "ever", "never"], image_url: "school.png", grammar_tag: "present_perfect", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Phrasal Verbs ===
    { id: "q099", sentence: "Please turn ___ the light.", blank_index: 2, correct_answer: "on", distractors: ["in", "at", "to"], image_url: "light.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q100", sentence: "I need to look ___ this word.", blank_index: 4, correct_answer: "up", distractors: ["in", "at", "on"], image_url: "dictionary.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q101", sentence: "She gave ___ smoking last year.", blank_index: 2, correct_answer: "up", distractors: ["in", "on", "out"], image_url: "healthy.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q102", sentence: "Can you pick ___ the kids?", blank_index: 3, correct_answer: "up", distractors: ["in", "on", "at"], image_url: "kids.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q103", sentence: "He ran ___ of milk.", blank_index: 2, correct_answer: "out", distractors: ["in", "up", "on"], image_url: "milk.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q104", sentence: "Please put ___ your shoes.", blank_index: 2, correct_answer: "on", distractors: ["up", "in", "at"], image_url: "shoes.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q105", sentence: "I get ___ at 7 every morning.", blank_index: 2, correct_answer: "up", distractors: ["in", "on", "out"], image_url: "morning.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q106", sentence: "Turn ___ the TV, please.", blank_index: 1, correct_answer: "off", distractors: ["on", "in", "up"], image_url: "tv.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q107", sentence: "She looks ___ her younger brother.", blank_index: 2, correct_answer: "after", distractors: ["up", "in", "at"], image_url: "brother.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q108", sentence: "We should find ___ the answer.", blank_index: 3, correct_answer: "out", distractors: ["up", "in", "on"], image_url: "answer.png", grammar_tag: "phrasal_verb", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },

    // === Conjunctions (because, although, when) ===
    { id: "q109", sentence: "I stayed home ___ I was sick.", blank_index: 3, correct_answer: "because", distractors: ["although", "but", "so"], image_url: "sick.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q110", sentence: "___ it was cold, she went out.", blank_index: 0, correct_answer: "Although", distractors: ["Because", "When", "So"], image_url: "cold.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q111", sentence: "___ I got home, I ate dinner.", blank_index: 0, correct_answer: "When", distractors: ["Although", "Because", "But"], image_url: "dinner.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q112", sentence: "I like tea ___ my sister likes coffee.", blank_index: 3, correct_answer: "but", distractors: ["because", "so", "when"], image_url: "tea.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q113", sentence: "He was tired ___ he went to bed.", blank_index: 3, correct_answer: "so", distractors: ["but", "although", "when"], image_url: "bed.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q114", sentence: "She sings ___ she is happy.", blank_index: 2, correct_answer: "when", distractors: ["but", "so", "although"], image_url: "sing.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q115", sentence: "I can't go ___ I have homework.", blank_index: 3, correct_answer: "because", distractors: ["but", "although", "when"], image_url: "homework.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q116", sentence: "___ he is young, he is very smart.", blank_index: 0, correct_answer: "Although", distractors: ["Because", "When", "So"], image_url: "smart.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q117", sentence: "I read books ___ I want to learn.", blank_index: 3, correct_answer: "because", distractors: ["but", "so", "although"], image_url: "books.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q118", sentence: "You can play ___ you finish eating.", blank_index: 3, correct_answer: "after", distractors: ["because", "but", "so"], image_url: "play.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q119", sentence: "Both my mom ___ dad cook well.", blank_index: 3, correct_answer: "and", distractors: ["or", "but", "so"], image_url: "cooking.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" },
    { id: "q120", sentence: "I will wait ___ you come back.", blank_index: 3, correct_answer: "until", distractors: ["because", "although", "but"], image_url: "wait.png", grammar_tag: "conjunction", ease_factor: 2.5, interval_days: 1, next_review_date: "2025-03-10", times_seen: 0, times_correct: 0, is_mistake_card: false, last_played_session: "" }
];
