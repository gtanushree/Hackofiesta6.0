import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import TrafficAnalysis from './Components/TrafficAnalysis';
import CarPooling from './Components/CarPooling';
import AiPredictions from './Components/AiPredictions';
import NavigateMe from './Components/NavigateMe';
import NotFound from './Components/NotFound'; // Handle 404 pages

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/traffic-analysis" element={<TrafficAnalysis />} />=
        <Route path="/carpooling" element={<CarPooling />} />
        <Route path="/ai-predictions" element={<AiPredictions />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/navigate-me" element={<NavigateMe />} />
      </Routes>
    </Router>
  );
}

export default App;
