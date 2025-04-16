// Quiz and Visualization Match Game JavaScript

// Global variables for DOM elements
let quizStartButton;
let quizNextButton;
let hintButton;
let hintText;
let quizOptionsContainer;
let quizStartScreen;
let quizGameScreen;
let quizResultsScreen;
let quizPlayerNameInput;
let quizScoreSpan;
let quizTimerSpan;
let quizProgressBar;
let totalQuestionsSpan;
let currentQuestionSpan;
let quizQuestionText;
let quizTopicTag;
let quizResultAvatar;
let quizResultName;
let quizResultDifficulty;
let quizCompletionTimeSpan;
let quizFinalScoreSpan;
let quizMaxScoreSpan;
let quizResultMessage;
let quizAnswersReview;
let quizLeaderboardList;
let quizRestartButton;
let quizShareButton;

let matchStartButton;
let matchNextButton;
let matchOptionsContainer;
let matchStartScreen;
let matchGameScreen;
let matchResultsScreen;
let matchPlayerNameInput;
let matchScoreSpan;
let matchTimerSpan;
let matchProgressBar;
let matchMaxScoreSpan;
let matchInstructionText;
let currentVisualization;
let vizTitle;
let matchResultAvatar;
let matchResultName;
let matchResultMode;
let matchCompletionTimeSpan;
let matchFinalScoreSpan;
let matchResultMessage;
let matchesReview;
let matchLeaderboardList;
let matchRestartButton;
let matchShareButton;

// Fetch questions from questions.json file
let questions = [];

// Function to fetch questions
async function fetchQuestions() {
  try {
    const response = await fetch('data/questions.json');
    if (!response.ok) {
      console.log('Error loading questions file, using default questions');
      // Use default questions as fallback
      questions = defaultQuestions;
    } else {
      questions = await response.json();
      console.log('Questions loaded:', questions.length);
      
      // Add difficulty and hint properties if they don't exist
      questions = questions.map(q => {
        // Add missing properties with default values
        if (!q.difficulty) {
          // Assign difficulty based on topic (for demonstration)
          if (q.topic === "Photo Evidence" || q.topic === "311 Service" || 
              q.topic === "Resolution Rates" || q.topic === "Trends Over Time") {
            q.difficulty = "easy";
          } else if (q.topic === "Race Factors" || q.topic === "Data Science Methods" || 
                    q.topic === "Feature Selection" || q.topic === "Cross-Validation") {
            q.difficulty = "medium";
          } else {
            q.difficulty = "hard";
          }
        }
        
        if (!q.hint) {
          // Create a simple hint based on the explanation
          const words = q.explanation.split(' ');
          // Use first half of the explanation as a hint
          const hintWords = words.slice(0, Math.floor(words.length / 2));
          q.hint = hintWords.join(' ') + "...";
        }
        
        return q;
      });
    }
  } catch (error) {
    console.error('Error loading questions:', error);
    // Fallback to default questions
    questions = defaultQuestions;
  }
}

// Default questions if no external file is found
const defaultQuestions = [
  {
    topic: "Photo Evidence",
    question: "What is the effect of photo evidence on resolution speed?",
    options: ["Speeds it up", "Slows it down", "No effect"],
    answer: 0,
    explanation: "Photo evidence helps city workers understand the issue faster and resolve it more efficiently.",
    difficulty: "easy",
    hint: "Think about how visual information might help workers identify and understand problems."
  },
  {
    topic: "Photo Evidence",
    question: "According to the study, what effect does photo evidence have on the resolution rate of 311 cases?",
    options: ["Lower resolution rate", "Higher resolution rate", "No significant difference"],
    answer: 1,
    explanation: "The study found that cases with photographic evidence have a higher resolution rate compared to those without photos.",
    difficulty: "medium",
    hint: "Visual evidence typically improves the chances of a successful resolution."
  },
  {
    topic: "Regression Models",
    question: "Which regression method was used to handle overdispersion?",
    options: ["Linear Regression", "Negative Binomial Regression", "Lasso Regression"],
    answer: 1,
    explanation: "Negative Binomial Regression was used because the data had overdispersion (variance > mean).",
    difficulty: "hard",
    hint: "This regression type is specifically designed for count data where variance exceeds the mean."
  },
  {
    topic: "Regression Models",
    question: "Which model produced the least Mean Squared Error (MSE) for both the 'number of cases' and 'resolution rate' problems?",
    options: ["Linear Regression", "Lasso Regression", "Ridge Regression"],
    answer: 2,
    explanation: "Ridge Regression produced the least MSE for both prediction problems, likely due to its ability to handle multicollinearity in the dataset.",
    difficulty: "hard",
    hint: "This regularization technique helps with highly correlated predictors."
  },
  {
    topic: "Race Factors",
    question: "How does racial composition affect resolution time?",
    options: ["No effect", "Statistically significant", "Only in low-income areas"],
    answer: 1,
    explanation: "Linear regression showed statistically significant relationships between racial composition and resolution time.",
    difficulty: "medium",
    hint: "The study found demographic variables were correlated with service outcomes."
  },
  {
    topic: "Race Factors",
    question: "Which demographic variable was identified as a significant predictor of the number of cases?",
    options: ["Asian population percentage", "White population percentage", "Black population percentage"],
    answer: 2,
    explanation: "The study found that the proportion of Black residents was one of the four key factors that influenced the number of cases.",
    difficulty: "medium",
    hint: "The study found disparities in service request volume based on community demographics."
  },
  {
    topic: "Resolution Time",
    question: "What statistical test was used to compare resolution times between cases with and without photos?",
    options: ["T-test", "Chi-squared test", "Wilcoxon rank sum test"],
    answer: 2,
    explanation: "The Wilcoxon rank sum test was used to compare resolution time distributions without assuming normality of the data.",
    difficulty: "hard",
    hint: "This non-parametric test is used when data may not follow a normal distribution."
  },
  {
    topic: "311 Service",
    question: "Where was the 311 non-emergency service first introduced in the United States?",
    options: ["New York", "San Francisco", "Baltimore"],
    answer: 2,
    explanation: "The paper mentions that 311 was first introduced by Baltimore, aimed at relieving the burden on 911 and providing a centralized point of public service contact.",
    difficulty: "easy",
    hint: "This east coast city pioneered the service in the 1990s."
  },
  {
    topic: "Data Analysis Methods",
    question: "What technique was used to analyze the common themes in service requests?",
    options: ["Principal Component Analysis", "Topic Modeling with LDA", "Cluster Analysis"],
    answer: 1,
    explanation: "Topic Modeling with LDA (Latent Dirichlet Allocation) was applied to the case and request columns to identify common themes.",
    difficulty: "hard",
    hint: "This technique is commonly used in natural language processing to discover abstract topics."
  },
  {
    topic: "Feature Selection",
    question: "How many features were ultimately selected as optimal for predicting both the number of cases and resolution rate?",
    options: ["2 features", "4 features", "7 features"],
    answer: 1,
    explanation: "After comparing different selection criteria, the study concluded that models with 4 features provided the optimal balance for both prediction tasks.",
    difficulty: "medium",
    hint: "The study found a balance between model complexity and prediction accuracy."
  },
  {
    topic: "Resolution Rates",
    question: "Which case types had the highest resolution rates according to the analysis?",
    options: ["Damaged Property cases", "Abandoned Vehicle cases", "Construction Zone Permits"],
    answer: 1,
    explanation: "The study found that 311 External Request, Abandoned Vehicle, and Blocked Street or Sidewalk cases had high resolution rates.",
    difficulty: "easy",
    hint: "Think about which case types might be easiest for city services to address."
  },
  {
    topic: "Data Science Methods",
    question: "What transformation was applied to resolution times before statistical analysis?",
    options: ["Square root transformation", "Logarithmic transformation", "No transformation"],
    answer: 1,
    explanation: "Resolution times were log-transformed to make extreme values more normally distributed and enable more meaningful comparisons.",
    difficulty: "medium",
    hint: "This transformation is commonly used for right-skewed data with extreme values."
  },
  {
    topic: "Trends Over Time",
    question: "What happened to the average resolution rate in 2017 according to the time series analysis?",
    options: ["It remained stable", "It increased significantly", "It declined drastically"],
    answer: 2,
    explanation: "The study noted that in 2017, the average resolution rate declined drastically, possibly related to changed policies or events at that time.",
    difficulty: "easy",
    hint: "The data showed a significant change in service performance that year."
  },
  {
    topic: "Cross-Validation",
    question: "Why was K-fold cross-validation preferred over simple cross-validation in the study?",
    options: ["It's faster to compute", "It's more robust and reliable", "It requires less data"],
    answer: 1,
    explanation: "The researchers noted that K-fold validation is more robust than simple cross-validation, though it can have greater computational costs with large datasets.",
    difficulty: "medium",
    hint: "This validation technique provides more reliable performance estimates by using multiple test sets."
  },
  {
    topic: "Model Selection",
    question: "Why was Ridge Regression particularly suitable for this dataset?",
    options: ["It's faster than other methods", "It handles multicollinearity between variables", "It automatically selects the best features"],
    answer: 1,
    explanation: "Ridge Regression was suitable because it handles multicollinearity well, which existed in this dataset where variables like racial demographics and population metrics were correlated.",
    difficulty: "hard",
    hint: "This method adds a penalty term that helps when predictors are highly correlated with each other."
  }
];

// Visualization match data - use fetch to load from data/data_gallery_info.json
let visualizationData = []; // Will be populated from data_gallery_info.json

// Function to fetch visualization data
async function fetchVisualizationData() {
  try {
    const response = await fetch('data/data_gallery_info.json');
    if (!response.ok) {
      throw new Error('Failed to load visualization data');
    }
    visualizationData = await response.json();
    console.log('Visualization data loaded:', visualizationData.length);
  } catch (error) {
    console.error('Error loading visualization data:', error);
    // Fallback to empty array if fetch fails
    visualizationData = [];
  }
}

// Game state variables
let quizState = {
  gameStarted: false,
  selectedQuestions: [],
  currentQuestion: 0,
  score: 0,
  difficulty: "medium",
  startTime: null,
  playerName: "Player",
  selectedAvatar: "🧑‍💼",
  timerInterval: null,
  timeRemaining: 60,
  hintsUsed: 0,
  playerAnswers: []
};

let matchState = {
  gameStarted: false,
  visualizations: [],
  currentVisualization: 0,
  score: 0,
  matchMode: "summary",
  startTime: null,
  playerName: "Player",
  selectedAvatar: "📊",
  timerInterval: null,
  timeRemaining: 120,
  playerMatches: []
};

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM content loaded");
  
  // Fetch questions and visualization data
  fetchQuestions();
  fetchVisualizationData();
  
  // Initialize DOM element references
  initializeDOMReferences();
  
  // Set up quiz game
  setupQuizGame();
  
  // Set up match game
  setupMatchGame();
  
  // Set up game selection
  const quizOption = document.getElementById('quiz-option');
  const matchOption = document.getElementById('match-option');
  
  if (quizOption) {
    quizOption.addEventListener('click', function() {
      const gameSelector = document.querySelector('.game-selector');
      const quizGame = document.querySelector('.quiz-game');
      
      if (gameSelector && quizGame) {
        gameSelector.classList.add('hidden');
        quizGame.classList.remove('hidden');
      }
    });
  }
  
  if (matchOption) {
    matchOption.addEventListener('click', function() {
      const gameSelector = document.querySelector('.game-selector');
      const matchGame = document.querySelector('.match-game');
      
      if (gameSelector && matchGame) {
        gameSelector.classList.add('hidden');
        matchGame.classList.remove('hidden');
      }
    });
  }
  
  // Back to selection buttons
  const backButtons = [
    { id: 'back-to-selection-from-quiz', container: '.quiz-game' },
    { id: 'back-to-selection-from-results', container: '.quiz-game' },
    { id: 'back-to-selection-from-match', container: '.match-game' },
    { id: 'back-to-selection-from-match-results', container: '.match-game' }
  ];
  
  backButtons.forEach(button => {
    const element = document.getElementById(button.id);
    
    if (element) {
      element.addEventListener('click', function() {
        const container = document.querySelector(button.container);
        const gameSelector = document.querySelector('.game-selector');
        
        if (container && gameSelector) {
          container.classList.add('hidden');
          gameSelector.classList.remove('hidden');
        }
      });
    }
  });
});

// Initialize DOM element references
function initializeDOMReferences() {
  console.log("Initializing DOM references");
  
  // Quiz elements
  quizStartButton = document.getElementById('quiz-start-button');
  quizNextButton = document.getElementById('quiz-next-button');
  hintButton = document.getElementById('hint-button');
  hintText = document.getElementById('hint-text');
  quizOptionsContainer = document.getElementById('quiz-options');
  quizStartScreen = document.getElementById('quiz-start-screen');
  quizGameScreen = document.getElementById('quiz-game-screen');
  quizResultsScreen = document.getElementById('quiz-results-screen');
  quizPlayerNameInput = document.getElementById('quiz-player-name');
  quizScoreSpan = document.getElementById('quiz-score');
  quizTimerSpan = document.getElementById('quiz-timer');
  quizProgressBar = document.getElementById('quiz-progress-bar');
  totalQuestionsSpan = document.getElementById('total-questions');
  currentQuestionSpan = document.getElementById('current-question');
  quizQuestionText = document.getElementById('quiz-question-text');
  quizTopicTag = document.getElementById('quiz-topic-tag');
  quizResultAvatar = document.getElementById('quiz-result-avatar');
  quizResultName = document.getElementById('quiz-result-name');
  quizResultDifficulty = document.getElementById('quiz-result-difficulty');
  quizCompletionTimeSpan = document.getElementById('quiz-completion-time');
  quizFinalScoreSpan = document.getElementById('quiz-final-score');
  quizMaxScoreSpan = document.getElementById('quiz-max-score');
  quizResultMessage = document.getElementById('quiz-result-message');
  quizAnswersReview = document.getElementById('quiz-answers-review');
  quizLeaderboardList = document.getElementById('quiz-leaderboard-list');
  quizRestartButton = document.getElementById('quiz-restart-button');
  quizShareButton = document.getElementById('quiz-share-button');
  
  // Match elements
  matchStartButton = document.getElementById('match-start-button');
  matchNextButton = document.getElementById('match-next-button');
  matchOptionsContainer = document.getElementById('match-options');
  matchStartScreen = document.getElementById('match-start-screen');
  matchGameScreen = document.getElementById('match-game-screen');
  matchResultsScreen = document.getElementById('match-results-screen');
  matchPlayerNameInput = document.getElementById('match-player-name');
  matchScoreSpan = document.getElementById('match-score');
  matchTimerSpan = document.getElementById('match-timer');
  matchProgressBar = document.getElementById('match-progress-bar');
  matchMaxScoreSpan = document.getElementById('match-max-score');
  matchInstructionText = document.getElementById('match-instruction');
  currentVisualization = document.getElementById('current-visualization');
  vizTitle = document.getElementById('viz-title');
  matchResultAvatar = document.getElementById('match-result-avatar');
  matchResultName = document.getElementById('match-result-name');
  matchResultMode = document.getElementById('match-result-mode');
  matchCompletionTimeSpan = document.getElementById('match-completion-time');
  matchFinalScoreSpan = document.getElementById('match-final-score');
  matchResultMessage = document.getElementById('match-result-message');
  matchesReview = document.getElementById('matches-review');
  matchLeaderboardList = document.getElementById('match-leaderboard-list');
  matchRestartButton = document.getElementById('match-restart-button');
  matchShareButton = document.getElementById('match-share-button');
  
  console.log("DOM references initialized");
}

// Quiz Game Setup
function setupQuizGame() {
  console.log("Setting up quiz game");
  
  if (!quizStartScreen) {
    console.error("Quiz start screen not found");
    return;
  }
  
  // Avatar selection
  const quizAvatars = document.querySelectorAll('.quiz-game .avatar');
  if (quizAvatars.length > 0) {
    quizAvatars.forEach(avatar => {
      avatar.addEventListener('click', function() {
        quizAvatars.forEach(a => a.classList.remove('selected'));
        this.classList.add('selected');
        quizState.selectedAvatar = this.getAttribute('data-avatar');
      });
    });
    quizAvatars[0].classList.add('selected');
  } else {
    console.warn("No quiz avatars found");
  }

  // Difficulty selection
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  if (difficultyButtons.length > 0) {
    difficultyButtons.forEach(button => {
      button.addEventListener('click', function() {
        difficultyButtons.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        quizState.difficulty = this.getAttribute('data-difficulty');
      });
    });
    // Find medium difficulty button and select it
    const mediumButton = Array.from(difficultyButtons).find(b => b.getAttribute('data-difficulty') === 'medium');
    if (mediumButton) {
      mediumButton.classList.add('selected');
    }
  } else {
    console.warn("No difficulty buttons found");
  }

  // Start game button
  if (quizStartButton) {
    quizStartButton.addEventListener('click', function() {
      startQuizGame();
    });
  } else {
    console.error("Quiz start button not found");
  }

  // Next question button
  if (quizNextButton) {
    quizNextButton.addEventListener('click', function() {
      const selectedOption = document.querySelector('.quiz-game .option.selected');
      if (!selectedOption && !quizNextButton.classList.contains('show-answer')) {
        alert('Please select an answer!');
        return;
      }

      if (quizNextButton.classList.contains('show-answer')) {
        quizNextButton.classList.remove('show-answer');
        quizNextButton.textContent = 'Submit Answer';
        goToNextQuizQuestion();
      } else {
        // Show correct answer
        showQuizAnswer();
      }
    });
  } else {
    console.error("Quiz next button not found");
  }

  // Hint button
  if (hintButton) {
    hintButton.addEventListener('click', function() {
      if (!this.classList.contains('used')) {
        showHint();
        this.classList.add('used');
        quizState.hintsUsed++;
      }
    });
  } else {
    console.error("Hint button not found");
  }

  // Restart game
  if (quizRestartButton) {
    quizRestartButton.addEventListener('click', function() {
      resetQuizGame();
      if (quizStartScreen && quizResultsScreen) {
        quizStartScreen.classList.remove('hidden');
        quizResultsScreen.classList.add('hidden');
      }
    });
  } else {
    console.error("Quiz restart button not found");
  }

  // Share results
  if (quizShareButton) {
    quizShareButton.addEventListener('click', function() {
      shareQuizResults();
    });
  } else {
    console.error("Quiz share button not found");
  }
  
  console.log("Quiz game setup complete");
}

// Match Game Setup
function setupMatchGame() {
  console.log("Setting up match game");
  
  if (!matchStartScreen) {
    console.error("Match start screen not found");
    return;
  }
  
  // Avatar selection
  const matchAvatars = document.querySelectorAll('.match-game .avatar');
  if (matchAvatars.length > 0) {
    matchAvatars.forEach(avatar => {
      avatar.addEventListener('click', function() {
        matchAvatars.forEach(a => a.classList.remove('selected'));
        this.classList.add('selected');
        matchState.selectedAvatar = this.getAttribute('data-avatar');
      });
    });
    matchAvatars[0].classList.add('selected');
  } else {
    console.warn("No match avatars found");
  }

  // Mode selection
  const modeButtons = document.querySelectorAll('.mode-btn');
  if (modeButtons.length > 0) {
    modeButtons.forEach(button => {
      button.addEventListener('click', function() {
        modeButtons.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        matchState.matchMode = this.getAttribute('data-mode');
      });
    });
    // Select first mode button
    modeButtons[0].classList.add('selected');
  } else {
    console.warn("No mode buttons found");
  }

  // Start game button
  if (matchStartButton) {
    matchStartButton.addEventListener('click', function() {
      startMatchGame();
    });
  } else {
    console.error("Match start button not found");
  }

  // Next match button
  if (matchNextButton) {
    matchNextButton.addEventListener('click', function() {
      const selectedOption = document.querySelector('.match-game .match-option.selected');
      if (!selectedOption && !matchNextButton.classList.contains('show-answer')) {
        alert('Please select a match!');
        return;
      }

      if (matchNextButton.classList.contains('show-answer')) {
        matchNextButton.classList.remove('show-answer');
        matchNextButton.textContent = 'Submit Match';
        goToNextMatch();
      } else {
        // Show correct match
        showMatchAnswer();
      }
    });
  } else {
    console.error("Match next button not found");
  }

  // Restart game
  if (matchRestartButton) {
    matchRestartButton.addEventListener('click', function() {
      resetMatchGame();
      if (matchStartScreen && matchResultsScreen) {
        matchStartScreen.classList.remove('hidden');
        matchResultsScreen.classList.add('hidden');
      }
    });
  } else {
    console.error("Match restart button not found");
  }

  // Share results
  if (matchShareButton) {
    matchShareButton.addEventListener('click', function() {
      shareMatchResults();
    });
  } else {
    console.error("Match share button not found");
  }
  
  console.log("Match game setup complete");
}

// Quiz Game Functions
function startQuizGame() {
  console.log("Starting quiz game");
  
  if (!quizPlayerNameInput || !quizScoreSpan || !quizTimerSpan || !quizProgressBar || 
      !totalQuestionsSpan || !currentQuestionSpan || !quizStartScreen || !quizGameScreen) {
    console.error("Required quiz elements not found");
    return;
  }
  
  // Get player name
  quizState.playerName = quizPlayerNameInput.value.trim() || "Player";
  
  // Filter questions by difficulty
  const filteredQuestions = questions.filter(q => q.difficulty === quizState.difficulty);
  
  // Select random questions (max 10)
  const numQuestions = Math.min(10, filteredQuestions.length);
  quizState.selectedQuestions = [...filteredQuestions]
    .sort(() => Math.random() - 0.5)
    .slice(0, numQuestions);
  
  // Initialize game state
  quizState.currentQuestion = 0;
  quizState.score = 0;
  quizState.playerAnswers = [];
  quizState.hintsUsed = 0;
  quizState.timeRemaining = quizState.difficulty === "easy" ? 60 : 
                            quizState.difficulty === "medium" ? 50 : 40;
  
  // Update UI
  quizScoreSpan.textContent = quizState.score;
  quizTimerSpan.textContent = quizState.timeRemaining;
  quizProgressBar.style.width = '0%';
  totalQuestionsSpan.textContent = quizState.selectedQuestions.length;
  currentQuestionSpan.textContent = 1;
  
  // Start timer
  quizState.startTime = Date.now();
  if (quizState.timerInterval) clearInterval(quizState.timerInterval);
  quizState.timerInterval = setInterval(updateQuizTimer, 1000);
  
  // Update UI visibility
  quizStartScreen.classList.add('hidden');
  quizGameScreen.classList.remove('hidden');
  
  // Load first question
  loadQuizQuestion();
  
  // Game started
  quizState.gameStarted = true;
  
  console.log("Quiz game started");
}

function loadQuizQuestion() {
  console.log("Loading quiz question", quizState.currentQuestion);
  
  if (!quizQuestionText || !quizTopicTag || !currentQuestionSpan || !quizProgressBar || 
      !hintButton || !hintText || !quizOptionsContainer) {
    console.error("Required quiz question elements not found");
    return;
  }
  
  const questionData = quizState.selectedQuestions[quizState.currentQuestion];
  
  // Update question text and topic
  quizQuestionText.textContent = questionData.question;
  quizTopicTag.textContent = questionData.topic;
  
  // Update progress 
  currentQuestionSpan.textContent = quizState.currentQuestion + 1;
  const progress = ((quizState.currentQuestion) / quizState.selectedQuestions.length) * 100;
  quizProgressBar.style.width = `${progress}%`;
  
  // Reset hint
  hintButton.classList.remove('used');
  hintText.classList.add('hidden');
  hintText.textContent = '';
  
  // Clear previous options
  quizOptionsContainer.innerHTML = '';
  
  // Add new options
  questionData.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('option');
    optionElement.innerHTML = `
      <span class="option-marker">${String.fromCharCode(65 + index)}</span>
      ${option}
    `;
    
    optionElement.addEventListener('click', function() {
      document.querySelectorAll('.quiz-game .option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
    });
    
    quizOptionsContainer.appendChild(optionElement);
  });
}

function showHint() {
  if (!hintText) {
    console.error("Hint text element not found");
    return;
  }
  
  const questionData = quizState.selectedQuestions[quizState.currentQuestion];
  hintText.textContent = questionData.hint;
  hintText.classList.remove('hidden');
}

function showQuizAnswer() {
  console.log("Showing quiz answer");
  
  if (!quizOptionsContainer || !quizNextButton || !quizScoreSpan) {
    console.error("Required quiz answer elements not found");
    return;
  }
  
  const options = document.querySelectorAll('.quiz-game .option');
  const currentQ = quizState.selectedQuestions[quizState.currentQuestion];
  
  options.forEach((option, index) => {
    if (index === currentQ.answer) {
      option.classList.add('correct');
    } else if (option.classList.contains('selected')) {
      option.classList.add('incorrect');
    }
    option.style.pointerEvents = 'none';
  });
  
  const selectedOption = document.querySelector('.quiz-game .option.selected');
  if (selectedOption) {
    const selectedIndex = Array.from(options).indexOf(selectedOption);
    quizState.playerAnswers.push(selectedIndex);
    if (selectedIndex === currentQ.answer) {
      quizState.score++;
      quizScoreSpan.textContent = quizState.score;
    }
  } else {
    quizState.playerAnswers.push(-1); // No answer selected
  }
  
  quizNextButton.textContent = 'Next Question';
  quizNextButton.classList.add('show-answer');
}

function goToNextQuizQuestion() {
  console.log("Going to next quiz question");
  
  quizState.currentQuestion++;
  
  if (quizState.currentQuestion < quizState.selectedQuestions.length) {
    loadQuizQuestion();
  } else {
    endQuizGame();
  }
}

function updateQuizTimer() {
  if (!quizTimerSpan) {
    console.error("Quiz timer span not found");
    clearInterval(quizState.timerInterval);
    return;
  }
  
  quizState.timeRemaining--;
  quizTimerSpan.textContent = quizState.timeRemaining;
  if (quizState.timeRemaining <= 10) {
    quizTimerSpan.style.color = '#ff6b6b';
  }
  
  if (quizState.timeRemaining <= 0) {
    clearInterval(quizState.timerInterval);
    endQuizGame();
  }
}

function endQuizGame() {
  console.log("Ending quiz game");
  
  if (!quizCompletionTimeSpan || !quizFinalScoreSpan || !quizMaxScoreSpan || 
      !quizResultName || !quizResultAvatar || !quizResultDifficulty || 
      !quizResultMessage || !quizGameScreen || !quizResultsScreen) {
    console.error("Required quiz results elements not found");
    return;
  }
  
  // Stop timer
  clearInterval(quizState.timerInterval);
  
  // Calculate completion time
  const completionTime = Math.floor((Date.now() - quizState.startTime) / 1000);
  
  // Update results screen
  quizCompletionTimeSpan.textContent = completionTime;
  quizFinalScoreSpan.textContent = quizState.score;
  quizMaxScoreSpan.textContent = quizState.selectedQuestions.length;
  quizResultName.textContent = quizState.playerName;
  quizResultAvatar.textContent = quizState.selectedAvatar;
  quizResultDifficulty.textContent = `Difficulty: ${quizState.difficulty.charAt(0).toUpperCase() + quizState.difficulty.slice(1)}`;
  
  // Set result message based on score
  const percentage = (quizState.score / quizState.selectedQuestions.length) * 100;
  if (percentage >= 90) {
    quizResultMessage.textContent = 'Amazing! You\'re a 311 resolution expert! 🏆';
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  } else if (percentage >= 70) {
    quizResultMessage.textContent = 'Great job! You know your stuff! 👍';
  } else if (percentage >= 50) {
    quizResultMessage.textContent = 'Good effort! Keep learning about 311 services! 📚';
  } else {
    quizResultMessage.textContent = 'Keep studying! You\'ll get there! 💪';
  }
  
  // Create review of answers
  createQuizAnswersReview();
  
  // Update leaderboard
  updateQuizLeaderboard(quizState.playerName, quizState.score, completionTime, quizState.difficulty);
  
  // Show results screen
  quizGameScreen.classList.add('hidden');
  quizResultsScreen.classList.remove('hidden');
}

function createQuizAnswersReview() {
  console.log("Creating quiz answers review");
  
  if (!quizAnswersReview) {
    console.error("Quiz answers review element not found");
    return;
  }
  
  quizAnswersReview.innerHTML = '';
  
  quizState.selectedQuestions.forEach((q, i) => {
    const userAnswerIndex = quizState.playerAnswers[i];
    const userAnswer = userAnswerIndex >= 0 ? q.options[userAnswerIndex] : "No answer";
    const isCorrect = userAnswerIndex === q.answer;
    
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = `
      <h4>${i + 1}. ${q.question}</h4>
      <div class="user-answer">Your answer: <span class="${isCorrect ? 'text-success' : 'text-danger'}">${userAnswer}</span></div>
      <div class="correct-answer">Correct answer: ${q.options[q.answer]}</div>
      <div class="explanation">${q.explanation}</div>
    `;
    
    quizAnswersReview.appendChild(reviewItem);
  });
}

function updateQuizLeaderboard(name, score, time, difficulty) {
  console.log("Updating quiz leaderboard");
  
  if (!quizLeaderboardList) {
    console.error("Quiz leaderboard list element not found");
    return;
  }
  
  // Get existing leaderboard or create new one
  const leaderboardKey = `quizLeaderboard_${difficulty}`;
  let leaderboard = [];
  
  try {
    const storedLeaderboard = localStorage.getItem(leaderboardKey);
    if (storedLeaderboard) {
      leaderboard = JSON.parse(storedLeaderboard);
    }
  } catch (error) {
    console.error('Error loading leaderboard from localStorage:', error);
  }
  
  // Add new entry
  leaderboard.push({
    name: name,
    score: score,
    time: time,
    date: new Date().toLocaleDateString()
  });
  
  // Sort by score (high to low) and then by time (low to high)
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.time - b.time;
  });
  
  // Limit to top 5
  leaderboard = leaderboard.slice(0, 5);
  
  // Save to localStorage
  try {
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error saving leaderboard to localStorage:', error);
  }
  
  // Update UI
  quizLeaderboardList.innerHTML = '';
  leaderboard.forEach((entry, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${entry.name} - ${entry.score} points (${entry.time}s)`;
    if (entry.name === name && entry.score === score && entry.time === time) {
      li.style.fontWeight = 'bold';
      li.style.color = 'var(--primary-color)';
    }
    quizLeaderboardList.appendChild(li);
  });
}

function shareQuizResults() {
  console.log("Sharing quiz results");
  
  const text = `📊 I scored ${quizState.score}/${quizState.selectedQuestions.length} on the 311 Resolution Challenge (${quizState.difficulty} difficulty)! Can you beat my score?`;
  
  if (navigator.share) {
    navigator.share({
      title: '311 Resolution Challenge',
      text: text
    }).catch(err => {
      console.log('Error sharing:', err);
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
}

function resetQuizGame() {
  console.log("Resetting quiz game");
  
  clearInterval(quizState.timerInterval);
  
  if (quizTimerSpan) {
    quizTimerSpan.style.color = '';
  }
  
  if (quizPlayerNameInput) {
    quizPlayerNameInput.value = '';
  }
  
  quizState.gameStarted = false;
}

// Match Game Functions
function startMatchGame() {
  console.log("Starting match game");
  
  if (!matchPlayerNameInput || !matchScoreSpan || !matchTimerSpan || !matchProgressBar || 
      !matchMaxScoreSpan || !matchInstructionText || !matchStartScreen || !matchGameScreen) {
    console.error("Required match elements not found");
    return;
  }
  
  // Get player name
  matchState.playerName = matchPlayerNameInput.value.trim() || "Player";
  
  // Get visualizations
  if (visualizationData.length === 0) {
    alert("No visualization data available. Please try again later.");
    return;
  }
  
  // Shuffle visualizations
  matchState.visualizations = [...visualizationData].sort(() => Math.random() - 0.5);
  
  // Initialize game state
  matchState.currentVisualization = 0;
  matchState.score = 0;
  matchState.playerMatches = [];
  matchState.timeRemaining = 120;
  
  // Update UI
  matchScoreSpan.textContent = matchState.score;
  matchTimerSpan.textContent = matchState.timeRemaining;
  matchProgressBar.style.width = '0%';
  matchMaxScoreSpan.textContent = matchState.visualizations.length;
  
  // Set instruction based on mode
  matchInstructionText.textContent = matchState.matchMode === "summary" ? 
    "Match the visualization with its correct summary" :
    "Match the visualization with its correct interpretation";
  
  // Start timer
  matchState.startTime = Date.now();
  if (matchState.timerInterval) clearInterval(matchState.timerInterval);
  matchState.timerInterval = setInterval(updateMatchTimer, 1000);
  
  // Update UI visibility
  matchStartScreen.classList.add('hidden');
  matchGameScreen.classList.remove('hidden');
  
  // Load first visualization
  loadVisualizationMatch();
  
  // Game started
  matchState.gameStarted = true;
  
  console.log("Match game started");
}

function loadVisualizationMatch() {
  console.log("Loading visualization match", matchState.currentVisualization);
  
  if (!currentVisualization || !vizTitle || !matchProgressBar || !matchOptionsContainer) {
    console.error("Required match elements not found");
    return;
  }
  
  if (matchState.currentVisualization >= matchState.visualizations.length) {
    console.error("No more visualizations to load");
    endMatchGame();
    return;
  }
  
  const visualizationData = matchState.visualizations[matchState.currentVisualization];
  
  // Update visualization image and title
  currentVisualization.src = visualizationData.path || '';
  vizTitle.textContent = visualizationData.title || 'Untitled Visualization';
  
  // Update progress
  const progress = ((matchState.currentVisualization) / matchState.visualizations.length) * 100;
  matchProgressBar.style.width = `${progress}%`;
  
  // Clear previous options
  matchOptionsContainer.innerHTML = '';
  
  // Create match options - one correct and three random incorrect
  let options = [];
  const correctText = matchState.matchMode === "summary" ? 
    (visualizationData.summary || 'No summary available') : 
    (visualizationData.interpretation || 'No interpretation available');
  
  // Add correct option
  options.push({
    text: correctText,
    isCorrect: true
  });
  
  // Add incorrect options from other visualizations
  const otherVisualizations = matchState.visualizations.filter(v => v.title !== visualizationData.title);
  const shuffledOthers = [...otherVisualizations].sort(() => Math.random() - 0.5).slice(0, 3);
  
  shuffledOthers.forEach(v => {
    options.push({
      text: matchState.matchMode === "summary" ? 
        (v.summary || 'No summary available') : 
        (v.interpretation || 'No interpretation available'),
      isCorrect: false
    });
  });
  
  // Shuffle options
  options = options.sort(() => Math.random() - 0.5);
  
  // Add options to container
  options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('match-option');
    optionElement.textContent = option.text;
    optionElement.dataset.correct = option.isCorrect;
    
    optionElement.addEventListener('click', function() {
      document.querySelectorAll('.match-game .match-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      this.classList.add('selected');
    });
    
    matchOptionsContainer.appendChild(optionElement);
  });
}

function showMatchAnswer() {
  console.log("Showing match answer");
  
  if (!matchOptionsContainer || !matchNextButton || !matchScoreSpan) {
    console.error("Required match answer elements not found");
    return;
  }
  
  const options = document.querySelectorAll('.match-game .match-option');
  
  options.forEach(option => {
    if (option.dataset.correct === "true") {
      option.classList.add('correct');
    } else if (option.classList.contains('selected')) {
      option.classList.add('incorrect');
    }
    option.style.pointerEvents = 'none';
  });
  
  const selectedOption = document.querySelector('.match-game .match-option.selected');
  if (selectedOption) {
    const isCorrect = selectedOption.dataset.correct === "true";
    matchState.playerMatches.push({
      visualizationIndex: matchState.currentVisualization,
      selectedText: selectedOption.textContent,
      isCorrect: isCorrect
    });
    
    if (isCorrect) {
      matchState.score++;
      matchScoreSpan.textContent = matchState.score;
    }
  } else {
    matchState.playerMatches.push({
      visualizationIndex: matchState.currentVisualization,
      selectedText: null,
      isCorrect: false
    });
  }
  
  matchNextButton.textContent = 'Next Visualization';
  matchNextButton.classList.add('show-answer');
}

function goToNextMatch() {
  console.log("Going to next match");
  
  matchState.currentVisualization++;
  
  if (matchState.currentVisualization < matchState.visualizations.length) {
    loadVisualizationMatch();
  } else {
    endMatchGame();
  }
}

function updateMatchTimer() {
  if (!matchTimerSpan) {
    console.error("Match timer span not found");
    clearInterval(matchState.timerInterval);
    return;
  }
  
  matchState.timeRemaining--;
  matchTimerSpan.textContent = matchState.timeRemaining;
  
  if (matchState.timeRemaining <= 10) {
    matchTimerSpan.style.color = '#ff6b6b';
  }
  
  if (matchState.timeRemaining <= 0) {
    clearInterval(matchState.timerInterval);
    endMatchGame();
  }
}

function endMatchGame() {
  console.log("Ending match game");
  
  if (!matchCompletionTimeSpan || !matchFinalScoreSpan || !matchMaxScoreSpan || 
      !matchResultName || !matchResultAvatar || !matchResultMode || 
      !matchResultMessage || !matchGameScreen || !matchResultsScreen) {
    console.error("Required match results elements not found");
    return;
  }
  
  // Stop timer
  clearInterval(matchState.timerInterval);
  
  // Calculate completion time
  const completionTime = Math.floor((Date.now() - matchState.startTime) / 1000);
  
  // Update results screen
  matchCompletionTimeSpan.textContent = completionTime;
  matchFinalScoreSpan.textContent = matchState.score;
  matchMaxScoreSpan.textContent = matchState.visualizations.length;
  matchResultName.textContent = matchState.playerName;
  matchResultAvatar.textContent = matchState.selectedAvatar;
  matchResultMode.textContent = `Mode: ${matchState.matchMode === "summary" ? "Summary" : "Interpretation"} Match`;
  
  // Set result message based on score
  const percentage = (matchState.score / matchState.visualizations.length) * 100;
  if (percentage >= 80) {
    matchResultMessage.textContent = 'Amazing! You\'re a data visualization expert! 🏆';
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  } else if (percentage >= 60) {
    matchResultMessage.textContent = 'Great job! You know your visualizations! 👍';
  } else if (percentage >= 40) {
    matchResultMessage.textContent = 'Good effort! Keep learning about data viz! 📊';
  } else {
    matchResultMessage.textContent = 'Keep practicing! You\'ll get better! 💪';
  }
  
  // Create review of matches
  createMatchesReview();
  
  // Update leaderboard
  updateMatchLeaderboard(matchState.playerName, matchState.score, completionTime, matchState.matchMode);
  
  // Show results screen
  matchGameScreen.classList.add('hidden');
  matchResultsScreen.classList.remove('hidden');
}

function createMatchesReview() {
  console.log("Creating matches review");
  
  if (!matchesReview) {
    console.error("Matches review element not found");
    return;
  }
  
  matchesReview.innerHTML = '';
  
  matchState.playerMatches.forEach((match, i) => {
    if (match.visualizationIndex >= matchState.visualizations.length) {
      console.error("Invalid visualization index:", match.visualizationIndex);
      return;
    }
    
    const visualizationData = matchState.visualizations[match.visualizationIndex];
    const correctText = matchState.matchMode === "summary" ? 
      (visualizationData.summary || 'No summary available') : 
      (visualizationData.interpretation || 'No interpretation available');
    
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    
    reviewItem.innerHTML = `
      <h4>${visualizationData.title || 'Untitled Visualization'}</h4>
      <img src="${visualizationData.path || ''}" alt="${visualizationData.title || 'Visualization'}" class="review-viz-image">
      <div class="user-answer">Your match: <span class="${match.isCorrect ? 'text-success' : 'text-danger'}">${match.selectedText || "No selection"}</span></div>
      <div class="correct-answer">Correct match: ${correctText}</div>
    `;
    
    matchesReview.appendChild(reviewItem);
  });
}

function updateMatchLeaderboard(name, score, time, mode) {
  console.log("Updating match leaderboard");
  
  if (!matchLeaderboardList) {
    console.error("Match leaderboard list element not found");
    return;
  }
  
  // Get existing leaderboard or create new one
  const leaderboardKey = `matchLeaderboard_${mode}`;
  let leaderboard = [];
  
  try {
    const storedLeaderboard = localStorage.getItem(leaderboardKey);
    if (storedLeaderboard) {
      leaderboard = JSON.parse(storedLeaderboard);
    }
  } catch (error) {
    console.error('Error loading leaderboard from localStorage:', error);
  }
  
  // Add new entry
  leaderboard.push({
    name: name,
    score: score,
    time: time,
    date: new Date().toLocaleDateString()
  });
  
  // Sort by score (high to low) and then by time (low to high)
  leaderboard.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.time - b.time;
  });
  
  // Limit to top 5
  leaderboard = leaderboard.slice(0, 5);
  
  // Save to localStorage
  try {
    localStorage.setItem(leaderboardKey, JSON.stringify(leaderboard));
  } catch (error) {
    console.error('Error saving leaderboard to localStorage:', error);
  }
  
  // Update UI
  matchLeaderboardList.innerHTML = '';
  leaderboard.forEach((entry, i) => {
    const li = document.createElement('li');
    li.innerHTML = `${entry.name} - ${entry.score} points (${entry.time}s)`;
    if (entry.name === name && entry.score === score && entry.time === time) {
      li.style.fontWeight = 'bold';
      li.style.color = 'var(--primary-color)';
    }
    matchLeaderboardList.appendChild(li);
  });
}

function shareMatchResults() {
  console.log("Sharing match results");
  
  const text = `📊 I scored ${matchState.score}/${matchState.visualizations.length} on the 311 Visualization Match Challenge (${matchState.matchMode} mode)! Can you beat my score?`;
  
  if (navigator.share) {
    navigator.share({
      title: '311 Visualization Match Challenge',
      text: text
    }).catch(err => {
      console.log('Error sharing:', err);
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
}

function resetMatchGame() {
  console.log("Resetting match game");
  
  clearInterval(matchState.timerInterval);
  
  if (matchTimerSpan) {
    matchTimerSpan.style.color = '';
  }
  
  if (matchPlayerNameInput) {
    matchPlayerNameInput.value = '';
  }
  
  matchState.gameStarted = false;
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  console.log("Copying to clipboard:", text);
  
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      alert('Result copied to clipboard!');
    } else {
      console.error('Failed to copy text');
    }
  } catch (err) {
    console.error('Error copying text:', err);
  }
  
  document.body.removeChild(textarea);
}

// Debug function to check DOM elements
function checkDOMElements() {
  console.log("Checking DOM elements");
  
  const elements = [
    { name: 'Quiz Option', element: document.getElementById('quiz-option') },
    { name: 'Match Option', element: document.getElementById('match-option') },
    { name: 'Quiz Start Screen', element: document.getElementById('quiz-start-screen') },
    { name: 'Quiz Game Screen', element: document.getElementById('quiz-game-screen') },
    { name: 'Quiz Results Screen', element: document.getElementById('quiz-results-screen') },
    { name: 'Quiz Start Button', element: document.getElementById('quiz-start-button') },
    { name: 'Quiz Next Button', element: document.getElementById('quiz-next-button') },
    { name: 'Quiz Score Span', element: document.getElementById('quiz-score') },
    { name: 'Quiz Timer Span', element: document.getElementById('quiz-timer') },
    { name: 'Quiz Progress Bar', element: document.getElementById('quiz-progress-bar') },
    { name: 'Quiz Topic Tag', element: document.getElementById('quiz-topic-tag') },
    { name: 'Quiz Question Text', element: document.getElementById('quiz-question-text') },
    { name: 'Quiz Options Container', element: document.getElementById('quiz-options') },
    { name: 'Hint Button', element: document.getElementById('hint-button') },
    { name: 'Hint Text', element: document.getElementById('hint-text') },
    { name: 'Match Start Screen', element: document.getElementById('match-start-screen') },
    { name: 'Match Game Screen', element: document.getElementById('match-game-screen') },
    { name: 'Match Results Screen', element: document.getElementById('match-results-screen') },
    { name: 'Match Start Button', element: document.getElementById('match-start-button') },
    { name: 'Match Next Button', element: document.getElementById('match-next-button') },
    { name: 'Match Score Span', element: document.getElementById('match-score') },
    { name: 'Match Timer Span', element: document.getElementById('match-timer') },
    { name: 'Match Progress Bar', element: document.getElementById('match-progress-bar') },
    { name: 'Match Instruction', element: document.getElementById('match-instruction') },
    { name: 'Current Visualization', element: document.getElementById('current-visualization') },
    { name: 'Visualization Title', element: document.getElementById('viz-title') },
    { name: 'Match Options Container', element: document.getElementById('match-options') }
  ];
  
  elements.forEach(item => {
    console.log(`${item.name}: ${item.element ? 'Found' : 'Not Found'}`);
  });
}

// Call this function at the end of DOMContentLoaded to debug
// document.addEventListener('DOMContentLoaded', function() {
//   // Existing code...
//   setTimeout(checkDOMElements, 1000); // Check elements after 1 second
// });

// Add a global function to check elements from console
window.debugQuizApp = function() {
  console.log("Running Quiz App debug");
  checkDOMElements();
  console.log("Quiz State:", quizState);
  console.log("Match State:", matchState);
  console.log("Questions:", questions);
  console.log("Visualization Data:", visualizationData);
};
  