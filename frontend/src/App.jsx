import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Tasks from './components/Tasks';
import Home from './components/Home';


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