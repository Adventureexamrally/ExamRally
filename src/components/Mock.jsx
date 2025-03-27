import React, { useState, useEffect } from 'react';

const Mock = () => {
  const [timeLeft, setTimeLeft] = useState(12 * 60 + 7); // 12 minutes and 7 seconds
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>English Language</div>
        <div>Time Left: {formatTime(timeLeft)}</div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div>Q: 9 / 100</div>
        <div style={{ margin: '10px 0' }}>
          The chef added a ______ blend of spices to the dish, enhancing its flavor and aroma.
        </div>
        <div>
          {['pungent', 'bland', 'delicate', 'bitter', 'sour'].map((option, index) => (
            <div key={index} style={{ margin: '5px 0' }}>
              <label>
                <input
                  type="radio"
                  name="option"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button>Previous</button>
        <button>Next</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>Answered: 3</div>
        <div>Not Answered: 6</div>
        <div>Marked for Review: 0</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
        {Array.from({ length: 28 }, (_, i) => (
          <div key={i + 1} style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mock;