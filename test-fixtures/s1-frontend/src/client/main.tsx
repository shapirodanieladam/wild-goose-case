import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecordList } from './components/RecordList';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="app">
      <RecordList />
    </div>
  </React.StrictMode>
);