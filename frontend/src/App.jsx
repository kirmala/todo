import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/register';
import Tasks from './components/Tasks';
import Home from './components/home';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<Home />}
        />
        <Route
          path="/tasks"
          element={
              <Tasks />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;