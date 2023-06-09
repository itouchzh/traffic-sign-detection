import React from 'react';
import routes from './router';
import { useRoutes } from 'react-router-dom';
import './App.scss'
function App() {
  const outlet = useRoutes(routes)
  return (
    <div className="App">
      {outlet}
    </div>
  );
}

export default App;
