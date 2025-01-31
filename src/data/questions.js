const questions = [
    {
        "id": 1,
        "question": "What is the capital of India?",
        "options": ["Delhi", "Mumbai", "Kolkata", "Chennai"],
        "correctAnswer": "Delhi"
      },
      {
        "id": 2,
        "question": "Who is the current President of India?",
        "options": ["Ram Nath Kovind", "Pranab Mukherjee", "Narendra Modi", "Amit Shah"],
        "correctAnswer": "Ram Nath Kovind"
      },
      {
        "id": 3,
        "question": "What is the square root of 144?",
        "options": ["10", "12", "14", "16"],
        "correctAnswer": "12"
      },
      {
        "id": 4,
        "question": "What is the national currency of Japan?",
        "options": ["Yuan", "Yen", "Ringgit", "Won"],
        "correctAnswer": "Yen"
      },
      {
        "id": 5,
        "question": "Who developed the theory of relativity?",
        "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
        "correctAnswer": "Albert Einstein"
      },
      {
        "id": 6,
        "question": "Which gas is most abundant in the Earth's atmosphere?",
        "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        "correctAnswer": "Nitrogen"
      },
      {
        "id": 7,
        "question": "In which year did India gain independence?",
        "options": ["1947", "1950", "1960", "1945"],
        "correctAnswer": "1947"
      },
      {
        "id": 8,
        "question": "What is the smallest prime number?",
        "options": ["0", "1", "2", "3"],
        "correctAnswer": "2"
      },
      {
        "id": 9,
        "question": "Who is the author of the book 'The Alchemist'?",
        "options": ["Paulo Coelho", "J.K. Rowling", "Chetan Bhagat", "Dan Brown"],
        "correctAnswer": "Paulo Coelho"
      },
      {
        "id": 10,
        "question": "Which planet is known as the Red Planet?",
        "options": ["Mars", "Earth", "Jupiter", "Venus"],
        "correctAnswer": "Mars"
      },
    {
      "id": 11,
      "question": "What is the currency of the United Kingdom?",
      "options": ["Euro", "Pound", "Dollar", "Yen"],
      "correctAnswer": "Pound"
    },
    {
      "id": 12,
      "question": "Which is the largest country by area?",
      "options": ["United States", "China", "Russia", "Canada"],
      "correctAnswer": "Russia"
    },
    {
      "id": 13,
      "question": "Who is the first woman Prime Minister of India?",
      "options": ["Indira Gandhi", "Sarojini Naidu", "Pratibha Patil", "Sonia Gandhi"],
      "correctAnswer": "Indira Gandhi"
    },
    {
      "id": 14,
      "question": "Which of the following is the largest ocean?",
      "options": ["Atlantic Ocean", "Indian Ocean", "Southern Ocean", "Pacific Ocean"],
      "correctAnswer": "Pacific Ocean"
    },
    {
      "id": 15,
      "question": "What is the square of 25?",
      "options": ["100", "150", "225", "300"],
      "correctAnswer": "625"
    },
    {
      "id": 16,
      "question": "Which of the following is not a part of the Indian Constitution?",
      "options": ["Fundamental Rights", "Directive Principles", "State Policies", "Fundamental Duties"],
      "correctAnswer": "State Policies"
    },
    {
      "id": 17,
      "question": "Who is known as the Father of the Nation in India?",
      "options": ["Jawaharlal Nehru", "Mahatma Gandhi", "Sardar Patel", "Subhas Chandra Bose"],
      "correctAnswer": "Mahatma Gandhi"
    },
    {
      "id": 18,
      "question": "What is the boiling point of water?",
      "options": ["100°C", "90°C", "120°C", "80°C"],
      "correctAnswer": "100°C"
    },
    {
      "id": 19,
      "question": "Which planet is closest to the Sun?",
      "options": ["Mercury", "Venus", "Earth", "Mars"],
      "correctAnswer": "Mercury"
    },
    {
      "id": 20,
      "question": "Who wrote the novel '1984'?",
      "options": ["George Orwell", "Aldous Huxley", "J.K. Rowling", "William Shakespeare"],
      "correctAnswer": "George Orwell"
    },
    {
      "id": 21,
      "question": "Which is the longest river in India?",
      "options": ["Ganga", "Yamuna", "Godavari", "Mahanadi"],
      "correctAnswer": "Ganga"
    },
    {
      "id": 22,
      "question": "Which is the smallest state in India by area?",
      "options": ["Goa", "Kerala", "Sikkim", "Uttarakhand"],
      "correctAnswer": "Goa"
    },
    {
      "id": 23,
      "question": "Which animal is known as the King of the Jungle?",
      "options": ["Lion", "Tiger", "Elephant", "Bear"],
      "correctAnswer": "Lion"
    },
    {
      "id": 24,
      "question": "What is the chemical symbol for water?",
      "options": ["H2O", "CO2", "O2", "H2SO4"],
      "correctAnswer": "H2O"
    },
    {
      "id": 25,
      "question": "Which of these elements is the most abundant in the Earth's crust?",
      "options": ["Iron", "Oxygen", "Silicon", "Aluminum"],
      "correctAnswer": "Oxygen"
    },
    {
      "id": 26,
      "question": "What is the national flower of India?",
      "options": ["Rose", "Lotus", "Tulip", "Sunflower"],
      "correctAnswer": "Lotus"
    },
    {
      "id": 27,
      "question": "In which year did the Titanic sink?",
      "options": ["1912", "1920", "1905", "1899"],
      "correctAnswer": "1912"
    },
    {
      "id": 28,
      "question": "Which country is known as the Land of the Rising Sun?",
      "options": ["China", "India", "Japan", "South Korea"],
      "correctAnswer": "Japan"
    },
    {
      "id": 29,
      "question": "Which instrument is used to measure temperature?",
      "options": ["Thermometer", "Barometer", "Hydrometer", "Tachometer"],
      "correctAnswer": "Thermometer"
    },
    {
      "id": 30,
      "question": "Who invented the light bulb?",
      "options": ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Benjamin Franklin"],
      "correctAnswer": "Thomas Edison"
    },
    {
      "id": 31,
      "question": "What is the currency of the United States?",
      "options": ["Dollar", "Euro", "Pound", "Yen"],
      "correctAnswer": "Dollar"
    },
    {
      "id": 32,
      "question": "Which is the largest continent by area?",
      "options": ["Asia", "Africa", "North America", "Europe"],
      "correctAnswer": "Asia"
    },
    {
      "id": 33,
      "question": "What is the largest desert in the world?",
      "options": ["Sahara Desert", "Gobi Desert", "Karakum Desert", "Antarctic Desert"],
      "correctAnswer": "Antarctic Desert"
    },
    {
      "id": 34,
      "question": "Which is the tallest mountain in the world?",
      "options": ["K2", "Mount Everest", "Kangchenjunga", "Makalu"],
      "correctAnswer": "Mount Everest"
    },
    {
      "id": 35,
      "question": "Who is the author of 'To Kill a Mockingbird'?",
      "options": ["Harper Lee", "J.D. Salinger", "Ernest Hemingway", "Mark Twain"],
      "correctAnswer": "Harper Lee"
    },
    {
      "id": 36,
      "question": "What is the freezing point of water?",
      "options": ["0°C", "10°C", "20°C", "5°C"],
      "correctAnswer": "0°C"
    },
    {
      "id": 37,
      "question": "Which country is known as the 'Land of the Midnight Sun'?",
      "options": ["Sweden", "Norway", "Finland", "Denmark"],
      "correctAnswer": "Norway"
    },
    {
      "id": 38,
      "question": "Which gas is commonly used in balloons?",
      "options": ["Oxygen", "Hydrogen", "Helium", "Nitrogen"],
      "correctAnswer": "Helium"
    },
    {
      "id": 39,
      "question": "Who invented the telephone?",
      "options": ["Guglielmo Marconi", "Alexander Graham Bell", "Thomas Edison", "Nikola Tesla"],
      "correctAnswer": "Alexander Graham Bell"
    },
    {
      "id": 40,
      "question": "Which of the following is the largest organ in the human body?",
      "options": ["Liver", "Brain", "Heart", "Skin"],
      "correctAnswer": "Skin"
    },
    {
      "id": 41,
      "question": "Which continent is known as the Dark Continent?",
      "options": ["Asia", "Africa", "South America", "Australia"],
      "correctAnswer": "Africa"
    },
    {
      "id": 42,
      "question": "Which city is known as the 'Big Apple'?",
      "options": ["Los Angeles", "Chicago", "New York", "Boston"],
      "correctAnswer": "New York"
    },
    {
      "id": 43,
      "question": "Who is the author of 'Harry Potter' series?",
      "options": ["J.K. Rowling", "C.S. Lewis", "J.R.R. Tolkien", "J.D. Salinger"],
      "correctAnswer": "J.K. Rowling"
    },
    {
      "id": 44,
      "question": "Which is the longest mountain range in the world?",
      "options": ["Himalayas", "Andes", "Rockies", "Ural Mountains"],
      "correctAnswer": "Andes"
    },
    {
      "id": 45,
      "question": "Who was the first man to walk on the Moon?",
      "options": ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "Michael Collins"],
      "correctAnswer": "Neil Armstrong"
    },
    {
      "id": 46,
      "question": "Which city is famous for its Eiffel Tower?",
      "options": ["London", "Paris", "Rome", "Berlin"],
      "correctAnswer": "Paris"
    },
    {
      "id": 47,
      "question": "What is the smallest unit of matter?",
      "options": ["Atom", "Molecule", "Electron", "Neutron"],
      "correctAnswer": "Atom"
    },
    {
      "id": 48,
      "question": "Which country is known as the 'Land of the Pharaohs'?",
      "options": ["Egypt", "Greece", "Rome", "Turkey"],
      "correctAnswer": "Egypt"
    },
    {
      "id": 49,
      "question": "Which of the following is not a programming language?",
      "options": ["Python", "Java", "HTML", "C++"],
      "correctAnswer": "HTML"
    },
    {
      "id": 50,
      "question": "What is the atomic number of Hydrogen?",
      "options": ["1", "2", "3", "4"],
      "correctAnswer": "1"
    },
    {
      "id": 51,
      "question": "Which is the smallest country in the world by population?",
      "options": ["Vatican City", "Monaco", "San Marino", "Liechtenstein"],
      "correctAnswer": "Vatican City"
    },
    {
      "id": 52,
      "question": "What is the hardest natural substance on Earth?",
      "options": ["Gold", "Diamond", "Iron", "Platinum"],
      "correctAnswer": "Diamond"
    },
    {
      "id": 53,
      "question": "What is the largest island in the world?",
      "options": ["Greenland", "Australia", "New Guinea", "Borneo"],
      "correctAnswer": "Greenland"
    },
    {
      "id": 54,
      "question": "Which is the most common gas in the Earth's atmosphere?",
      "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
      "correctAnswer": "Nitrogen"
    },
    {
      "id": 55,
      "question": "Which is the smallest bird in the world?",
      "options": ["Hummingbird", "Sparrow", "Penguin", "Crow"],
      "correctAnswer": "Hummingbird"
    },
    {
      "id": 56,
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Madrid", "Paris"],
      "correctAnswer": "Paris"
    },
    {
      "id": 57,
      "question": "Who is the founder of Microsoft?",
      "options": ["Bill Gates", "Steve Jobs", "Larry Page", "Mark Zuckerberg"],
      "correctAnswer": "Bill Gates"
    },
    {
      "id": 58,
      "question": "What is the longest river in the world?",
      "options": ["Nile", "Amazon", "Yangtze", "Ganges"],
      "correctAnswer": "Nile"
    },
    {
      "id": 59,
      "question": "Which country is famous for the Great Wall?",
      "options": ["China", "India", "Russia", "United States"],
      "correctAnswer": "China"
    },
    {
      "id": 60,
      "question": "Which country has the most number of islands?",
      "options": ["Sweden", "Australia", "Philippines", "Indonesia"],
      "correctAnswer": "Sweden"
    }
  ]
  

export default questions;
