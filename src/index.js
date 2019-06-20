import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Ordering of CSS matters. Here is where you could put the rythm in typology
import 'bootstrap/dist/css/bootstrap.css';
import './index.css'

ReactDOM.render(
  <App />,

  document.getElementById('root')
);
registerServiceWorker();

if (module.hot) {
  module.hot.accept()
}
