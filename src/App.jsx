import './App.css';
import { BrowserRouter, Route, NavLink, Routes, Navigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';

import About from './pages/About'
import Contact from './pages/Contact'
import Home from './pages/Home'
import Article from './pages/Article'
import FormArticle from './pages/FormArticle'
import Login from './pages/Login'
import UpdateArticle from './pages/UpdateArticle'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <nav>
          <h1>My Articles</h1>
          {isLoggedIn ? (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/about">About</NavLink>
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/new">New Article</NavLink>
              <span style={{color: '#666', marginLeft: '10px'}}>
                Welcome, {currentUser?.username}!
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  marginLeft: '10px',
                  padding: '4px 10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>

        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/articles/:urlId" element={<Article />} />
              <Route path="/new" element={<FormArticle />} />
              <Route path="/update/:urlId" element={<UpdateArticle />} />
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;