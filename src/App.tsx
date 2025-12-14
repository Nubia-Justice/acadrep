import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SchoolSetup from './pages/SchoolSetup';
import ClassManagement from './pages/ClassManagement';
import ClassSubjects from './pages/ClassSubjects';
import PupilManagement from './pages/PupilManagement';
import MarksEntry from './pages/MarksEntry';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="school" element={<SchoolSetup />} />
          <Route path="classes" element={<ClassManagement />} />
          <Route path="classes/:classId/subjects" element={<ClassSubjects />} />
          <Route path="pupils" element={<PupilManagement />} />
          <Route path="marks" element={<MarksEntry />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
