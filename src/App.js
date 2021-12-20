import './App.css';
import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import NavBar from './Components/NavBar';
import Home from './Components/Home';
import About from './Components/About';
import NoteState from './context/notes/NotesState';
import Alert from './Components/Alert';
import Login from './Components/Login';
import SignUp from './Components/SignUp';

function App() {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type)=>{
      setAlert({
        msg: message,
        type: type
      })
      setTimeout(() => {
          setAlert(null);
      }, 1500);
  }

  // const message = "Message"
  return (
    <>
      <NoteState>
        <Router>
          <NavBar />
          <Alert alert={alert}/>
          <div className="container">
            <Switch>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/login">
                <Login showAlert={showAlert}/>
              </Route>
              <Route exact path="/signup">
                <SignUp showAlert={showAlert}/>
              </Route>
              <Route exact path="/">
                <Home showAlert={showAlert}/>
              </Route>
            </Switch>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;
