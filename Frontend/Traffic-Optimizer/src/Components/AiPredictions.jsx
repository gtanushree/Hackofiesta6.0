import React, { useEffect, useState } from 'react';

const AiPredictions = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Fetch AI predictions from backend
    fetch('/ai/predictions')
      .then((response) => response.json())
      .then((data) => setPredictions(data))
      .catch((error) => console.error('Error fetching predictions:', error));
  }, []);

  return (
    <div className="ai-predictions">
      <h2>AI Predictions</h2>
      <div>
        <h3>Traffic Predictions</h3>
        <ul>
          {predictions.map((prediction, index) => (
            <li key={index}>
              Location: {prediction.location} - Predicted Congestion: {prediction.congestion}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AiPredictions;