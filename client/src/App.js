import React from 'react';
import Header from '../src/components/Header';
import { Routes } from '../src/components/Routes';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <div>

        <div>
          <Header />
          <Routes />
        </div>
    </div>
  );
}

export default App;
