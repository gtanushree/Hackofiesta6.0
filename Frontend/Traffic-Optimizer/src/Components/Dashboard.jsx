import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [trafficData, setTrafficData] = useState([]);

  useEffect(() => {
    // Fetch traffic data from backend
    fetch('/traffic/heatmap')
      .then((response) => response.json())
      .then((data) => setTrafficData(data))
      .catch((error) => console.error('Error fetching traffic data:', error));
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div>
        <h3>Traffic Overview</h3>
        <ul>
          {trafficData.map((point, index) => (
            <li key={index}>
              Location: {point.lat}, {point.lon} - Density: {point.density}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;