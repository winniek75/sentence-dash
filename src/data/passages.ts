import type { Level } from '../systems/Launch';

export interface Passage {
  id: string;
  title: string;
  level: Level;
  text: string;
  textJa?: string;
  trueFalse: TrueFalseItem[];
  questions: ReadingQuestion[];
}

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
  evidence: number[];
}

export interface ReadingQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
  type: 'who' | 'what' | 'where' | 'when' | 'why' | 'how';
  evidence: number[];
}

export interface SentenceSpan {
  start: number;
  end: number;
  text: string;
}

export function splitSentences(text: string): SentenceSpan[] {
  const spans: SentenceSpan[] = [];
  const re = /[.!?]['"]?(?=\s+[A-Z]|\s*$)/g;
  let start = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const end = m.index + m[0].length;
    if (/\b(Mr|Mrs|Ms|Dr)\.$/.test(text.slice(start, end))) continue;
    spans.push({ start, end, text: text.slice(start, end) });
    start = end;
    while (start < text.length && /\s/.test(text[start])) start++;
  }
  if (start < text.length) spans.push({ start, end: text.length, text: text.slice(start) });
  return spans;
}

export const passages: Passage[] = [
  // ===== EASY (8 passages) =====
  {
    id: 'e1',
    title: "Tom's Morning",
    level: 'easy',
    text: "Tom wakes up at 7:00 every morning. He eats toast and drinks orange juice for breakfast. Then he walks to school with his friend Lucy. It takes about 15 minutes to walk there.",
    trueFalse: [
      { statement: "Tom wakes up at 7:00.", isTrue: true, explanation: "The passage says he wakes up at 7:00.", evidence: [0] },
      { statement: "Tom drinks milk for breakfast.", isTrue: false, explanation: "He drinks orange juice, not milk.", evidence: [0] },
      { statement: "Tom goes to school by bus.", isTrue: false, explanation: "He walks to school.", evidence: [0] }
    ],
    questions: [
      { question: "Who does Tom walk to school with?", choices: ["Lucy", "His mother", "His brother"], correctIndex: 0, type: 'who', evidence: [0] },
      { question: "How long does it take to walk to school?", choices: ["10 minutes", "15 minutes", "30 minutes"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'e2',
    title: "My Pet Dog",
    level: 'easy',
    text: "I have a dog named Max. He is brown and white. Max likes to play in the park every afternoon. He can catch a ball very well. Max is three years old.",
    trueFalse: [
      { statement: "The dog's name is Max.", isTrue: true, explanation: "The passage says the dog is named Max.", evidence: [0] },
      { statement: "Max is all black.", isTrue: false, explanation: "Max is brown and white.", evidence: [0] },
      { statement: "Max likes to play in the park.", isTrue: true, explanation: "The passage says he plays in the park every afternoon.", evidence: [0] }
    ],
    questions: [
      { question: "Where does Max like to play?", choices: ["At home", "In the park", "At school"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "How old is Max?", choices: ["Two years old", "Three years old", "Five years old"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'e3',
    title: "Lunch Time",
    level: 'easy',
    text: "Emma eats lunch at 12:30. She has a sandwich and an apple. She also drinks water. Emma eats lunch with her classmate Yuki in the school cafeteria.",
    trueFalse: [
      { statement: "Emma eats lunch at 12:30.", isTrue: true, explanation: "The passage says she eats at 12:30.", evidence: [0] },
      { statement: "Emma has pizza for lunch.", isTrue: false, explanation: "She has a sandwich and an apple.", evidence: [0] },
      { statement: "Emma eats alone.", isTrue: false, explanation: "She eats with her classmate Yuki.", evidence: [0] }
    ],
    questions: [
      { question: "What does Emma drink?", choices: ["Juice", "Milk", "Water"], correctIndex: 2, type: 'what', evidence: [0] },
      { question: "Where does Emma eat lunch?", choices: ["In her classroom", "In the school cafeteria", "At home"], correctIndex: 1, type: 'where', evidence: [0] }
    ]
  },
  {
    id: 'e4',
    title: "The Weather Today",
    level: 'easy',
    text: "Today is sunny and warm. The temperature is 25 degrees. Many children are playing outside. Some are riding bikes and some are playing soccer. It is a beautiful spring day.",
    trueFalse: [
      { statement: "Today is rainy.", isTrue: false, explanation: "Today is sunny and warm.", evidence: [0] },
      { statement: "The temperature is 25 degrees.", isTrue: true, explanation: "The passage says it is 25 degrees.", evidence: [0] },
      { statement: "Children are playing outside.", isTrue: true, explanation: "Many children are playing outside.", evidence: [0] }
    ],
    questions: [
      { question: "What season is it?", choices: ["Summer", "Spring", "Winter"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "What are some children doing?", choices: ["Swimming", "Riding bikes", "Reading books"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'e5',
    title: "My Classroom",
    level: 'easy',
    text: "My classroom has 30 desks. There is a big whiteboard at the front. Our teacher, Mr. Tanaka, teaches us math and science. There are many colorful posters on the walls.",
    trueFalse: [
      { statement: "The classroom has 30 desks.", isTrue: true, explanation: "The passage says there are 30 desks.", evidence: [0] },
      { statement: "The teacher's name is Mr. Suzuki.", isTrue: false, explanation: "The teacher's name is Mr. Tanaka.", evidence: [0] },
      { statement: "There is a blackboard at the front.", isTrue: false, explanation: "There is a whiteboard, not a blackboard.", evidence: [0] }
    ],
    questions: [
      { question: "Who is the teacher?", choices: ["Mr. Suzuki", "Mr. Tanaka", "Ms. Sato"], correctIndex: 1, type: 'who', evidence: [0] },
      { question: "What subjects does the teacher teach?", choices: ["English and art", "Math and science", "Music and PE"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'e6',
    title: "Shopping with Mom",
    level: 'easy',
    text: "Kenji goes shopping with his mom every Saturday. They go to the supermarket near their house. They buy vegetables, fruit, and bread. Kenji always chooses his favorite snack, chocolate cookies.",
    trueFalse: [
      { statement: "Kenji goes shopping on Sundays.", isTrue: false, explanation: "He goes shopping on Saturdays.", evidence: [0] },
      { statement: "They go to the supermarket.", isTrue: true, explanation: "The passage says they go to the supermarket.", evidence: [0] },
      { statement: "Kenji's favorite snack is chocolate cookies.", isTrue: true, explanation: "The passage says he always chooses chocolate cookies.", evidence: [0] }
    ],
    questions: [
      { question: "When does Kenji go shopping?", choices: ["Every Sunday", "Every Saturday", "Every Friday"], correctIndex: 1, type: 'when', evidence: [0] },
      { question: "Who does Kenji go shopping with?", choices: ["His dad", "His friend", "His mom"], correctIndex: 2, type: 'who', evidence: [0] }
    ]
  },
  {
    id: 'e7',
    title: "Bedtime",
    level: 'easy',
    text: "Mika goes to bed at 9:00 every night. Before sleeping, she reads a book for 20 minutes. She likes fairy tales the most. Her favorite book is about a princess who lives in a forest.",
    trueFalse: [
      { statement: "Mika goes to bed at 9:00.", isTrue: true, explanation: "The passage says she goes to bed at 9:00.", evidence: [0] },
      { statement: "Mika watches TV before sleeping.", isTrue: false, explanation: "She reads a book before sleeping.", evidence: [0] },
      { statement: "Mika reads for 20 minutes.", isTrue: true, explanation: "The passage says she reads for 20 minutes.", evidence: [0] }
    ],
    questions: [
      { question: "What kind of books does Mika like?", choices: ["Science books", "Fairy tales", "Comic books"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Where does the princess live in her favorite book?", choices: ["In a castle", "In a forest", "By the sea"], correctIndex: 1, type: 'where', evidence: [0] }
    ]
  },
  {
    id: 'e8',
    title: "The School Library",
    level: 'easy',
    text: "Our school library is on the second floor. It has over 5,000 books. The library is open from 8:00 to 4:00. Students can borrow three books at a time. The librarian, Ms. Ito, is very kind.",
    trueFalse: [
      { statement: "The library is on the first floor.", isTrue: false, explanation: "It is on the second floor.", evidence: [0] },
      { statement: "Students can borrow three books.", isTrue: true, explanation: "Students can borrow three books at a time.", evidence: [0] },
      { statement: "The library closes at 4:00.", isTrue: true, explanation: "The library is open from 8:00 to 4:00.", evidence: [0] }
    ],
    questions: [
      { question: "How many books does the library have?", choices: ["Over 3,000", "Over 5,000", "Over 10,000"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "Who is the librarian?", choices: ["Ms. Yamada", "Ms. Ito", "Mr. Tanaka"], correctIndex: 1, type: 'who', evidence: [0] }
    ]
  },

  // ===== MEDIUM (20 passages) =====
  {
    id: 'm1',
    title: "A Letter from Australia",
    level: 'medium',
    text: "Dear Saki, I am having a great time in Sydney, Australia. Yesterday, I visited the famous Opera House. The weather here is very hot because it is summer in Australia now. I also saw kangaroos at a wildlife park! I will come back to Japan next Monday.",
    trueFalse: [
      { statement: "The writer is in Melbourne.", isTrue: false, explanation: "The writer is in Sydney.", evidence: [0] },
      { statement: "It is summer in Australia right now.", isTrue: true, explanation: "The passage says it is summer in Australia.", evidence: [0] },
      { statement: "The writer saw kangaroos.", isTrue: true, explanation: "The writer saw kangaroos at a wildlife park.", evidence: [0] }
    ],
    questions: [
      { question: "What famous place did the writer visit?", choices: ["The Great Wall", "The Opera House", "The Eiffel Tower"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "When will the writer return to Japan?", choices: ["Next Friday", "Next Monday", "Next Wednesday"], correctIndex: 1, type: 'when', evidence: [0] }
    ]
  },
  {
    id: 'm2',
    title: "The Science Fair",
    level: 'medium',
    text: "Last week, our school had a science fair. Takeshi and his partner Hana made a volcano model. They used baking soda and vinegar to make it erupt. Their project won second place. The first-place winner made a solar-powered car.",
    trueFalse: [
      { statement: "Takeshi worked alone on his project.", isTrue: false, explanation: "He worked with his partner Hana.", evidence: [0] },
      { statement: "They made a volcano model.", isTrue: true, explanation: "Takeshi and Hana made a volcano model.", evidence: [0] },
      { statement: "Their project won first place.", isTrue: false, explanation: "Their project won second place.", evidence: [0] }
    ],
    questions: [
      { question: "What did Takeshi and Hana use to make the volcano erupt?", choices: ["Water and soap", "Baking soda and vinegar", "Paint and glue"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "What was the first-place project?", choices: ["A robot", "A solar-powered car", "A weather station"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm3',
    title: "Cooking with Grandma",
    level: 'medium',
    text: "Every Sunday, Yui visits her grandmother and they cook together. Last Sunday, they made curry rice. First, they cut the vegetables: potatoes, carrots, and onions. Then they cooked everything in a big pot for 30 minutes. The curry was delicious!",
    trueFalse: [
      { statement: "Yui cooks with her grandmother on Saturdays.", isTrue: false, explanation: "She visits every Sunday.", evidence: [0] },
      { statement: "They made curry rice last Sunday.", isTrue: true, explanation: "The passage says they made curry rice.", evidence: [0] },
      { statement: "They cooked for 30 minutes.", isTrue: true, explanation: "They cooked everything for 30 minutes.", evidence: [0] }
    ],
    questions: [
      { question: "Who does Yui cook with?", choices: ["Her mother", "Her grandmother", "Her sister"], correctIndex: 1, type: 'who', evidence: [0] },
      { question: "How long did they cook the curry?", choices: ["20 minutes", "30 minutes", "45 minutes"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'm4',
    title: "Soccer Practice",
    level: 'medium',
    text: "Riku has soccer practice every Tuesday and Thursday after school. His team has 15 players. Their coach, Mr. Honda, was a professional soccer player before. They are preparing for a big tournament next month. Riku plays as a goalkeeper.",
    trueFalse: [
      { statement: "Riku practices soccer on Monday and Wednesday.", isTrue: false, explanation: "He practices on Tuesday and Thursday.", evidence: [0] },
      { statement: "The team has 15 players.", isTrue: true, explanation: "The passage says the team has 15 players.", evidence: [0] },
      { statement: "Mr. Honda was a professional player.", isTrue: true, explanation: "The coach was a professional soccer player before.", evidence: [0] }
    ],
    questions: [
      { question: "What position does Riku play?", choices: ["Forward", "Midfielder", "Goalkeeper"], correctIndex: 2, type: 'what', evidence: [0] },
      { question: "When is the tournament?", choices: ["This week", "Next month", "Next year"], correctIndex: 1, type: 'when', evidence: [0] }
    ]
  },
  {
    id: 'm5',
    title: "The School Trip",
    level: 'medium',
    text: "Next Friday, Class 3-B will go on a school trip to Kyoto. They will visit two temples and a castle. The bus leaves at 8:00 in the morning and they will return by 5:00 in the evening. Students need to bring their own lunch and a water bottle.",
    trueFalse: [
      { statement: "The trip is on Thursday.", isTrue: false, explanation: "The trip is on Friday.", evidence: [0] },
      { statement: "They will visit a castle.", isTrue: true, explanation: "They will visit two temples and a castle.", evidence: [0] },
      { statement: "The school will provide lunch.", isTrue: false, explanation: "Students need to bring their own lunch.", evidence: [0] }
    ],
    questions: [
      { question: "Where is the school trip going?", choices: ["Tokyo", "Osaka", "Kyoto"], correctIndex: 2, type: 'where', evidence: [0] },
      { question: "What time does the bus leave?", choices: ["7:00", "8:00", "9:00"], correctIndex: 1, type: 'when', evidence: [0] }
    ]
  },
  {
    id: 'm6',
    title: "A Rainy Day Adventure",
    level: 'medium',
    text: "It rained all day yesterday, so Aoi and her brother stayed home. They decided to build a blanket fort in the living room. They used chairs, blankets, and pillows. Inside the fort, they read comic books and ate popcorn. It was one of the best rainy days ever!",
    trueFalse: [
      { statement: "It was sunny yesterday.", isTrue: false, explanation: "It rained all day yesterday.", evidence: [0] },
      { statement: "They built a fort in the living room.", isTrue: true, explanation: "They built a blanket fort in the living room.", evidence: [0] },
      { statement: "They ate chocolate inside the fort.", isTrue: false, explanation: "They ate popcorn, not chocolate.", evidence: [0] }
    ],
    questions: [
      { question: "Why did Aoi stay home?", choices: ["She was sick", "It rained all day", "She had no school"], correctIndex: 1, type: 'why', evidence: [0] },
      { question: "What did they do inside the fort?", choices: ["Watched TV", "Read comic books", "Played video games"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm7',
    title: "The New Student",
    level: 'medium',
    text: "A new student named Leo joined our class today. He is from Brazil and he speaks Portuguese and English. Leo likes basketball and drawing. During lunch, he showed us pictures of his hometown, Rio de Janeiro. Everyone wants to be his friend.",
    trueFalse: [
      { statement: "Leo is from Argentina.", isTrue: false, explanation: "Leo is from Brazil.", evidence: [0] },
      { statement: "Leo speaks two languages.", isTrue: true, explanation: "He speaks Portuguese and English.", evidence: [0] },
      { statement: "Leo likes basketball.", isTrue: true, explanation: "The passage says Leo likes basketball and drawing.", evidence: [0] }
    ],
    questions: [
      { question: "Where is Leo from?", choices: ["Mexico", "Brazil", "Spain"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "What did Leo show during lunch?", choices: ["His toys", "Pictures of his hometown", "A magic trick"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm8',
    title: "Summer Festival",
    level: 'medium',
    text: "The summer festival in our town is on August 15th every year. There are many food stalls selling yakisoba, takoyaki, and shaved ice. People wear yukata and watch fireworks at night. The fireworks show starts at 8:00 and lasts for one hour. It is the biggest event of the summer.",
    trueFalse: [
      { statement: "The festival is in July.", isTrue: false, explanation: "The festival is on August 15th.", evidence: [0] },
      { statement: "People wear yukata at the festival.", isTrue: true, explanation: "The passage says people wear yukata.", evidence: [0] },
      { statement: "The fireworks last for one hour.", isTrue: true, explanation: "The fireworks show lasts for one hour.", evidence: [0] }
    ],
    questions: [
      { question: "When do the fireworks start?", choices: ["7:00", "8:00", "9:00"], correctIndex: 1, type: 'when', evidence: [0] },
      { question: "What food is NOT mentioned?", choices: ["Yakisoba", "Takoyaki", "Cotton candy"], correctIndex: 2, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm9',
    title: "The Birthday Surprise",
    level: 'medium',
    text: "Last Saturday was Miki's 14th birthday. Her friends planned a surprise party at Yuka's house. When Miki arrived, everyone shouted 'Happy Birthday!' She was so surprised that she almost cried. They ate cake, played games, and danced together. Miki said it was the best birthday she ever had.",
    trueFalse: [
      { statement: "Miki turned 15 years old.", isTrue: false, explanation: "It was her 14th birthday.", evidence: [0] },
      { statement: "The party was at Yuka's house.", isTrue: true, explanation: "The passage says the party was at Yuka's house.", evidence: [0] },
      { statement: "Miki knew about the surprise party.", isTrue: false, explanation: "She was so surprised that she almost cried.", evidence: [0] }
    ],
    questions: [
      { question: "When was Miki's birthday?", choices: ["Last Friday", "Last Saturday", "Last Sunday"], correctIndex: 1, type: 'when', evidence: [0] },
      { question: "Why did Miki almost cry?", choices: ["She was sad", "She was surprised", "She was scared"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'm10',
    title: "The Pen Pal",
    level: 'medium',
    text: "Kaito has a pen pal named Emma from London. They started writing to each other two years ago. Emma writes about her school life and British food. Kaito tells her about Japanese culture and anime. They send letters once a month. Kaito hopes to visit Emma someday.",
    trueFalse: [
      { statement: "Emma is from Paris.", isTrue: false, explanation: "Emma is from London.", evidence: [0] },
      { statement: "They have been pen pals for two years.", isTrue: true, explanation: "They started writing two years ago.", evidence: [0] },
      { statement: "They send letters every week.", isTrue: false, explanation: "They send letters once a month.", evidence: [0] }
    ],
    questions: [
      { question: "What does Kaito tell Emma about?", choices: ["Sports and music", "Japanese culture and anime", "Science and math"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Where is Emma from?", choices: ["New York", "London", "Sydney"], correctIndex: 1, type: 'where', evidence: [0] }
    ]
  },
  {
    id: 'm11',
    title: "The Piano Recital",
    level: 'medium',
    text: "Nana practiced the piano every day for three months. Yesterday, she performed at a recital in the city hall. She played two songs in front of 200 people. Her hands were shaking at first, but she played well. After the recital, her parents took her out for sushi to celebrate.",
    trueFalse: [
      { statement: "Nana practiced for six months.", isTrue: false, explanation: "She practiced for three months.", evidence: [0] },
      { statement: "The recital was at the city hall.", isTrue: true, explanation: "She performed at a recital in the city hall.", evidence: [0] },
      { statement: "Nana played three songs.", isTrue: false, explanation: "She played two songs.", evidence: [0] }
    ],
    questions: [
      { question: "How many people watched the recital?", choices: ["100 people", "200 people", "300 people"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "What did Nana's family do after the recital?", choices: ["Went home", "Went out for sushi", "Went shopping"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm12',
    title: "The Lost Umbrella",
    level: 'medium',
    text: "Sota left his umbrella on the train last Wednesday. It was a blue umbrella with stars on it. He went to the lost and found office at the station the next day. The staff member checked and found his umbrella. Sota was very happy and thanked the staff many times.",
    trueFalse: [
      { statement: "Sota lost his umbrella at school.", isTrue: false, explanation: "He left it on the train.", evidence: [0] },
      { statement: "The umbrella was blue with stars.", isTrue: true, explanation: "The passage says it was a blue umbrella with stars.", evidence: [0] },
      { statement: "Sota went to the lost and found the same day.", isTrue: false, explanation: "He went the next day.", evidence: [0] }
    ],
    questions: [
      { question: "Where did Sota leave his umbrella?", choices: ["At school", "On the train", "At a restaurant"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "When did Sota lose his umbrella?", choices: ["Last Monday", "Last Wednesday", "Last Friday"], correctIndex: 1, type: 'when', evidence: [0] }
    ]
  },
  {
    id: 'm13',
    title: "The Art Class",
    level: 'medium',
    text: "In art class last Tuesday, the students painted pictures of autumn leaves. They used red, orange, yellow, and brown colors. Hina painted a picture of a maple tree. The teacher, Ms. Watanabe, said Hina's painting was excellent. The best paintings will be displayed in the school hallway.",
    trueFalse: [
      { statement: "The students painted pictures of flowers.", isTrue: false, explanation: "They painted pictures of autumn leaves.", evidence: [0] },
      { statement: "Hina painted a maple tree.", isTrue: true, explanation: "The passage says Hina painted a maple tree.", evidence: [0] },
      { statement: "The teacher's name is Ms. Yamada.", isTrue: false, explanation: "The teacher's name is Ms. Watanabe.", evidence: [0] }
    ],
    questions: [
      { question: "Where will the best paintings be displayed?", choices: ["In the classroom", "In the school hallway", "In the art room"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "What did the teacher say about Hina's painting?", choices: ["It was good enough", "It was excellent", "It needed more color"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm14',
    title: "A Visit to the Zoo",
    level: 'medium',
    text: "Last Sunday, Yuto and his family visited the Ueno Zoo in Tokyo. They saw elephants, giraffes, and pandas. The baby panda was the most popular animal. They waited in line for 40 minutes to see it. Yuto's little sister liked the penguins the best because they looked funny when they walked.",
    trueFalse: [
      { statement: "They visited the zoo on Saturday.", isTrue: false, explanation: "They visited last Sunday.", evidence: [0] },
      { statement: "The baby panda was the most popular animal.", isTrue: true, explanation: "The passage says the baby panda was the most popular.", evidence: [0] },
      { statement: "Yuto's sister liked the elephants the best.", isTrue: false, explanation: "She liked the penguins the best.", evidence: [0] }
    ],
    questions: [
      { question: "How long did they wait to see the panda?", choices: ["20 minutes", "30 minutes", "40 minutes"], correctIndex: 2, type: 'how', evidence: [0] },
      { question: "Why did Yuto's sister like the penguins?", choices: ["They were cute", "They looked funny when walking", "They could swim fast"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'm15',
    title: "The Swimming Lesson",
    level: 'medium',
    text: "Haruto started swimming lessons last April. He goes to the pool every Wednesday after school. At first, he could not swim at all. Now, after six months of practice, he can swim 50 meters without stopping. His swimming teacher said he improved very quickly. Next month, he will try to swim 100 meters.",
    trueFalse: [
      { statement: "Haruto started swimming lessons in May.", isTrue: false, explanation: "He started last April.", evidence: [0] },
      { statement: "Haruto can now swim 50 meters.", isTrue: true, explanation: "He can swim 50 meters without stopping.", evidence: [0] },
      { statement: "Haruto goes to the pool on Fridays.", isTrue: false, explanation: "He goes every Wednesday.", evidence: [0] }
    ],
    questions: [
      { question: "How long has Haruto been taking swimming lessons?", choices: ["Three months", "Six months", "One year"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "What is Haruto's next goal?", choices: ["Swim 75 meters", "Swim 100 meters", "Swim 200 meters"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm16',
    title: "The Homework Problem",
    level: 'medium',
    text: "Saki had a lot of math homework last night. There were 30 problems and she could not solve the last five. She asked her older brother for help. He explained the problems step by step and she finally understood. Saki finished all her homework by 9:00 and felt very relieved.",
    trueFalse: [
      { statement: "Saki had English homework.", isTrue: false, explanation: "She had math homework.", evidence: [0] },
      { statement: "She could not solve the last five problems.", isTrue: true, explanation: "The passage says she could not solve the last five.", evidence: [0] },
      { statement: "Saki asked her teacher for help.", isTrue: false, explanation: "She asked her older brother for help.", evidence: [0] }
    ],
    questions: [
      { question: "How many problems were there in total?", choices: ["20", "25", "30"], correctIndex: 2, type: 'how', evidence: [0] },
      { question: "Who helped Saki with her homework?", choices: ["Her father", "Her older brother", "Her friend"], correctIndex: 1, type: 'who', evidence: [0] }
    ]
  },
  {
    id: 'm17',
    title: "The School Garden",
    level: 'medium',
    text: "Class 2-A planted tomatoes and sunflowers in the school garden last spring. The students watered the plants every morning before class. By summer, the tomatoes turned red and the sunflowers grew taller than the students. They picked the tomatoes and made salad for everyone. The sunflowers were beautiful.",
    trueFalse: [
      { statement: "They planted roses and tulips.", isTrue: false, explanation: "They planted tomatoes and sunflowers.", evidence: [0] },
      { statement: "Students watered the plants every morning.", isTrue: true, explanation: "The passage says they watered every morning.", evidence: [0] },
      { statement: "The sunflowers were shorter than the students.", isTrue: false, explanation: "The sunflowers grew taller than the students.", evidence: [0] }
    ],
    questions: [
      { question: "When did they plant the garden?", choices: ["Last winter", "Last spring", "Last autumn"], correctIndex: 1, type: 'when', evidence: [0] },
      { question: "What did they make with the tomatoes?", choices: ["Juice", "Soup", "Salad"], correctIndex: 2, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm18',
    title: "The Sports Day",
    level: 'medium',
    text: "Our school's sports day was held last October. There were many events like running, relay races, and tug-of-war. Kenta's team, the Red Team, won the relay race. However, the White Team won overall because they got the most points. Everyone tried their best and had a wonderful day.",
    trueFalse: [
      { statement: "Sports day was in September.", isTrue: false, explanation: "It was held last October.", evidence: [0] },
      { statement: "Kenta's team won the relay race.", isTrue: true, explanation: "The Red Team won the relay race.", evidence: [0] },
      { statement: "The Red Team won overall.", isTrue: false, explanation: "The White Team won overall.", evidence: [0] }
    ],
    questions: [
      { question: "What team was Kenta on?", choices: ["White Team", "Blue Team", "Red Team"], correctIndex: 2, type: 'what', evidence: [0] },
      { question: "Why did the White Team win overall?", choices: ["They won every event", "They got the most points", "They had more members"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'm19',
    title: "The Bicycle Ride",
    level: 'medium',
    text: "Taro and his father rode their bicycles to the river last Saturday. It took them 30 minutes to get there. They sat under a big tree and ate rice balls for lunch. Taro saw some fish in the river. On the way home, they stopped at a convenience store and bought ice cream.",
    trueFalse: [
      { statement: "They went to the river on Sunday.", isTrue: false, explanation: "They went last Saturday.", evidence: [0] },
      { statement: "They ate rice balls for lunch.", isTrue: true, explanation: "The passage says they ate rice balls.", evidence: [0] },
      { statement: "It took one hour to get to the river.", isTrue: false, explanation: "It took 30 minutes.", evidence: [0] }
    ],
    questions: [
      { question: "How did Taro and his father get to the river?", choices: ["By car", "By bicycle", "On foot"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "What did they buy on the way home?", choices: ["Drinks", "Ice cream", "Snacks"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'm20',
    title: "The Sleepover",
    level: 'medium',
    text: "Last Friday, Sakura had a sleepover at her friend Akari's house. They made pizza together for dinner. After dinner, they watched a funny movie and laughed a lot. They stayed up until midnight talking about their favorite singers. The next morning, Akari's mother made pancakes for breakfast.",
    trueFalse: [
      { statement: "The sleepover was on Saturday.", isTrue: false, explanation: "It was last Friday.", evidence: [0] },
      { statement: "They made pizza for dinner.", isTrue: true, explanation: "The passage says they made pizza together.", evidence: [0] },
      { statement: "They went to bed early.", isTrue: false, explanation: "They stayed up until midnight.", evidence: [0] }
    ],
    questions: [
      { question: "What did they talk about until midnight?", choices: ["School", "Their favorite singers", "Movies"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Who made breakfast the next morning?", choices: ["Sakura", "Akari", "Akari's mother"], correctIndex: 2, type: 'who', evidence: [0] }
    ]
  },

  // ===== HARD (20 passages) =====
  {
    id: 'h1',
    title: "The Lost Cat",
    level: 'hard',
    text: "Yesterday afternoon, Mrs. Yamamoto found a small gray cat in her garden. The cat was wearing a blue collar with a tag that said 'Mochi.' She put up posters around the neighborhood and posted on social media. By evening, a boy named Shota came to pick up his cat. He said Mochi had been missing for three days.",
    trueFalse: [
      { statement: "The cat was found in the morning.", isTrue: false, explanation: "The cat was found in the afternoon.", evidence: [0] },
      { statement: "The cat's name was Mochi.", isTrue: true, explanation: "The collar tag said 'Mochi.'", evidence: [0] },
      { statement: "The cat had been missing for a week.", isTrue: false, explanation: "Mochi had been missing for three days.", evidence: [0] }
    ],
    questions: [
      { question: "How did Mrs. Yamamoto try to find the owner?", choices: ["She called the police", "She put up posters and posted on social media", "She asked her neighbors one by one"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "Who is Mochi's owner?", choices: ["Mrs. Yamamoto", "A boy named Shota", "A girl named Yuki"], correctIndex: 1, type: 'who', evidence: [0] }
    ]
  },
  {
    id: 'h2',
    title: "Recycling Day",
    level: 'hard',
    text: "In Japan, recycling rules are very strict. In Haruki's city, they separate trash into five categories: burnable, non-burnable, plastic, paper, and cans. Burnable trash is collected on Mondays and Thursdays. If you put your trash out on the wrong day, it will not be collected. Haruki thinks this system is good for the environment.",
    trueFalse: [
      { statement: "Trash is separated into three categories.", isTrue: false, explanation: "Trash is separated into five categories.", evidence: [0] },
      { statement: "Burnable trash is collected on Mondays and Thursdays.", isTrue: true, explanation: "The passage says burnable trash is collected on those days.", evidence: [0] },
      { statement: "Haruki thinks recycling is good for the environment.", isTrue: true, explanation: "Haruki thinks this system is good for the environment.", evidence: [0] }
    ],
    questions: [
      { question: "What happens if you put trash out on the wrong day?", choices: ["You get a fine", "It will not be collected", "Your neighbors complain"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "How many categories is trash separated into?", choices: ["Three", "Four", "Five"], correctIndex: 2, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'h3',
    title: "The Dolphin Show",
    level: 'hard',
    text: "Last summer, the Nakamura family went to an aquarium in Okinawa. They watched an amazing dolphin show. Four dolphins jumped through hoops and splashed water on the audience. The youngest daughter, Mei, was scared at first but then she laughed and wanted to see it again. The family also saw a giant whale shark in the main tank.",
    trueFalse: [
      { statement: "The aquarium was in Tokyo.", isTrue: false, explanation: "The aquarium was in Okinawa.", evidence: [0] },
      { statement: "Four dolphins performed in the show.", isTrue: true, explanation: "Four dolphins jumped through hoops.", evidence: [0] },
      { statement: "Mei enjoyed the show right from the start.", isTrue: false, explanation: "Mei was scared at first.", evidence: [0] }
    ],
    questions: [
      { question: "Why was Mei scared at first?", choices: ["The dolphins were too big", "The dolphins splashed water", "She does not like animals"], correctIndex: 1, type: 'why', evidence: [0] },
      { question: "What did the family see in the main tank?", choices: ["A giant octopus", "A whale shark", "Sea turtles"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'h4',
    title: "The School Newspaper",
    level: 'hard',
    text: "Ayumi is the editor of the school newspaper. Every month, she leads a team of eight students to write articles. This month's issue is about the school's 50th anniversary. Ayumi interviewed the principal, who has worked at the school for 20 years. The newspaper will be published next Wednesday and given to all 600 students.",
    trueFalse: [
      { statement: "Ayumi works on the newspaper alone.", isTrue: false, explanation: "She leads a team of eight students.", evidence: [0] },
      { statement: "The school is celebrating its 50th anniversary.", isTrue: true, explanation: "The issue is about the school's 50th anniversary.", evidence: [0] },
      { statement: "The newspaper comes out every week.", isTrue: false, explanation: "The newspaper comes out every month.", evidence: [0] }
    ],
    questions: [
      { question: "How long has the principal worked at the school?", choices: ["10 years", "20 years", "50 years"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "When will the newspaper be published?", choices: ["Next Monday", "Next Wednesday", "Next Friday"], correctIndex: 1, type: 'when', evidence: [0] }
    ]
  },
  {
    id: 'h5',
    title: "The Exchange Student",
    level: 'hard',
    text: "Next April, Rina will go to Canada as an exchange student for six months. She will stay with a host family in Vancouver. Rina is excited but also nervous because her English is not perfect yet. She has been studying English every day for two years to prepare. Her host family has a daughter the same age as Rina.",
    trueFalse: [
      { statement: "Rina will go to America.", isTrue: false, explanation: "Rina will go to Canada.", evidence: [0] },
      { statement: "She will stay for six months.", isTrue: true, explanation: "She will go for six months.", evidence: [0] },
      { statement: "Rina has been studying English for two years.", isTrue: true, explanation: "She has been studying every day for two years.", evidence: [0] }
    ],
    questions: [
      { question: "Where in Canada will Rina stay?", choices: ["Toronto", "Vancouver", "Montreal"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "Why is Rina nervous?", choices: ["She doesn't like Canada", "Her English is not perfect yet", "She will miss school"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'h6',
    title: "The Marathon Runner",
    level: 'hard',
    text: "Mr. Kato, a 45-year-old teacher, ran his first marathon last November. He trained for eight months, running 10 kilometers every morning before school. The marathon was held in Tokyo and had 30,000 runners. Mr. Kato finished in 4 hours and 15 minutes. He said it was the hardest but most rewarding thing he has ever done.",
    trueFalse: [
      { statement: "Mr. Kato is a student.", isTrue: false, explanation: "Mr. Kato is a teacher.", evidence: [0] },
      { statement: "He trained for eight months.", isTrue: true, explanation: "He trained for eight months.", evidence: [0] },
      { statement: "The marathon had 30,000 runners.", isTrue: true, explanation: "The passage says there were 30,000 runners.", evidence: [0] }
    ],
    questions: [
      { question: "How long did it take Mr. Kato to finish?", choices: ["3 hours 30 minutes", "4 hours 15 minutes", "5 hours"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "Where was the marathon held?", choices: ["Osaka", "Tokyo", "Kyoto"], correctIndex: 1, type: 'where', evidence: [0] }
    ]
  },
  {
    id: 'h7',
    title: "A Special Announcement",
    level: 'hard',
    text: "Attention all students! Starting next month, our school will have a new English conversation class every Wednesday after school. The class will be taught by Ms. Green, a teacher from New Zealand. The class is free, but students must sign up by this Friday. There are only 20 spots available, so please sign up early.",
    trueFalse: [
      { statement: "The new class starts this week.", isTrue: false, explanation: "The class starts next month.", evidence: [0] },
      { statement: "Ms. Green is from Australia.", isTrue: false, explanation: "Ms. Green is from New Zealand.", evidence: [0] },
      { statement: "Students must sign up by Friday.", isTrue: true, explanation: "Students must sign up by this Friday.", evidence: [0] }
    ],
    questions: [
      { question: "How many spots are available?", choices: ["10", "20", "30"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "When is the conversation class?", choices: ["Tuesday", "Wednesday", "Thursday"], correctIndex: 1, type: 'when', evidence: [0] }
    ]
  },
  {
    id: 'h8',
    title: "The Camping Trip",
    level: 'hard',
    text: "Last weekend, the Suzuki family went camping near Mount Fuji. They arrived on Saturday morning and set up their tent near a river. That night, they made a campfire and cooked curry. On Sunday, they hiked to a waterfall that was 30 meters tall. The father said it was the most beautiful waterfall he had ever seen. They went home Sunday evening, tired but happy.",
    trueFalse: [
      { statement: "They camped near the ocean.", isTrue: false, explanation: "They camped near Mount Fuji, by a river.", evidence: [0] },
      { statement: "They cooked curry over a campfire.", isTrue: true, explanation: "They made a campfire and cooked curry.", evidence: [0] },
      { statement: "The waterfall was 30 meters tall.", isTrue: true, explanation: "The passage says the waterfall was 30 meters tall.", evidence: [0] }
    ],
    questions: [
      { question: "When did the family arrive at the campsite?", choices: ["Friday evening", "Saturday morning", "Sunday morning"], correctIndex: 1, type: 'when', evidence: [0] },
      { question: "What did they do on Sunday?", choices: ["Went fishing", "Hiked to a waterfall", "Swam in the river"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'h9',
    title: "Endangered Sea Turtles",
    level: 'hard',
    text: "Sea turtles have been living on Earth for over 100 million years, but now many species are endangered. The main threats include pollution, fishing nets, and the loss of nesting beaches caused by coastal development. In Japan, volunteers patrol beaches at night during summer to protect turtle eggs from predators. These conservation efforts have helped increase the number of baby turtles that reach the ocean safely.",
    trueFalse: [
      { statement: "Sea turtles have existed for about 50 million years.", isTrue: false, explanation: "They have been living on Earth for over 100 million years.", evidence: [0] },
      { statement: "Pollution is one of the threats to sea turtles.", isTrue: true, explanation: "The passage lists pollution as one of the main threats.", evidence: [0] },
      { statement: "Volunteers protect turtle eggs during winter.", isTrue: false, explanation: "Volunteers patrol beaches during summer.", evidence: [0] }
    ],
    questions: [
      { question: "What is one cause of nesting beach loss?", choices: ["Climate change", "Coastal development", "Ocean storms"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why do volunteers patrol beaches at night?", choices: ["To watch turtles swim", "To protect turtle eggs from predators", "To count the turtles"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'h10',
    title: "The Invention of Instant Noodles",
    level: 'hard',
    text: "Instant noodles were invented by Momofuku Ando in 1958 in Osaka, Japan. After World War II, many people were hungry, and Ando wanted to create a food that was cheap, tasty, and easy to prepare. He spent a whole year experimenting in his small shed. Today, over 100 billion servings of instant noodles are consumed worldwide every year. Ando is considered one of Japan's greatest inventors.",
    trueFalse: [
      { statement: "Instant noodles were invented in Tokyo.", isTrue: false, explanation: "They were invented in Osaka.", evidence: [0] },
      { statement: "Ando spent one year developing instant noodles.", isTrue: true, explanation: "He spent a whole year experimenting.", evidence: [0] },
      { statement: "Fewer than 50 billion servings are consumed yearly.", isTrue: false, explanation: "Over 100 billion servings are consumed worldwide every year.", evidence: [0] }
    ],
    questions: [
      { question: "When were instant noodles invented?", choices: ["1948", "1958", "1968"], correctIndex: 1, type: 'when', evidence: [0] },
      { question: "Why did Ando want to create instant noodles?", choices: ["To become famous", "Because many people were hungry after the war", "To win a cooking competition"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'h11',
    title: "Solar Energy in Schools",
    level: 'hard',
    text: "Midori Junior High School installed solar panels on its roof last year. The panels generate enough electricity to power all the lights in the school building. Since the installation, the school has reduced its electricity bill by 40 percent. The saved money is being used to buy new books for the library. Other schools in the city are now interested in following the same approach.",
    trueFalse: [
      { statement: "The solar panels power the entire school.", isTrue: false, explanation: "They generate enough electricity to power all the lights, not the entire school.", evidence: [0] },
      { statement: "The electricity bill was reduced by 40 percent.", isTrue: true, explanation: "The school reduced its bill by 40 percent.", evidence: [0] },
      { statement: "The saved money is used for sports equipment.", isTrue: false, explanation: "It is used to buy new books for the library.", evidence: [0] }
    ],
    questions: [
      { question: "Where were the solar panels installed?", choices: ["In the playground", "On the roof", "In the parking lot"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "How is the saved money being used?", choices: ["To hire more teachers", "To buy new books", "To build a gym"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'h12',
    title: "Traditional Japanese Gardens",
    level: 'hard',
    text: "Japanese gardens are designed to represent natural landscapes in a small space. They often include ponds, rocks, trees, and bridges. The famous Kenrokuen Garden in Kanazawa is considered one of the three most beautiful gardens in Japan. It was created over 200 years ago by the local lord. Visitors can enjoy different scenery in each season, especially the snow-covered trees in winter.",
    trueFalse: [
      { statement: "Japanese gardens try to represent natural landscapes.", isTrue: true, explanation: "The passage says they are designed to represent natural landscapes.", evidence: [0] },
      { statement: "Kenrokuen Garden is in Kyoto.", isTrue: false, explanation: "It is in Kanazawa.", evidence: [0] },
      { statement: "The garden was created about 100 years ago.", isTrue: false, explanation: "It was created over 200 years ago.", evidence: [0] }
    ],
    questions: [
      { question: "Who created Kenrokuen Garden?", choices: ["A famous artist", "The local lord", "A Buddhist monk"], correctIndex: 1, type: 'who', evidence: [0] },
      { question: "What is especially beautiful in winter?", choices: ["The cherry blossoms", "The pond reflections", "The snow-covered trees"], correctIndex: 2, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'h13',
    title: "The Rise of Online Shopping",
    level: 'hard',
    text: "Online shopping has become very popular in Japan, especially since the pandemic. A recent survey showed that 70 percent of Japanese teenagers have bought something online at least once. The most commonly purchased items are clothes, books, and electronics. However, some people still prefer shopping in stores because they want to see and touch products before buying them. Experts say both online and physical stores will continue to exist side by side.",
    trueFalse: [
      { statement: "Online shopping became less popular after the pandemic.", isTrue: false, explanation: "It became more popular, especially since the pandemic.", evidence: [0] },
      { statement: "Seventy percent of Japanese teenagers have shopped online.", isTrue: true, explanation: "The survey showed 70 percent have bought something online.", evidence: [0] },
      { statement: "Experts say physical stores will disappear.", isTrue: false, explanation: "Experts say both will continue to exist side by side.", evidence: [0] }
    ],
    questions: [
      { question: "What are the most commonly purchased items online?", choices: ["Food and drinks", "Clothes, books, and electronics", "Toys and games"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why do some people prefer physical stores?", choices: ["They are cheaper", "They want to see and touch products", "They have more variety"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'h14',
    title: "The Volunteer Experience",
    level: 'hard',
    text: "During summer vacation, Yuki volunteered at a retirement home for two weeks. She helped the elderly residents with meals, read books to them, and organized simple games. One resident, an 85-year-old woman named Mrs. Ono, told Yuki stories about life in Japan during the 1960s. Yuki learned a lot about history and said the experience changed the way she thinks about older people.",
    trueFalse: [
      { statement: "Yuki volunteered at a hospital.", isTrue: false, explanation: "She volunteered at a retirement home.", evidence: [0] },
      { statement: "She volunteered for two weeks.", isTrue: true, explanation: "The passage says she volunteered for two weeks.", evidence: [0] },
      { statement: "Mrs. Ono told stories about the 1980s.", isTrue: false, explanation: "She told stories about life in the 1960s.", evidence: [0] }
    ],
    questions: [
      { question: "What did Yuki do at the retirement home?", choices: ["Cleaned rooms", "Helped with meals and read books", "Gave medical care"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "How old was Mrs. Ono?", choices: ["75 years old", "80 years old", "85 years old"], correctIndex: 2, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'h15',
    title: "The Power of Music",
    level: 'hard',
    text: "Research has shown that listening to music can reduce stress and improve concentration. Many students in Japan listen to classical music while studying because it helps them focus. A study conducted at a university in Kyoto found that students who listened to Mozart performed 15 percent better on math tests. However, music with lyrics can be distracting, so instrumental music is recommended for studying.",
    trueFalse: [
      { statement: "Music has no effect on concentration.", isTrue: false, explanation: "Research shows music can improve concentration.", evidence: [0] },
      { statement: "The study was conducted at a university in Kyoto.", isTrue: true, explanation: "The passage says the study was at a university in Kyoto.", evidence: [0] },
      { statement: "Music with lyrics is recommended for studying.", isTrue: false, explanation: "Instrumental music is recommended because lyrics can be distracting.", evidence: [0] }
    ],
    questions: [
      { question: "How much better did students perform when listening to Mozart?", choices: ["10 percent", "15 percent", "20 percent"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "Why is instrumental music better for studying?", choices: ["It is louder", "Lyrics can be distracting", "It is more popular"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'h16',
    title: "Plastic in the Ocean",
    level: 'hard',
    text: "Every year, approximately eight million tons of plastic waste enters the world's oceans. This plastic harms marine animals that mistake it for food. Sea birds, turtles, and fish are especially affected. Scientists have found tiny pieces of plastic, called microplastics, in fish that are sold in supermarkets. Many countries, including Japan, have started banning single-use plastic bags to reduce this growing problem.",
    trueFalse: [
      { statement: "About eight million tons of plastic enters the ocean yearly.", isTrue: true, explanation: "The passage says approximately eight million tons enter the oceans.", evidence: [0] },
      { statement: "Only fish are affected by ocean plastic.", isTrue: false, explanation: "Sea birds, turtles, and fish are all affected.", evidence: [0] },
      { statement: "Japan has banned single-use plastic bags.", isTrue: true, explanation: "Many countries, including Japan, have started banning them.", evidence: [0] }
    ],
    questions: [
      { question: "What are microplastics?", choices: ["Large plastic bottles", "Tiny pieces of plastic", "Plastic bags"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why do marine animals eat plastic?", choices: ["They are hungry", "They mistake it for food", "They like the taste"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'h17',
    title: "The History of Origami",
    level: 'hard',
    text: "Origami, the Japanese art of paper folding, has a history of over 1,000 years. It was originally used for religious ceremonies and special occasions. The most famous origami design is the crane, which is a symbol of peace and long life in Japan. According to tradition, if you fold 1,000 cranes, your wish will come true. Today, origami is studied even by engineers who use its folding principles to design satellite solar panels.",
    trueFalse: [
      { statement: "Origami has a history of about 500 years.", isTrue: false, explanation: "It has a history of over 1,000 years.", evidence: [0] },
      { statement: "The crane is the most famous origami design.", isTrue: true, explanation: "The passage says the crane is the most famous design.", evidence: [0] },
      { statement: "Engineers use origami principles for satellite design.", isTrue: true, explanation: "Engineers use folding principles to design satellite solar panels.", evidence: [0] }
    ],
    questions: [
      { question: "What was origami originally used for?", choices: ["Children's play", "Religious ceremonies and special occasions", "School art classes"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "How many cranes must you fold to make a wish come true?", choices: ["100", "500", "1,000"], correctIndex: 2, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'h18',
    title: "The Bullet Train",
    level: 'hard',
    text: "Japan's Shinkansen, also known as the bullet train, began service in 1964 between Tokyo and Osaka. It was the world's first high-speed rail system. The newest model, the N700S, can travel at speeds up to 300 kilometers per hour. The Shinkansen is famous for its punctuality; the average delay is less than one minute per year. It has carried over 10 billion passengers since it started, with zero fatal accidents.",
    trueFalse: [
      { statement: "The Shinkansen started in 1970.", isTrue: false, explanation: "It began service in 1964.", evidence: [0] },
      { statement: "The N700S can travel at 300 km/h.", isTrue: true, explanation: "The newest model can travel at speeds up to 300 km/h.", evidence: [0] },
      { statement: "The Shinkansen has had several accidents.", isTrue: false, explanation: "It has had zero fatal accidents.", evidence: [0] }
    ],
    questions: [
      { question: "What is the average delay of the Shinkansen?", choices: ["Less than one minute per year", "About five minutes per day", "About ten minutes per month"], correctIndex: 0, type: 'how', evidence: [0] },
      { question: "How many passengers has the Shinkansen carried?", choices: ["Over 1 billion", "Over 10 billion", "Over 100 billion"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'h19',
    title: "Food Waste Problem",
    level: 'hard',
    text: "Japan produces about 6 million tons of food waste every year. Much of this food is still safe to eat when it is thrown away. Convenience stores and restaurants are the biggest sources of food waste. Recently, some companies have started selling food at a discount before it expires. There are also food banks that collect unwanted food and give it to people in need. Reducing food waste has become an important social issue.",
    trueFalse: [
      { statement: "Japan produces about 6 million tons of food waste yearly.", isTrue: true, explanation: "The passage states about 6 million tons.", evidence: [0] },
      { statement: "Most food waste comes from homes.", isTrue: false, explanation: "Convenience stores and restaurants are the biggest sources.", evidence: [0] },
      { statement: "Food banks sell food at low prices.", isTrue: false, explanation: "Food banks collect unwanted food and give it to people in need.", evidence: [0] }
    ],
    questions: [
      { question: "What have some companies started doing to reduce waste?", choices: ["Throwing food away faster", "Selling food at a discount before it expires", "Cooking smaller portions"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Who do food banks give food to?", choices: ["Restaurants", "People in need", "Farmers"], correctIndex: 1, type: 'who', evidence: [0] }
    ]
  },
  {
    id: 'h20',
    title: "The School Festival Play",
    level: 'hard',
    text: "For the school festival, Class 2-C decided to perform a play based on a famous Japanese folktale, Momotaro. Twelve students acted on stage while others worked on costumes, lighting, and sound effects. They rehearsed every day after school for three weeks. On the day of the performance, the gym was packed with over 300 people. The audience loved the show, and the principal praised the students for their teamwork and creativity.",
    trueFalse: [
      { statement: "The play was based on Urashima Taro.", isTrue: false, explanation: "The play was based on Momotaro.", evidence: [0] },
      { statement: "Twelve students acted on stage.", isTrue: true, explanation: "The passage says twelve students acted on stage.", evidence: [0] },
      { statement: "They rehearsed for two weeks.", isTrue: false, explanation: "They rehearsed for three weeks.", evidence: [0] }
    ],
    questions: [
      { question: "How many people watched the performance?", choices: ["Over 100", "Over 200", "Over 300"], correctIndex: 2, type: 'how', evidence: [0] },
      { question: "What did the principal praise the students for?", choices: ["Their acting skills", "Their teamwork and creativity", "Their costumes"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },

  // ===== ADVANCED (20 passages) =====
  {
    id: 'a1',
    title: "The Psychology of Color",
    level: 'advanced',
    text: "Research in psychology has demonstrated that colors can significantly influence human emotions and behavior. For instance, red is often associated with urgency and excitement, which is why it is frequently used in sale advertisements. Blue, on the other hand, tends to evoke feelings of calmness and trust, making it a popular choice for corporate logos and hospital interiors. Studies conducted at several universities have revealed that students who took exams in rooms painted blue performed better than those in red rooms, suggesting that environmental color may affect cognitive performance.",
    trueFalse: [
      { statement: "Red is commonly used in sale advertisements because it creates calmness.", isTrue: false, explanation: "Red is associated with urgency and excitement, not calmness.", evidence: [0] },
      { statement: "Blue is a popular color for corporate logos.", isTrue: true, explanation: "The passage says blue is popular for corporate logos because it evokes trust.", evidence: [0] },
      { statement: "Students performed better in blue rooms than red rooms.", isTrue: true, explanation: "Studies revealed students in blue rooms performed better.", evidence: [0] }
    ],
    questions: [
      { question: "Why is blue used in hospital interiors?", choices: ["It is the cheapest paint", "It evokes feelings of calmness and trust", "It makes rooms look bigger"], correctIndex: 1, type: 'why', evidence: [0] },
      { question: "What does the research suggest about environmental color?", choices: ["It has no real effect", "It may affect cognitive performance", "It only affects emotions, not performance"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a2',
    title: "The Economics of Water Scarcity",
    level: 'advanced',
    text: "Although approximately 71 percent of the Earth's surface is covered with water, only about 2.5 percent of it is freshwater, and much of that is locked in glaciers and ice caps. As the global population continues to grow, the demand for clean freshwater is increasing rapidly. The United Nations has warned that by 2050, nearly half of the world's population could face severe water shortages. Some economists argue that water should be priced more accurately to reflect its true value, which would encourage conservation and reduce waste. However, critics point out that making water more expensive could disproportionately affect low-income communities.",
    trueFalse: [
      { statement: "About 10 percent of Earth's water is freshwater.", isTrue: false, explanation: "Only about 2.5 percent is freshwater.", evidence: [0] },
      { statement: "The UN warned that water shortages could affect half the world by 2050.", isTrue: true, explanation: "The UN warned nearly half of the population could face severe shortages.", evidence: [0] },
      { statement: "All economists agree water should be priced higher.", isTrue: false, explanation: "Critics argue it could disproportionately affect low-income communities.", evidence: [0] }
    ],
    questions: [
      { question: "Why is most freshwater unavailable for use?", choices: ["It is polluted", "It is locked in glaciers and ice caps", "It is too deep underground"], correctIndex: 1, type: 'why', evidence: [0] },
      { question: "What is the main concern about raising water prices?", choices: ["It would waste more water", "It could affect low-income communities", "It would not change behavior"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a3',
    title: "Artificial Intelligence in Medicine",
    level: 'advanced',
    text: "Artificial intelligence is transforming the field of medicine in remarkable ways. AI algorithms can now analyze medical images such as X-rays and MRI scans with accuracy that sometimes exceeds that of experienced doctors. In 2020, a hospital in Tokyo implemented an AI system that could detect early-stage cancer with 95 percent accuracy, compared to 87 percent for human specialists. Despite these advances, many medical professionals emphasize that AI should be used as a tool to assist doctors rather than replace them, since patient care requires empathy, communication, and ethical judgment that machines cannot yet provide.",
    trueFalse: [
      { statement: "AI can analyze medical images less accurately than doctors.", isTrue: false, explanation: "AI accuracy sometimes exceeds that of experienced doctors.", evidence: [0] },
      { statement: "The Tokyo hospital's AI detected cancer with 95 percent accuracy.", isTrue: true, explanation: "The passage states the AI achieved 95 percent accuracy.", evidence: [0] },
      { statement: "Most medical professionals want AI to replace doctors entirely.", isTrue: false, explanation: "They emphasize AI should assist doctors, not replace them.", evidence: [0] }
    ],
    questions: [
      { question: "What types of medical images can AI analyze?", choices: ["Only blood tests", "X-rays and MRI scans", "Only photographs"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why can't AI fully replace doctors?", choices: ["AI is too expensive", "Patient care requires empathy and ethical judgment", "AI makes too many mistakes"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'a4',
    title: "The Impact of Social Media on Youth",
    level: 'advanced',
    text: "Social media platforms have fundamentally changed how young people communicate and form relationships. While these platforms offer benefits such as staying connected with friends and accessing information, a growing body of research suggests that excessive use may have negative consequences. A study published in the Journal of Adolescent Health found that teenagers who spent more than three hours per day on social media were twice as likely to report symptoms of anxiety and depression. Furthermore, the constant comparison with others' curated online lives can lead to decreased self-esteem, particularly among girls aged 13 to 17.",
    trueFalse: [
      { statement: "Social media has had no impact on how young people communicate.", isTrue: false, explanation: "The passage says social media has fundamentally changed communication.", evidence: [0] },
      { statement: "Spending more than three hours daily on social media doubles the risk of anxiety.", isTrue: true, explanation: "The study found they were twice as likely to report anxiety and depression.", evidence: [0] },
      { statement: "Boys are more affected by social media comparison than girls.", isTrue: false, explanation: "The passage says girls aged 13 to 17 are particularly affected.", evidence: [0] }
    ],
    questions: [
      { question: "What is one benefit of social media mentioned in the passage?", choices: ["Improving grades", "Staying connected with friends", "Getting more exercise"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why does comparison on social media decrease self-esteem?", choices: ["People share boring content", "People compare themselves to others' curated lives", "Social media costs too much money"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'a5',
    title: "Climate Change and Coral Reefs",
    level: 'advanced',
    text: "Coral reefs, often called the rainforests of the sea, support approximately 25 percent of all marine species despite covering less than one percent of the ocean floor. However, rising ocean temperatures caused by climate change have led to a phenomenon known as coral bleaching, in which corals expel the algae living in their tissues and turn white. If the water temperature does not return to normal within a few weeks, the coral dies. Scientists estimate that 50 percent of the world's coral reefs have already been lost. Without urgent action to reduce carbon emissions, the remaining reefs could disappear entirely within the next 30 years.",
    trueFalse: [
      { statement: "Coral reefs cover about 10 percent of the ocean floor.", isTrue: false, explanation: "They cover less than one percent of the ocean floor.", evidence: [0] },
      { statement: "Coral bleaching occurs when corals expel algae from their tissues.", isTrue: true, explanation: "The passage explains this is what happens during bleaching.", evidence: [0] },
      { statement: "All of the world's coral reefs are still intact.", isTrue: false, explanation: "Fifty percent have already been lost.", evidence: [0] }
    ],
    questions: [
      { question: "Why are coral reefs called the rainforests of the sea?", choices: ["They are very large", "They support about 25 percent of marine species", "They produce a lot of oxygen"], correctIndex: 1, type: 'why', evidence: [0] },
      { question: "What could happen to remaining reefs within 30 years?", choices: ["They will grow larger", "They could disappear entirely", "They will adapt to warmer water"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a6',
    title: "The Silent Epidemic of Loneliness",
    level: 'advanced',
    text: "In recent years, loneliness has been recognized as a serious public health issue in many developed countries. Japan appointed the world's first Minister of Loneliness in 2021, following the United Kingdom's similar move in 2018. Research has shown that chronic loneliness can be as harmful to physical health as smoking 15 cigarettes a day, increasing the risk of heart disease, stroke, and dementia. The problem is particularly severe among elderly people who live alone, but studies indicate that young adults aged 18 to 25 also report high levels of loneliness. Experts recommend community-based programs and intergenerational activities as potential solutions.",
    trueFalse: [
      { statement: "The UK appointed the first Minister of Loneliness before Japan.", isTrue: true, explanation: "The UK did so in 2018, Japan in 2021.", evidence: [0] },
      { statement: "Chronic loneliness is compared to smoking 15 cigarettes a day.", isTrue: true, explanation: "The passage makes this comparison regarding health effects.", evidence: [0] },
      { statement: "Loneliness only affects elderly people.", isTrue: false, explanation: "Young adults aged 18 to 25 also report high levels of loneliness.", evidence: [0] }
    ],
    questions: [
      { question: "When did Japan appoint a Minister of Loneliness?", choices: ["2018", "2020", "2021"], correctIndex: 2, type: 'when', evidence: [0] },
      { question: "What solutions do experts recommend?", choices: ["More social media use", "Community-based programs and intergenerational activities", "Living in larger cities"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a7',
    title: "The Space Debris Problem",
    level: 'advanced',
    text: "Since the beginning of the space age in 1957, humanity has launched thousands of satellites into orbit around Earth. Many of these satellites are no longer functioning, and together with fragments from rocket stages and collisions, they have created a growing cloud of space debris. NASA estimates there are currently over 27,000 pieces of debris larger than 10 centimeters orbiting Earth at speeds of up to 28,000 kilometers per hour. At such speeds, even a tiny piece of debris could cause catastrophic damage to the International Space Station or active satellites. Several space agencies, including JAXA, are developing technologies to capture and remove debris before the situation becomes unmanageable.",
    trueFalse: [
      { statement: "The space age began in 1967.", isTrue: false, explanation: "The space age began in 1957.", evidence: [0] },
      { statement: "There are over 27,000 large pieces of debris in orbit.", isTrue: true, explanation: "NASA estimates over 27,000 pieces larger than 10 cm.", evidence: [0] },
      { statement: "Space debris travels slowly and poses little risk.", isTrue: false, explanation: "Debris travels at up to 28,000 km/h and could cause catastrophic damage.", evidence: [0] }
    ],
    questions: [
      { question: "What creates space debris?", choices: ["Asteroids hitting Earth", "Non-functioning satellites, rocket fragments, and collisions", "Solar radiation"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "What is JAXA developing?", choices: ["New satellites", "Technologies to capture and remove debris", "Faster rockets"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a8',
    title: "The Decline of Insect Populations",
    level: 'advanced',
    text: "A comprehensive study published in the journal Biological Conservation found that more than 40 percent of insect species worldwide are declining, and one-third are classified as endangered. Insects play a vital role in ecosystems as pollinators, decomposers, and a food source for other animals. The main causes of this decline include intensive agriculture, pesticide use, habitat loss, and climate change. Scientists warn that if current trends continue, insects could vanish within a century. Such an extinction event would have devastating consequences for food production, as approximately 75 percent of the world's food crops depend at least partly on insect pollination.",
    trueFalse: [
      { statement: "About 20 percent of insect species are declining.", isTrue: false, explanation: "More than 40 percent are declining.", evidence: [0] },
      { statement: "Insects serve as pollinators and decomposers.", isTrue: true, explanation: "The passage lists pollinators and decomposers as key roles.", evidence: [0] },
      { statement: "About 75 percent of food crops depend partly on insect pollination.", isTrue: true, explanation: "The passage states approximately 75 percent depend on insect pollination.", evidence: [0] }
    ],
    questions: [
      { question: "What fraction of insect species are classified as endangered?", choices: ["One-quarter", "One-third", "One-half"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "What could happen if insect decline continues?", choices: ["Oceans will rise", "Insects could vanish within a century", "Temperatures will drop"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a9',
    title: "Bilingualism and the Brain",
    level: 'advanced',
    text: "Neuroscientific research has revealed that bilingualism offers significant cognitive benefits beyond the obvious advantage of being able to communicate in two languages. Studies using brain imaging technology have shown that bilingual individuals have denser gray matter in regions associated with language processing and executive function. Furthermore, research conducted at York University in Canada found that bilingual people develop symptoms of dementia an average of four to five years later than monolinguals. Scientists believe that the constant mental exercise of switching between languages strengthens neural pathways and builds what is known as cognitive reserve, which protects the brain against age-related decline.",
    trueFalse: [
      { statement: "Bilingualism only benefits communication skills.", isTrue: false, explanation: "It offers significant cognitive benefits beyond communication.", evidence: [0] },
      { statement: "Bilingual people tend to develop dementia symptoms later.", isTrue: true, explanation: "They develop symptoms four to five years later than monolinguals.", evidence: [0] },
      { statement: "The research on dementia was conducted at Harvard.", isTrue: false, explanation: "It was conducted at York University in Canada.", evidence: [0] }
    ],
    questions: [
      { question: "What is 'cognitive reserve'?", choices: ["A type of memory loss", "Protection against age-related brain decline", "A language learning technique"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "How does switching between languages help the brain?", choices: ["It makes people tired", "It strengthens neural pathways", "It reduces vocabulary"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'a10',
    title: "The Ethics of Genetic Engineering",
    level: 'advanced',
    text: "The development of CRISPR gene-editing technology has opened unprecedented possibilities in medicine and agriculture. Scientists can now precisely modify DNA sequences to correct genetic disorders, create disease-resistant crops, and even potentially eliminate inherited diseases before birth. However, the technology raises profound ethical questions. In 2018, a Chinese scientist announced that he had created the world's first gene-edited babies, sparking international outrage and leading to his imprisonment. Many bioethicists argue that while therapeutic applications of gene editing should be encouraged, modifying human embryos for enhancement purposes crosses a moral boundary that could lead to a new form of inequality.",
    trueFalse: [
      { statement: "CRISPR technology can only be used in agriculture.", isTrue: false, explanation: "It can be used in both medicine and agriculture.", evidence: [0] },
      { statement: "A Chinese scientist created gene-edited babies in 2018.", isTrue: true, explanation: "The passage states this happened in 2018.", evidence: [0] },
      { statement: "All bioethicists oppose gene editing completely.", isTrue: false, explanation: "Many argue therapeutic applications should be encouraged.", evidence: [0] }
    ],
    questions: [
      { question: "What happened to the scientist who created gene-edited babies?", choices: ["He won a prize", "He was imprisoned", "He continued his research"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why do bioethicists worry about enhancement gene editing?", choices: ["It is too expensive", "It could lead to a new form of inequality", "It does not work well"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'a11',
    title: "The History of Pandemics",
    level: 'advanced',
    text: "Throughout human history, pandemics have shaped civilizations in profound ways. The Black Death of the 14th century killed an estimated one-third of Europe's population and led to significant social and economic changes, including higher wages for surviving workers. The 1918 Spanish Flu infected approximately 500 million people worldwide, roughly one-third of the global population at the time. More recently, the COVID-19 pandemic accelerated the adoption of remote work and digital communication technologies. Historians note that while pandemics cause immense suffering, they have also historically acted as catalysts for social reform, technological innovation, and improvements in public health infrastructure.",
    trueFalse: [
      { statement: "The Black Death killed about half of Europe's population.", isTrue: false, explanation: "It killed an estimated one-third of Europe's population.", evidence: [0] },
      { statement: "The Spanish Flu infected about 500 million people.", isTrue: true, explanation: "The passage states approximately 500 million people were infected.", evidence: [0] },
      { statement: "Pandemics have sometimes led to social reform.", isTrue: true, explanation: "Historians note pandemics have acted as catalysts for social reform.", evidence: [0] }
    ],
    questions: [
      { question: "What economic change resulted from the Black Death?", choices: ["Prices went up", "Surviving workers received higher wages", "Trade stopped completely"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "How did COVID-19 change work culture?", choices: ["Everyone stopped working", "It accelerated remote work adoption", "Offices became more popular"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'a12',
    title: "Deep Sea Exploration",
    level: 'advanced',
    text: "Despite remarkable advances in technology, more than 80 percent of the world's oceans remain unexplored. The deepest point on Earth, the Mariana Trench in the Pacific Ocean, reaches a depth of approximately 11,000 meters. The extreme pressure at such depths, which is more than 1,000 times the atmospheric pressure at sea level, makes exploration extraordinarily challenging. Nevertheless, expeditions using specially designed submersibles have discovered bizarre and previously unknown life forms, including organisms that thrive without sunlight by drawing energy from chemical reactions near hydrothermal vents. These discoveries have led scientists to speculate that similar life forms might exist in the subsurface oceans of Jupiter's moon Europa.",
    trueFalse: [
      { statement: "Less than 50 percent of the ocean remains unexplored.", isTrue: false, explanation: "More than 80 percent remains unexplored.", evidence: [0] },
      { statement: "The Mariana Trench is about 11,000 meters deep.", isTrue: true, explanation: "The passage states it reaches approximately 11,000 meters.", evidence: [0] },
      { statement: "All deep-sea organisms need sunlight to survive.", isTrue: false, explanation: "Some organisms thrive without sunlight near hydrothermal vents.", evidence: [0] }
    ],
    questions: [
      { question: "Where is the deepest point on Earth?", choices: ["The Atlantic Ocean", "The Mariana Trench", "The Arctic Ocean"], correctIndex: 1, type: 'where', evidence: [0] },
      { question: "Why do scientists think Europa might have life?", choices: ["It has a warm climate", "Similar organisms exist near hydrothermal vents on Earth", "Europa has been explored already"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'a13',
    title: "The Paradox of Choice",
    level: 'advanced',
    text: "Psychologist Barry Schwartz introduced the concept of the 'paradox of choice' in his influential 2004 book. He argued that while modern consumers in developed countries enjoy an unprecedented number of options, this abundance of choice does not necessarily lead to greater satisfaction. In fact, having too many options can cause decision paralysis, increased anxiety, and regret over the choices that were not made. An experiment at a supermarket demonstrated this effect: when shoppers were offered 24 varieties of jam, only 3 percent made a purchase, whereas when only 6 varieties were displayed, 30 percent bought a jar. Schwartz suggests that setting personal standards and accepting 'good enough' rather than seeking the absolute best can lead to greater happiness.",
    trueFalse: [
      { statement: "The paradox of choice was introduced in 1994.", isTrue: false, explanation: "It was introduced in 2004.", evidence: [0] },
      { statement: "More options always lead to greater satisfaction.", isTrue: false, explanation: "The passage argues that too many options can reduce satisfaction.", evidence: [0] },
      { statement: "Fewer jam varieties led to more purchases in the experiment.", isTrue: true, explanation: "With 6 varieties, 30 percent bought a jar versus 3 percent with 24.", evidence: [0] }
    ],
    questions: [
      { question: "What percentage of people bought jam when 24 varieties were offered?", choices: ["3 percent", "10 percent", "30 percent"], correctIndex: 0, type: 'how', evidence: [0] },
      { question: "What does Schwartz recommend for greater happiness?", choices: ["Always choose the best option", "Accept 'good enough' choices", "Avoid making choices entirely"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a14',
    title: "Renewable Energy Revolution",
    level: 'advanced',
    text: "The global transition from fossil fuels to renewable energy sources has accelerated dramatically in recent years. Solar power, in particular, has become increasingly affordable, with the cost of solar panels dropping by approximately 90 percent over the past decade. Wind energy is also expanding rapidly, especially in countries like Denmark, where wind turbines now generate nearly 50 percent of the nation's electricity. However, the intermittent nature of these energy sources presents challenges for grid stability, as the sun does not always shine and the wind does not always blow. To address this issue, researchers are developing advanced battery storage systems and exploring hydrogen fuel as a means of storing excess energy for use during periods of low production.",
    trueFalse: [
      { statement: "Solar panel costs have dropped by about 50 percent.", isTrue: false, explanation: "Costs have dropped by approximately 90 percent.", evidence: [0] },
      { statement: "Denmark generates nearly 50 percent of its electricity from wind.", isTrue: true, explanation: "The passage states wind turbines generate nearly 50 percent.", evidence: [0] },
      { statement: "Renewable energy sources produce power consistently at all times.", isTrue: false, explanation: "They are intermittent; the sun and wind are not always available.", evidence: [0] }
    ],
    questions: [
      { question: "What challenge do renewable energy sources present?", choices: ["They are too expensive", "Their intermittent nature affects grid stability", "They produce too much pollution"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "How are researchers addressing the storage problem?", choices: ["Building more power plants", "Developing battery systems and hydrogen fuel", "Reducing electricity use"], correctIndex: 1, type: 'how', evidence: [0] }
    ]
  },
  {
    id: 'a15',
    title: "The Science of Sleep",
    level: 'advanced',
    text: "Sleep scientists have established that the average adult requires seven to nine hours of sleep per night for optimal health, yet studies show that nearly one-third of adults in industrialized nations regularly fail to meet this recommendation. Chronic sleep deprivation has been linked to a wide range of health problems, including obesity, diabetes, cardiovascular disease, and weakened immune function. During sleep, the brain undergoes a critical cleaning process in which cerebrospinal fluid flows through neural tissue, removing toxic waste products that accumulate during waking hours. This process, discovered in 2013 and named the glymphatic system, may explain why prolonged sleep deprivation is associated with an increased risk of developing Alzheimer's disease.",
    trueFalse: [
      { statement: "Adults need five to six hours of sleep for optimal health.", isTrue: false, explanation: "They need seven to nine hours.", evidence: [0] },
      { statement: "The glymphatic system was discovered in 2013.", isTrue: true, explanation: "The passage states it was discovered in 2013.", evidence: [0] },
      { statement: "During sleep, the brain removes toxic waste products.", isTrue: true, explanation: "Cerebrospinal fluid removes toxic waste during sleep.", evidence: [0] }
    ],
    questions: [
      { question: "What fraction of adults in industrialized nations are sleep-deprived?", choices: ["One-quarter", "One-third", "One-half"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "Why might sleep deprivation increase Alzheimer's risk?", choices: ["It causes headaches", "The brain cannot remove toxic waste products properly", "It makes people forget things"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'a16',
    title: "Urban Farming Movement",
    level: 'advanced',
    text: "As urban populations continue to grow worldwide, cities are increasingly turning to innovative farming methods to supplement their food supply. Vertical farming, which involves growing crops in stacked layers inside controlled environments, uses up to 95 percent less water than traditional agriculture and can produce food year-round regardless of weather conditions. Singapore, one of the most densely populated countries in the world, has become a leader in this field, with over 30 vertical farms operating within the city-state. Critics, however, point out that vertical farming requires significant amounts of electricity for lighting and climate control, and the initial investment costs can be prohibitively expensive for developing countries.",
    trueFalse: [
      { statement: "Vertical farming uses more water than traditional agriculture.", isTrue: false, explanation: "It uses up to 95 percent less water.", evidence: [0] },
      { statement: "Singapore has over 30 vertical farms.", isTrue: true, explanation: "The passage states over 30 vertical farms operate in Singapore.", evidence: [0] },
      { statement: "Vertical farming has no drawbacks.", isTrue: false, explanation: "It requires significant electricity and high initial investment.", evidence: [0] }
    ],
    questions: [
      { question: "What is vertical farming?", choices: ["Farming on hillsides", "Growing crops in stacked layers inside controlled environments", "Growing very tall plants"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "Why might vertical farming be difficult for developing countries?", choices: ["They have too much farmland", "The initial investment costs are prohibitively expensive", "They do not need more food"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  },
  {
    id: 'a17',
    title: "The Digital Divide in Education",
    level: 'advanced',
    text: "The rapid shift to online learning during the global pandemic exposed a significant digital divide in education systems around the world. While students in wealthy urban areas generally had access to high-speed internet and personal devices, many children in rural and low-income communities lacked the basic technology needed to attend virtual classes. UNESCO estimated that approximately 1.6 billion students were affected by school closures, and roughly half of them had no access to a computer at home. This inequality threatens to widen the gap in educational outcomes between privileged and disadvantaged communities. Governments and NGOs have since launched programs to distribute devices and expand internet infrastructure, but experts warn that addressing the digital divide requires more than just providing hardware.",
    trueFalse: [
      { statement: "All students had equal access to online learning during the pandemic.", isTrue: false, explanation: "There was a significant digital divide between wealthy and low-income areas.", evidence: [0] },
      { statement: "About 1.6 billion students were affected by school closures.", isTrue: true, explanation: "UNESCO estimated approximately 1.6 billion students were affected.", evidence: [0] },
      { statement: "Providing hardware alone is enough to solve the digital divide.", isTrue: false, explanation: "Experts warn that more than just hardware is needed.", evidence: [0] }
    ],
    questions: [
      { question: "What percentage of affected students had no computer at home?", choices: ["About 25 percent", "About 50 percent", "About 75 percent"], correctIndex: 1, type: 'how', evidence: [0] },
      { question: "What have governments done to address the digital divide?", choices: ["Closed all schools permanently", "Distributed devices and expanded internet infrastructure", "Eliminated online learning"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a18',
    title: "The Placebo Effect",
    level: 'advanced',
    text: "The placebo effect, in which patients experience real improvements in their condition after receiving a treatment with no active ingredients, has puzzled scientists for centuries. Recent research using brain imaging has shown that placebos can trigger the release of endorphins and dopamine, the same chemicals produced by actual painkillers. In some clinical trials, placebos have proven to be nearly as effective as real medications for treating conditions such as chronic pain, depression, and irritable bowel syndrome. Remarkably, studies have demonstrated that the placebo effect can work even when patients know they are receiving a placebo, a phenomenon known as the open-label placebo effect. These findings have led some researchers to advocate for incorporating placebo treatments into standard medical practice.",
    trueFalse: [
      { statement: "Placebos contain active medical ingredients.", isTrue: false, explanation: "Placebos have no active ingredients.", evidence: [0] },
      { statement: "Placebos can trigger the release of endorphins.", isTrue: true, explanation: "Brain imaging shows placebos can trigger endorphin and dopamine release.", evidence: [0] },
      { statement: "The placebo effect only works when patients do not know they are taking a placebo.", isTrue: false, explanation: "The open-label placebo effect works even when patients know.", evidence: [0] }
    ],
    questions: [
      { question: "What is the open-label placebo effect?", choices: ["When placebos stop working", "When patients improve despite knowing they receive a placebo", "When doctors hide the treatment"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "For which conditions have placebos been nearly as effective as real medication?", choices: ["Broken bones and infections", "Chronic pain, depression, and irritable bowel syndrome", "Cancer and heart disease"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a19',
    title: "Migration Patterns and Globalization",
    level: 'advanced',
    text: "International migration has increased significantly over the past half-century, with the United Nations reporting that the number of international migrants reached 281 million in 2020, representing 3.6 percent of the global population. Economic factors remain the primary driver, as people move from lower-income to higher-income countries in search of better employment opportunities. However, climate change is emerging as a major new force behind migration, with the World Bank estimating that 216 million people could be displaced by environmental factors by 2050. Host countries often benefit from migrant labor and cultural diversity, but tensions can arise when local communities perceive competition for jobs and public services. Successful integration requires comprehensive policies that address both economic participation and social inclusion.",
    trueFalse: [
      { statement: "There were 281 million international migrants in 2020.", isTrue: true, explanation: "The UN reported this figure.", evidence: [0] },
      { statement: "Climate change plays no role in modern migration.", isTrue: false, explanation: "Climate change is emerging as a major new force behind migration.", evidence: [0] },
      { statement: "The World Bank estimates 216 million could be displaced by environmental factors by 2050.", isTrue: true, explanation: "The passage directly states this estimate.", evidence: [0] }
    ],
    questions: [
      { question: "What is the primary driver of international migration?", choices: ["Political reasons", "Economic factors", "Educational opportunities"], correctIndex: 1, type: 'what', evidence: [0] },
      { question: "What does successful integration of migrants require?", choices: ["Stricter border controls", "Comprehensive policies for economic participation and social inclusion", "Reducing the number of migrants"], correctIndex: 1, type: 'what', evidence: [0] }
    ]
  },
  {
    id: 'a20',
    title: "The Future of Electric Vehicles",
    level: 'advanced',
    text: "The electric vehicle market has experienced explosive growth, with global sales increasing from 2 million in 2018 to over 10 million in 2022. Norway leads the world in EV adoption, where electric cars account for more than 80 percent of new vehicle sales. The primary environmental advantage of EVs is that they produce zero direct emissions, which significantly reduces air pollution in urban areas. However, the production of lithium-ion batteries requires mining rare earth minerals, a process that itself causes environmental damage. Additionally, the electricity used to charge EVs is only as clean as the power grid that supplies it. Countries that rely heavily on coal-fired power plants may see limited environmental benefits from widespread EV adoption unless they simultaneously transition to cleaner energy sources.",
    trueFalse: [
      { statement: "Global EV sales reached 10 million in 2022.", isTrue: true, explanation: "The passage states sales increased to over 10 million in 2022.", evidence: [0] },
      { statement: "EVs produce significant direct emissions.", isTrue: false, explanation: "EVs produce zero direct emissions.", evidence: [0] },
      { statement: "Battery production has no environmental impact.", isTrue: false, explanation: "Mining rare earth minerals for batteries causes environmental damage.", evidence: [0] }
    ],
    questions: [
      { question: "What percentage of new car sales in Norway are electric?", choices: ["Over 50 percent", "Over 60 percent", "Over 80 percent"], correctIndex: 2, type: 'how', evidence: [0] },
      { question: "Why might EVs have limited environmental benefits in some countries?", choices: ["They are too slow", "The power grid may rely on coal-fired plants", "People do not like them"], correctIndex: 1, type: 'why', evidence: [0] }
    ]
  }
];
