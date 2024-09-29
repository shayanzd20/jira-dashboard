import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import KanbanBoard from './components/KanbanBoard';
import reportWebVitals from './reportWebVitals';

// This is how you render in React 17
ReactDOM.render(
  <React.StrictMode>
    <KanbanBoard />
  </React.StrictMode>,
  document.getElementById('root') // The root element where your app will be mounted
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
