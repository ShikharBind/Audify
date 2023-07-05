import { useState, useContext } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from 'react-router-dom';
import { AccessTokenContext } from './AccessTokenContext';

import { Link} from "react-router-dom";

 function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();
  const { setAccessToken } = useContext(AccessTokenContext);

  const login = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      const user = userCredential.user;
      const accessToken = await user.getIdToken();
      setAccessToken(accessToken);
      
      const response = await fetch("http://localhost:4000/login", {
          headers:{
              Authorization: `Bearer ${accessToken}`,
            },  
          method: "POST",
      });
      if(response.status === 200){
        console.log("login");
        navigate('/');
        console.log(user);
       }
      else{
        console.log("login failed!! Try again");
      }
  
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="login-page">
    <div className="form">
      <form className="register-form">
        <h3>Login</h3>
        <input
          placeholder="Email..."
          onChange={(event) => {
            setLoginEmail(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />
        <button onClick={login}>Login</button>
        <p className="message">
          Already registered? <Link to="/signup">Create Account</Link>
        </p>
      </form>
    </div>
  </div>
  );
}

export default Login;