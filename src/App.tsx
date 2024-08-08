import React from 'react';
import logo from './logo.svg';
import './App.css';
import NotificationButton from './components/NotificationButton';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <NotificationButton />
      </header>
    </div>
  );
}

export default App;
