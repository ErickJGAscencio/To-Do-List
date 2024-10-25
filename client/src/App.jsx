import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import { Navigation } from './components/Navigation';

import { LogInPage } from './pages/LogInPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ProjectPage } from './pages/ProjectPage';

function App() {
  const [filter, setFilter] = useState('all');
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <>
          <Navigation filter={filter}/>
        </>
      )}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path='*' element={<Navigate to="/home" />} />
            <Route path='/home' element={<HomePage filter={filter} />} />
            <Route path='/home/project/:id' element={<ProjectPage />} />
          </>
        ) : (
          <>
            <Route path='*' element={<Navigate to="/login" />} />
            <Route path='/login' element={<LogInPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/home/project/:id' element={<ProjectPage />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;