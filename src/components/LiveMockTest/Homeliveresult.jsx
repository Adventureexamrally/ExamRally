import React, { useEffect, useState } from 'react';
import Api from '../../service/Api';
import { useParams } from 'react-router-dom';
import './Homeliveresult.css';
import ResultAnimation from '../../animationeffect/ResultAnimation';

const Homeliveresult = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examName, setExamName] = useState('');


  useEffect(() => {
    Api.get(`results/getresult/${id}`)
      .then((res) => {
        const data = res.data;
        let filtered = [];
        setExamName(data.examName || ''); // Set exam name from the response
        console.warn("resultsssssssssssss", data)
        if (Array.isArray(data)) {
          extractedExamName = data.examName || '';
          filtered = data.filter(item => item.status === 'completed');
        } else if (data && data.status === 'completed') {
          filtered = [data];
        } else if (data.results && Array.isArray(data.results)) {
          filtered = data.results.filter(item => item.status === 'completed');
        }

        filtered.sort((a, b) => (a.rank || 0) - (b.rank || 0));
        setResults(filtered);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);
  console.log("results", results);

  const getRankDecoration = (rank) => {
    if (rank === 1) return 'rank-first';
    if (rank === 2) return 'rank-second';
    if (rank === 3) return 'rank-third';
    return '';
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>
  );

  return (
    <div className="results-container">
      {/* <div className="results-header">
        <h1>Live Competition Results</h1>
        <div className="results-count"> Toppers</div>
      </div> */}
      <div className="header-section">
        <div className="header-content">
          <div className="exam-name">{examName || 'Exam Results'}</div>
          <div className="leaderboard-title">Leaderboard</div>
          {/* <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{results.length}</div>
              <div className="stat-label">Participants</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">{
                results.length > 0 ? results[0].fullName : 'N/A'
              }</div>
              <div className="stat-label">Top Performer</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value">{
                results.length > 0 ? `${results[0].o_score || 0}` : '0'
              }</div>
              <div className="stat-label">Top Score</div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className={`result-card ${getRankDecoration(result.rank)}`}>
            <div className="rank-display">
              <div className="rank-number">{index + 1}</div>

            </div>
            <div className="rank-display">
              {/* <div className="rank-number">{result.rank}</div> */}
              {result.rank <= 3 && <div className="rank-crown"></div>}
              <img
                src={result.profilePicture || 'default-profile.png'}
                alt={`${result.fullName || 'Participant'}'s profile`}
                className="profile-picture"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'default-profile.png';
                }}
              />
            </div>

            <div className="participant-info">
              <div className="participant-email">{result.fullName}</div>
            </div>

            <div className={`score-display ${result.o_score == null ? '' : result.o_score > 0 ? 'positive' : 'negative'
              }`}>
              {result.o_score == null ? 'N/A' : `${result.o_score > 0 ? '+' : ''}${result.o_score}`}
            </div>

          </div>
        ))}
      </div>
      {/* Result Animation */}
      <div>
        <ResultAnimation />
      </div>
    </div>
  );
};

export default Homeliveresult;