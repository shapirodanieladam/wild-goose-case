import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecordList } from './components/RecordList';
import { ThemeProvider } from './hooks/useTheme';
import { ThemeToggle } from './components/ThemeToggle';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        <RecordList />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);