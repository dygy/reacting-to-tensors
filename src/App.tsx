import React from 'react';
import './App.css';
import {Footer} from "./views/footer/footer";
import {HandposeComponent} from "./views/handpose/handpose.component";
import {useButtonActions} from "./controll/use-button-actions";

function App() {
  const buttonActions = useButtonActions();

  return (
    <div className="App">
      <header className="App-header">
          <HandposeComponent buttonActions={buttonActions} />
      </header>
        <Footer buttonActions={buttonActions} />
    </div>
  );
}

export default App;
