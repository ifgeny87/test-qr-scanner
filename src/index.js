import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

window.addEventListener('error', event => {
	console.error('%c*** event=', 'background: #eee; color: blue', event);
	alert(event.message);
});

window.addEventListener('unhandledrejection', error => {
	console.error('%c*** event=', 'background: #eee; color: blue', error);
	alert(error.message || error.reason);
});

window.addEventListener('rejectionhandled', error => {
	console.error('%c*** event=', 'background: #eee; color: blue', error);
	alert(error.message || error.reason);
});

