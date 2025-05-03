import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LiveSessionModePage from './pages/LiveSessionModePage';
import LiveSessionPage from './pages/LiveSessionPage';
import ParametersPage from './pages/ParametersPage';
import ProfilePage from './pages/ProfilePage';
import LessonDetails from './pages/LessonDetails';
import ParameterDetails from './pages/ParameterDetails';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lessons/:id" element={<LessonDetails />} />
            <Route path="/live-session" element={<LiveSessionModePage />} />
            <Route path="/live-session/:mode" element={<LiveSessionPage />} />
            <Route path="/parameters" element={<ParametersPage />} />
            <Route path="/parameters/:id" element={<ParameterDetails />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;