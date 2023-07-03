import { useState } from "react";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from 'react-router-dom';

import { Link} from "react-router-dom";

 function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      navigate('/');
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