import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import {auth , provider} from './Firebase';
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
function Login() {
    const [state, dispatch] = useStateValue();

    const signIn = () => {
      auth
        .signInWithPopup(provider)
        .then((result) => {
          console.log(result);
          dispatch({
            type: actionTypes.SET_USER,
            user: result.user,
          });
        })
        .catch((error) => alert(error.message));
    };
    const signInDemo=()=>{
      dispatch({
        type: actionTypes.SET_USER,
        user: "demo",
      });
    };
  return (
    <div className='login'>
        <div className='login__container'>
            <img src="/images/logo1.png" alt=""></img>
            <h1> AI DOCTOR</h1>
            <Button onClick={signIn}>Sign in with Google</Button>
            <br></br>
            <Button onClick={signInDemo}>Demo User</Button> 
        </div>

    </div>
  )
}

export default Login