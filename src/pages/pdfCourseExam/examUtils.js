/**
 * Exam Utilities - Helper functions for PDF exam functionality
 * Extracted from PdfTest.jsx for better code organization and reusability
 */

// ==================== CONSTANTS ====================

export const EXAM_CONSTANTS = {
  // API Configuration
  DEBOUNCE_DELAY: 500, // ms
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // ms

  // Timer Configuration
  TIMER_INTERVAL: 1000, // ms

  // Question States
  QUESTION_STATE: {
    NOT_VISITED: 0,
    VISITED: 1,
    ANSWERED: 2,
    MARKED_FOR_REVIEW: 3,
    ANSWERED_AND_MARKED: 4,
  },
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format time from seconds to MM:SS format
 * @param {number} time - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

/**
 * Parse time string to seconds
 * @param {string} timeString - Time in "MM:SS" format
 * @returns {number} Time in seconds
 */
export const parseTimeToSeconds = (timeString) => {
  if (!timeString || typeof timeString !== "string") return 0;
  const [minutes, seconds] = timeString.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
};

/**
 * Validate exam data structure
 * @param {Object} examData - Exam data object
 * @returns {boolean} True if valid
 */
export const validateExamData = (examData) => {
  if (!examData) return false;
  if (!examData.section || !Array.isArray(examData.section)) return false;
  if (examData.section.length === 0) return false;
  return true;
};

/**
 * Get section start index for a given section
 * @param {Object} examData - Exam data
 * @param {number} sectionIndex - Current section index
 * @param {string} language - Selected language
 * @returns {number} Starting question index for the section
 */
export const getSectionStartIndex = (examData, sectionIndex, language) => {
  if (!validateExamData(examData)) return 0;

  return examData.section.slice(0, sectionIndex).reduce((acc, section) => {
    const questions = section.questions?.[language?.toLowerCase()];
    return acc + (questions?.length || 0);
  }, 0);
};

/**
 * Check if exam is in composite mode
 * @param {Object} examData - Exam data
 * @returns {boolean} True if composite mode
 */
export const isCompositeMode = (examData) => {
  if (!examData) return false;
  return (
    examData?.time?.toLowerCase() === "composite" ||
    examData?.examineMode?.toLowerCase() === "composite"
  );
};

// ==================== CALCULATION FUNCTIONS ====================

/**
 * Calculate section statistics
 * @param {Object} params - Calculation parameters
 * @returns {Object} Section statistics
 */
export const calculateSectionStats = ({
  section,
  selectedOptions,
  visitedQuestions,
  markedForReview,
  startIndex,
  endIndex,
}) => {
  const sectionLength = endIndex - startIndex;

  // Answered questions
  const answered = selectedOptions
    .slice(startIndex, endIndex)
    .filter((option) => option !== undefined && option !== null).length;

  // Visited questions
  const visited = visitedQuestions.filter(
    (index) => index >= startIndex && index < endIndex,
  ).length;

  // Marked for review
  const reviewed = markedForReview.filter(
    (index) => index >= startIndex && index < endIndex,
  ).length;

  return {
    total: sectionLength,
    answered,
    notAnswered: sectionLength - answered,
    visited,
    notVisited: sectionLength - visited,
    reviewed,
    skipped: visited - answered,
  };
};

/**
 * Calculate question score based on answer
 * @param {Object} params - Score parameters
 * @returns {number} Question score
 */
export const calculateQuestionScore = ({
  selectedOption,
  correctAnswer,
  plusMark,
  minusMark,
}) => {
  if (selectedOption === null || selectedOption === undefined) {
    return 0;
  }

  return selectedOption === correctAnswer ? plusMark : -minusMark;
};

/**
 * Calculate section accuracy
 * @param {number} correct - Number of correct answers
 * @param {number} attempted - Number of attempted questions
 * @returns {number} Accuracy percentage
 */
export const calculateAccuracy = (correct, attempted) => {
  if (attempted === 0) return 0;
  return (correct / attempted) * 100;
};

/**
 * Calculate time taken for current section
 * @param {Object} params - Time calculation parameters
 * @returns {number} Time in seconds
 */
export const calculateSectionTimeTaken = ({
  isComposite,
  totalSectionTime,
  timeminus,
  previousTime,
  sectionTimes,
  currentSessionStart,
  sectionIndex,
}) => {
  if (!isComposite) {
    // Sectional mode: total time - remaining time
    return Math.max(0, totalSectionTime - timeminus);
  } else {
    // Composite mode: sum of all accumulated times
    const time1 = previousTime || 0;
    const time2 = sectionTimes?.[sectionIndex] || 0;
    const now = new Date();
    const timeSpentThisSession = Math.floor((now - currentSessionStart) / 1000);
    return time1 + time2 + timeSpentThisSession;
  }
};

// ==================== DATA FORMATTING ====================

/**
 * Format answer data for a single question
 * @param {Object} params - Question parameters
 * @returns {Object} Formatted answer data
 */
export const formatQuestionAnswer = ({
  question,
  selectedOption,
  questionTimes,
  absoluteIndex,
  visitedQuestions,
  section,
}) => {
  const isVisited = visitedQuestions?.includes(absoluteIndex) ? 1 : 0;
  const notVisited = isVisited === 1 ? 0 : 1;
  const questionTime = formatTime(questionTimes[absoluteIndex] || 0);

  const score = calculateQuestionScore({
    selectedOption,
    correctAnswer: question?.answer,
    plusMark: section.plus_mark,
    minusMark: section.minus_mark,
  });

  return {
    question: question?.question,
    options: question?.options || [],
    answer: question?.answer,
    common_data: question?.common_data,
    correct: question?.answer === selectedOption ? 1 : 0,
    explanation: question?.explanation || "",
    selectedOption: selectedOption,
    q_on_time: questionTime,
    isVisited,
    NotVisited: notVisited,
    score,
  };
};

// ==================== API HELPERS ====================

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxAttempts - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Result of function
 */
export const retryAsync = async (fn, maxAttempts = 3, delay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
};

/**
 * Create a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;

  return function debounced(...args) {
    clearTimeout(timeoutId);

    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(func.apply(this, args));
      }, delay);
    });
  };
};

// ==================== LOGGER ====================

/**
 * Production-safe logger
 * @param {string} level - Log level (info, warn, error)
 * @param {string} message - Log message
 * @param {*} data - Additional data
 */
export const logger = {
  info: (message, data) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`ℹ️ ${message}`, data || "");
    }
  },

  warn: (message, data) => {
    console.warn(`⚠️ ${message}`, data || "");
  },

  error: (message, error) => {
    console.error(`❌ ${message}`, error || "");
    // In production, send to error tracking service (e.g., Sentry)
  },

  success: (message, data) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ ${message}`, data || "");
    }
  },
};
