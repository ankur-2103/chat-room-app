import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import { useEffect, useState } from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function App() {

  const LOCAL_STORAGE_KEY = "username";
  const[userName, setUserName] = useState("");
  const [name, setName] = useState('');

  useEffect(() => {
    const retriveData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if(retriveData){
      setUserName(retriveData);
    }
  }, []);

  const addUser = () =>{
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(name));
    setUserName(name);
  }

  return (
    <div className="app">
      {!userName ? (
        <Card>
          <CardContent>
            <form  onSubmit={addUser} autoComplete="off">
              <TextField id="standard-basc" label="User-name" onChange={(e) => {setName(e.target.value)}}/>
              <Button onClick={addUser} variant="contained" color="primary" href="#contained-buttons">Next</Button>
            </form>
          </CardContent>
        </Card>
        
      ):(
      <div className="app_body">
      <Router>
      <Sidebar/>
        <Switch>
          <Route path="/rooms/:roomId">
            <Chat username={userName}/>
          </Route>
          <Route path="/">
            <Chat username={userName}/>
          </Route>
        </Switch>
      </Router>
    </div>)}
  </div>
  );
}

export default App;