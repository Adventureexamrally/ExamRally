import React, { useEffect, useState } from 'react';
import Api from '../../service/Api';
import { useParams } from 'react-router-dom';
import './Homeliveresult.css';

const Homeliveresult = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.get(`results/getresult/${id}`)
      .then((res) => {
        const data = res.data;
        let filtered = [];

        if (Array.isArray(data)) {
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
      <div className="results-header">
        <h1>Live Competition Results</h1>
        <div className="results-count">{results.length} Participants</div>
      </div>

      <div className="results-list">
        {results.map((result, index) => (
          <div key={index} className={`result-card ${getRankDecoration(result.rank)}`}>
            <div className="rank-display">
              <div className="rank-number">{result.rank}</div>
              {result.rank <= 3 && <div className="rank-crown"></div>}
            </div>
            
            <div className="participant-info">
              <div className="participant-email">{result.email}</div>
            </div>
            
            <div className={`score-display ${result.o_score > 0 ? 'positive' : 'negative'}`}>
              {result.o_score > 0 ? '+' : ''}{result.o_score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homeliveresult;