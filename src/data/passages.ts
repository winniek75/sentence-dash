export interface Passage {
  id: string;
  title: string;
  level: 'easy' | 'medium' | 'hard';
  text: string;
  textJa?: string;
  trueFalse: TrueFalseItem[];
  questions: ReadingQuestion[];
}

export interface TrueFalseItem {
  statement: string;
  isTrue: boolean;
  explanation: string;
}

export interface ReadingQuestion {
  question: string;
  choices: string[];
  correctIndex: number;
  type: 'who' | 'what' | 'where' | 'when' | 'why' | 'how';
}

export const passages: Passage[] = [
  // ===== EASY (8 passages) =====
  {
    id: 'e1',
    title: "Tom's Morning",
    level: 'easy',
    text: "Tom wakes up at 7:00 every morning. He eats toast and drinks orange juice for breakfast. Then he walks to school with his friend Lucy. It takes about 15 minutes to walk there.",
    trueFalse: [
      { statement: "Tom wakes up at 7:00.", isTrue: true, explanation: "The passage says he wakes up at 7:00." },
      { statement: "Tom drinks milk for breakfast.", isTrue: false, explanation: "He drinks orange juice, not milk." },
      { statement: "Tom goes to school by bus.", isTrue: false, explanation: "He walks to school." }
    ],
    questions: [
      { question: "Who does Tom walk to school with?", choices: ["Lucy", "His mother", "His brother"], correctIndex: 0, type: 'who' },
      { question: "How long does it take to walk to school?", choices: ["10 minutes", "15 minutes", "30 minutes"], correctIndex: 1, type: 'how' }
    ]
  },
  {
    id: 'e2',
    title: "My Pet Dog",
    level: 'easy',
    text: "I have a dog named Max. He is brown and white. Max likes to play in the park every afternoon. He can catch a ball very well. Max is three years old.",
    trueFalse: [
      { statement: "The dog's name is Max.", isTrue: true, explanation: "The passage says the dog is named Max." },
      { statement: "Max is all black.", isTrue: false, explanation: "Max is brown and white." },
      { statement: "Max likes to play in the park.", isTrue: true, explanation: "The passage says he plays in the park every afternoon." }
    ],
    questions: [
      { question: "Where does Max like to play?", choices: ["At home", "In the park", "At school"], correctIndex: 1, type: 'where' },
      { question: "How old is Max?", choices: ["Two years old", "Three years old", "Five years old"], correctIndex: 1, type: 'how' }
    ]
  },
  {
    id: 'e3',
    title: "Lunch Time",
    level: 'easy',
    text: "Emma eats lunch at 12:30. She has a sandwich and an apple. She also drinks water. Emma eats lunch with her classmate Yuki in the school cafeteria.",
    trueFalse: [
      { statement: "Emma eats lunch at 12:30.", isTrue: true, explanation: "The passage says she eats at 12:30." },
      { statement: "Emma has pizza for lunch.", isTrue: false, explanation: "She has a sandwich and an apple." },
      { statement: "Emma eats alone.", isTrue: false, explanation: "She eats with her classmate Yuki." }
    ],
    questions: [
      { question: "What does Emma drink?", choices: ["Juice", "Milk", "Water"], correctIndex: 2, type: 'what' },
      { question: "Where does Emma eat lunch?", choices: ["In her classroom", "In the school cafeteria", "At home"], correctIndex: 1, type: 'where' }
    ]
  },
  {
    id: 'e4',
    title: "The Weather Today",
    level: 'easy',
    text: "Today is sunny and warm. The temperature is 25 degrees. Many children are playing outside. Some are riding bikes and some are playing soccer. It is a beautiful spring day.",
    trueFalse: [
      { statement: "Today is rainy.", isTrue: false, explanation: "Today is sunny and warm." },
      { statement: "The temperature is 25 degrees.", isTrue: true, explanation: "The passage says it is 25 degrees." },
      { statement: "Children are playing outside.", isTrue: true, explanation: "Many children are playing outside." }
    ],
    questions: [
      { question: "What season is it?", choices: ["Summer", "Spring", "Winter"], correctIndex: 1, type: 'what' },
      { question: "What are some children doing?", choices: ["Swimming", "Riding bikes", "Reading books"], correctIndex: 1, type: 'what' }
    ]
  },
  {
    id: 'e5',
    title: "My Classroom",
    level: 'easy',
    text: "My classroom has 30 desks. There is a big whiteboard at the front. Our teacher, Mr. Tanaka, teaches us math and science. There are many colorful posters on the walls.",
    trueFalse: [
      { statement: "The classroom has 30 desks.", isTrue: true, explanation: "The passage says there are 30 desks." },
      { statement: "The teacher's name is Mr. Suzuki.", isTrue: false, explanation: "The teacher's name is Mr. Tanaka." },
      { statement: "There is a blackboard at the front.", isTrue: false, explanation: "There is a whiteboard, not a blackboard." }
    ],
    questions: [
      { question: "Who is the teacher?", choices: ["Mr. Suzuki", "Mr. Tanaka", "Ms. Sato"], correctIndex: 1, type: 'who' },
      { question: "What subjects does the teacher teach?", choices: ["English and art", "Math and science", "Music and PE"], correctIndex: 1, type: 'what' }
    ]
  },
  {
    id: 'e6',
    title: "Shopping with Mom",
    level: 'easy',
    text: "Kenji goes shopping with his mom every Saturday. They go to the supermarket near their house. They buy vegetables, fruit, and bread. Kenji always chooses his favorite snack, chocolate cookies.",
    trueFalse: [
      { statement: "Kenji goes shopping on Sundays.", isTrue: false, explanation: "He goes shopping on Saturdays." },
      { statement: "They go to the supermarket.", isTrue: true, explanation: "The passage says they go to the supermarket." },
      { statement: "Kenji's favorite snack is chocolate cookies.", isTrue: true, explanation: "The passage says he always chooses chocolate cookies." }
    ],
    questions: [
      { question: "When does Kenji go shopping?", choices: ["Every Sunday", "Every Saturday", "Every Friday"], correctIndex: 1, type: 'when' },
      { question: "Who does Kenji go shopping with?", choices: ["His dad", "His friend", "His mom"], correctIndex: 2, type: 'who' }
    ]
  },
  {
    id: 'e7',
    title: "Bedtime",
    level: 'easy',
    text: "Mika goes to bed at 9:00 every night. Before sleeping, she reads a book for 20 minutes. She likes fairy tales the most. Her favorite book is about a princess who lives in a forest.",
    trueFalse: [
      { statement: "Mika goes to bed at 9:00.", isTrue: true, explanation: "The passage says she goes to bed at 9:00." },
      { statement: "Mika watches TV before sleeping.", isTrue: false, explanation: "She reads a book before sleeping." },
      { statement: "Mika reads for 20 minutes.", isTrue: true, explanation: "The passage says she reads for 20 minutes." }
    ],
    questions: [
      { question: "What kind of books does Mika like?", choices: ["Science books", "Fairy tales", "Comic books"], correctIndex: 1, type: 'what' },
      { question: "Where does the princess live in her favorite book?", choices: ["In a castle", "In a forest", "By the sea"], correctIndex: 1, type: 'where' }
    ]
  },
  {
    id: 'e8',
    title: "The School Library",
    level: 'easy',
    text: "Our school library is on the second floor. It has over 5,000 books. The library is open from 8:00 to 4:00. Students can borrow three books at a time. The librarian, Ms. Ito, is very kind.",
    trueFalse: [
      { statement: "The library is on the first floor.", isTrue: false, explanation: "It is on the second floor." },
      { statement: "Students can borrow three books.", isTrue: true, explanation: "Students can borrow three books at a time." },
      { statement: "The library closes at 4:00.", isTrue: true, explanation: "The library is open from 8:00 to 4:00." }
    ],
    questions: [
      { question: "How many books does the library have?", choices: ["Over 3,000", "Over 5,000", "Over 10,000"], correctIndex: 1, type: 'how' },
      { question: "Who is the librarian?", choices: ["Ms. Yamada", "Ms. Ito", "Mr. Tanaka"], correctIndex: 1, type: 'who' }
    ]
  },

  // ===== MEDIUM (8 passages) =====
  {
    id: 'm1',
    title: "A Letter from Australia",
    level: 'medium',
    text: "Dear Saki, I am having a great time in Sydney, Australia. Yesterday, I visited the famous Opera House. The weather here is very hot because it is summer in Australia now. I also saw kangaroos at a wildlife park! I will come back to Japan next Monday.",
    trueFalse: [
      { statement: "The writer is in Melbourne.", isTrue: false, explanation: "The writer is in Sydney." },
      { statement: "It is summer in Australia right now.", isTrue: true, explanation: "The passage says it is summer in Australia." },
      { statement: "The writer saw kangaroos.", isTrue: true, explanation: "The writer saw kangaroos at a wildlife park." }
    ],
    questions: [
      { question: "What famous place did the writer visit?", choices: ["The Great Wall", "The Opera House", "The Eiffel Tower"], correctIndex: 1, type: 'what' },
      { question: "When will the writer return to Japan?", choices: ["Next Friday", "Next Monday", "Next Wednesday"], correctIndex: 1, type: 'when' }
    ]
  },
  {
    id: 'm2',
    title: "The Science Fair",
    level: 'medium',
    text: "Last week, our school had a science fair. Takeshi and his partner Hana made a volcano model. They used baking soda and vinegar to make it erupt. Their project won second place. The first-place winner made a solar-powered car.",
    trueFalse: [
      { statement: "Takeshi worked alone on his project.", isTrue: false, explanation: "He worked with his partner Hana." },
      { statement: "They made a volcano model.", isTrue: true, explanation: "Takeshi and Hana made a volcano model." },
      { statement: "Their project won first place.", isTrue: false, explanation: "Their project won second place." }
    ],
    questions: [
      { question: "What did Takeshi and Hana use to make the volcano erupt?", choices: ["Water and soap", "Baking soda and vinegar", "Paint and glue"], correctIndex: 1, type: 'what' },
      { question: "What was the first-place project?", choices: ["A robot", "A solar-powered car", "A weather station"], correctIndex: 1, type: 'what' }
    ]
  },
  {
    id: 'm3',
    title: "Cooking with Grandma",
    level: 'medium',
    text: "Every Sunday, Yui visits her grandmother and they cook together. Last Sunday, they made curry rice. First, they cut the vegetables: potatoes, carrots, and onions. Then they cooked everything in a big pot for 30 minutes. The curry was delicious!",
    trueFalse: [
      { statement: "Yui cooks with her grandmother on Saturdays.", isTrue: false, explanation: "She visits every Sunday." },
      { statement: "They made curry rice last Sunday.", isTrue: true, explanation: "The passage says they made curry rice." },
      { statement: "They cooked for 30 minutes.", isTrue: true, explanation: "They cooked everything for 30 minutes." }
    ],
    questions: [
      { question: "Who does Yui cook with?", choices: ["Her mother", "Her grandmother", "Her sister"], correctIndex: 1, type: 'who' },
      { question: "How long did they cook the curry?", choices: ["20 minutes", "30 minutes", "45 minutes"], correctIndex: 1, type: 'how' }
    ]
  },
  {
    id: 'm4',
    title: "Soccer Practice",
    level: 'medium',
    text: "Riku has soccer practice every Tuesday and Thursday after school. His team has 15 players. Their coach, Mr. Honda, was a professional soccer player before. They are preparing for a big tournament next month. Riku plays as a goalkeeper.",
    trueFalse: [
      { statement: "Riku practices soccer on Monday and Wednesday.", isTrue: false, explanation: "He practices on Tuesday and Thursday." },
      { statement: "The team has 15 players.", isTrue: true, explanation: "The passage says the team has 15 players." },
      { statement: "Mr. Honda was a professional player.", isTrue: true, explanation: "The coach was a professional soccer player before." }
    ],
    questions: [
      { question: "What position does Riku play?", choices: ["Forward", "Midfielder", "Goalkeeper"], correctIndex: 2, type: 'what' },
      { question: "When is the tournament?", choices: ["This week", "Next month", "Next year"], correctIndex: 1, type: 'when' }
    ]
  },
  {
    id: 'm5',
    title: "The School Trip",
    level: 'medium',
    text: "Next Friday, Class 3-B will go on a school trip to Kyoto. They will visit two temples and a castle. The bus leaves at 8:00 in the morning and they will return by 5:00 in the evening. Students need to bring their own lunch and a water bottle.",
    trueFalse: [
      { statement: "The trip is on Thursday.", isTrue: false, explanation: "The trip is on Friday." },
      { statement: "They will visit a castle.", isTrue: true, explanation: "They will visit two temples and a castle." },
      { statement: "The school will provide lunch.", isTrue: false, explanation: "Students need to bring their own lunch." }
    ],
    questions: [
      { question: "Where is the school trip going?", choices: ["Tokyo", "Osaka", "Kyoto"], correctIndex: 2, type: 'where' },
      { question: "What time does the bus leave?", choices: ["7:00", "8:00", "9:00"], correctIndex: 1, type: 'when' }
    ]
  },
  {
    id: 'm6',
    title: "A Rainy Day Adventure",
    level: 'medium',
    text: "It rained all day yesterday, so Aoi and her brother stayed home. They decided to build a blanket fort in the living room. They used chairs, blankets, and pillows. Inside the fort, they read comic books and ate popcorn. It was one of the best rainy days ever!",
    trueFalse: [
      { statement: "It was sunny yesterday.", isTrue: false, explanation: "It rained all day yesterday." },
      { statement: "They built a fort in the living room.", isTrue: true, explanation: "They built a blanket fort in the living room." },
      { statement: "They ate chocolate inside the fort.", isTrue: false, explanation: "They ate popcorn, not chocolate." }
    ],
    questions: [
      { question: "Why did Aoi stay home?", choices: ["She was sick", "It rained all day", "She had no school"], correctIndex: 1, type: 'why' },
      { question: "What did they do inside the fort?", choices: ["Watched TV", "Read comic books", "Played video games"], correctIndex: 1, type: 'what' }
    ]
  },
  {
    id: 'm7',
    title: "The New Student",
    level: 'medium',
    text: "A new student named Leo joined our class today. He is from Brazil and he speaks Portuguese and English. Leo likes basketball and drawing. During lunch, he showed us pictures of his hometown, Rio de Janeiro. Everyone wants to be his friend.",
    trueFalse: [
      { statement: "Leo is from Argentina.", isTrue: false, explanation: "Leo is from Brazil." },
      { statement: "Leo speaks two languages.", isTrue: true, explanation: "He speaks Portuguese and English." },
      { statement: "Leo likes basketball.", isTrue: true, explanation: "The passage says Leo likes basketball and drawing." }
    ],
    questions: [
      { question: "Where is Leo from?", choices: ["Mexico", "Brazil", "Spain"], correctIndex: 1, type: 'where' },
      { question: "What did Leo show during lunch?", choices: ["His toys", "Pictures of his hometown", "A magic trick"], correctIndex: 1, type: 'what' }
    ]
  },
  {
    id: 'm8',
    title: "Summer Festival",
    level: 'medium',
    text: "The summer festival in our town is on August 15th every year. There are many food stalls selling yakisoba, takoyaki, and shaved ice. People wear yukata and watch fireworks at night. The fireworks show starts at 8:00 and lasts for one hour. It is the biggest event of the summer.",
    trueFalse: [
      { statement: "The festival is in July.", isTrue: false, explanation: "The festival is on August 15th." },
      { statement: "People wear yukata at the festival.", isTrue: true, explanation: "The passage says people wear yukata." },
      { statement: "The fireworks last for one hour.", isTrue: true, explanation: "The fireworks show lasts for one hour." }
    ],
    questions: [
      { question: "When do the fireworks start?", choices: ["7:00", "8:00", "9:00"], correctIndex: 1, type: 'when' },
      { question: "What food is NOT mentioned?", choices: ["Yakisoba", "Takoyaki", "Cotton candy"], correctIndex: 2, type: 'what' }
    ]
  },

  // ===== HARD (8 passages) =====
  {
    id: 'h1',
    title: "The Lost Cat",
    level: 'hard',
    text: "Yesterday afternoon, Mrs. Yamamoto found a small gray cat in her garden. The cat was wearing a blue collar with a tag that said 'Mochi.' She put up posters around the neighborhood and posted on social media. By evening, a boy named Shota came to pick up his cat. He said Mochi had been missing for three days.",
    trueFalse: [
      { statement: "The cat was found in the morning.", isTrue: false, explanation: "The cat was found in the afternoon." },
      { statement: "The cat's name was Mochi.", isTrue: true, explanation: "The collar tag said 'Mochi.'" },
      { statement: "The cat had been missing for a week.", isTrue: false, explanation: "Mochi had been missing for three days." }
    ],
    questions: [
      { question: "How did Mrs. Yamamoto try to find the owner?", choices: ["She called the police", "She put up posters and posted on social media", "She asked her neighbors one by one"], correctIndex: 1, type: 'how' },
      { question: "Who is Mochi's owner?", choices: ["Mrs. Yamamoto", "A boy named Shota", "A girl named Yuki"], correctIndex: 1, type: 'who' }
    ]
  },
  {
    id: 'h2',
    title: "Recycling Day",
    level: 'hard',
    text: "In Japan, recycling rules are very strict. In Haruki's city, they separate trash into five categories: burnable, non-burnable, plastic, paper, and cans. Burnable trash is collected on Mondays and Thursdays. If you put your trash out on the wrong day, it will not be collected. Haruki thinks this system is good for the environment.",
    trueFalse: [
      { statement: "Trash is separated into three categories.", isTrue: false, explanation: "Trash is separated into five categories." },
      { statement: "Burnable trash is collected on Mondays and Thursdays.", isTrue: true, explanation: "The passage says burnable trash is collected on those days." },
      { statement: "Haruki thinks recycling is good for the environment.", isTrue: true, explanation: "Haruki thinks this system is good for the environment." }
    ],
    questions: [
      { question: "What happens if you put trash out on the wrong day?", choices: ["You get a fine", "It will not be collected", "Your neighbors complain"], correctIndex: 1, type: 'what' },
      { question: "How many categories is trash separated into?", choices: ["Three", "Four", "Five"], correctIndex: 2, type: 'how' }
    ]
  },
  {
    id: 'h3',
    title: "The Dolphin Show",
    level: 'hard',
    text: "Last summer, the Nakamura family went to an aquarium in Okinawa. They watched an amazing dolphin show. Four dolphins jumped through hoops and splashed water on the audience. The youngest daughter, Mei, was scared at first but then she laughed and wanted to see it again. The family also saw a giant whale shark in the main tank.",
    trueFalse: [
      { statement: "The aquarium was in Tokyo.", isTrue: false, explanation: "The aquarium was in Okinawa." },
      { statement: "Four dolphins performed in the show.", isTrue: true, explanation: "Four dolphins jumped through hoops." },
      { statement: "Mei enjoyed the show right from the start.", isTrue: false, explanation: "Mei was scared at first." }
    ],
    questions: [
      { question: "Why was Mei scared at first?", choices: ["The dolphins were too big", "The dolphins splashed water", "She does not like animals"], correctIndex: 1, type: 'why' },
      { question: "What did the family see in the main tank?", choices: ["A giant octopus", "A whale shark", "Sea turtles"], correctIndex: 1, type: 'what' }
    ]
  },
  {
    id: 'h4',
    title: "The School Newspaper",
    level: 'hard',
    text: "Ayumi is the editor of the school newspaper. Every month, she leads a team of eight students to write articles. This month's issue is about the school's 50th anniversary. Ayumi interviewed the principal, who has worked at the school for 20 years. The newspaper will be published next Wednesday and given to all 600 students.",
    trueFalse: [
      { statement: "Ayumi works on the newspaper alone.", isTrue: false, explanation: "She leads a team of eight students." },
      { statement: "The school is celebrating its 50th anniversary.", isTrue: true, explanation: "The issue is about the school's 50th anniversary." },
      { statement: "The newspaper comes out every week.", isTrue: false, explanation: "The newspaper comes out every month." }
    ],
    questions: [
      { question: "How long has the principal worked at the school?", choices: ["10 years", "20 years", "50 years"], correctIndex: 1, type: 'how' },
      { question: "When will the newspaper be published?", choices: ["Next Monday", "Next Wednesday", "Next Friday"], correctIndex: 1, type: 'when' }
    ]
  },
  {
    id: 'h5',
    title: "The Exchange Student",
    level: 'hard',
    text: "Next April, Rina will go to Canada as an exchange student for six months. She will stay with a host family in Vancouver. Rina is excited but also nervous because her English is not perfect yet. She has been studying English every day for two years to prepare. Her host family has a daughter the same age as Rina.",
    trueFalse: [
      { statement: "Rina will go to America.", isTrue: false, explanation: "Rina will go to Canada." },
      { statement: "She will stay for six months.", isTrue: true, explanation: "She will go for six months." },
      { statement: "Rina has been studying English for two years.", isTrue: true, explanation: "She has been studying every day for two years." }
    ],
    questions: [
      { question: "Where in Canada will Rina stay?", choices: ["Toronto", "Vancouver", "Montreal"], correctIndex: 1, type: 'where' },
      { question: "Why is Rina nervous?", choices: ["She doesn't like Canada", "Her English is not perfect yet", "She will miss school"], correctIndex: 1, type: 'why' }
    ]
  },
  {
    id: 'h6',
    title: "The Marathon Runner",
    level: 'hard',
    text: "Mr. Kato, a 45-year-old teacher, ran his first marathon last November. He trained for eight months, running 10 kilometers every morning before school. The marathon was held in Tokyo and had 30,000 runners. Mr. Kato finished in 4 hours and 15 minutes. He said it was the hardest but most rewarding thing he has ever done.",
    trueFalse: [
      { statement: "Mr. Kato is a student.", isTrue: false, explanation: "Mr. Kato is a teacher." },
      { statement: "He trained for eight months.", isTrue: true, explanation: "He trained for eight months." },
      { statement: "The marathon had 30,000 runners.", isTrue: true, explanation: "The passage says there were 30,000 runners." }
    ],
    questions: [
      { question: "How long did it take Mr. Kato to finish?", choices: ["3 hours 30 minutes", "4 hours 15 minutes", "5 hours"], correctIndex: 1, type: 'how' },
      { question: "Where was the marathon held?", choices: ["Osaka", "Tokyo", "Kyoto"], correctIndex: 1, type: 'where' }
    ]
  },
  {
    id: 'h7',
    title: "A Special Announcement",
    level: 'hard',
    text: "Attention all students! Starting next month, our school will have a new English conversation class every Wednesday after school. The class will be taught by Ms. Green, a teacher from New Zealand. The class is free, but students must sign up by this Friday. There are only 20 spots available, so please sign up early.",
    trueFalse: [
      { statement: "The new class starts this week.", isTrue: false, explanation: "The class starts next month." },
      { statement: "Ms. Green is from Australia.", isTrue: false, explanation: "Ms. Green is from New Zealand." },
      { statement: "Students must sign up by Friday.", isTrue: true, explanation: "Students must sign up by this Friday." }
    ],
    questions: [
      { question: "How many spots are available?", choices: ["10", "20", "30"], correctIndex: 1, type: 'how' },
      { question: "When is the conversation class?", choices: ["Tuesday", "Wednesday", "Thursday"], correctIndex: 1, type: 'when' }
    ]
  },
  {
    id: 'h8',
    title: "The Camping Trip",
    level: 'hard',
    text: "Last weekend, the Suzuki family went camping near Mount Fuji. They arrived on Saturday morning and set up their tent near a river. That night, they made a campfire and cooked curry. On Sunday, they hiked to a waterfall that was 30 meters tall. The father said it was the most beautiful waterfall he had ever seen. They went home Sunday evening, tired but happy.",
    trueFalse: [
      { statement: "They camped near the ocean.", isTrue: false, explanation: "They camped near Mount Fuji, by a river." },
      { statement: "They cooked curry over a campfire.", isTrue: true, explanation: "They made a campfire and cooked curry." },
      { statement: "The waterfall was 30 meters tall.", isTrue: true, explanation: "The passage says the waterfall was 30 meters tall." }
    ],
    questions: [
      { question: "When did the family arrive at the campsite?", choices: ["Friday evening", "Saturday morning", "Sunday morning"], correctIndex: 1, type: 'when' },
      { question: "What did they do on Sunday?", choices: ["Went fishing", "Hiked to a waterfall", "Swam in the river"], correctIndex: 1, type: 'what' }
    ]
  }
];
