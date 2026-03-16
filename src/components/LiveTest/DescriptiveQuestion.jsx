         <div>
                    {(() => {
  const question =
    examData.section[currentSectionIndex]?.questions?.[
      selectedLanguage?.toLowerCase()
    ]?.[clickedQuestionIndex - startingIndex];

  const wordLimit = question?.words_limit || 0;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // Determine whether user has reached or exceeded the word limit
  const isLimitExceeded = wordCount >= wordLimit;
  

  let displayText = "";
  if (question?.count_type === "decrement") {
    const remainingWords = Math.max(wordLimit - wordCount, 0);
    displayText = `Words Remaining: ${remainingWords}`;
  } else if (question?.count_type === "increment") {
    displayText = `Words Typed: ${wordCount}`;
  }

  // Handle change event: block input if limit is reached
  const handleChange = (e) => {
    const newWords = e.target.value.trim().split(/\s+/).filter(Boolean);
    if (newWords.length <= wordLimit) {
      setText(e.target.value);
    }
  };

  // Prevent copy, cut, paste
  const disableClipboard = (e) => {
    e.preventDefault();
  };

  return question ? (
    <div>
      <textarea
        value={text}
        onChange={handleChange}
        onCut={disableClipboard}
        onCopy={disableClipboard}
        onPaste={disableClipboard}
        placeholder="Enter your text..."
        rows="6"
        cols="80"
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "1rem",
          borderRadius: "8px",
          border: `1px solid ${isLimitExceeded ? "red" : "#ccc"}`,
          resize: "vertical",
          backgroundColor: isLimitExceeded ? "#ffe6e6" : "white",
        }}
      />

      <h1>Word Limit: {wordLimit}</h1>
      <h1>Count Type: {question.count_type}</h1>
      <h2 style={{ color: isLimitExceeded ? "red" : "black" }}>{displayText}</h2>

      {isLimitExceeded && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          Word limit reached. You can't type more words.
        </p>
      )}
      
    </div>
  ) : null;
})()}


                        </div>