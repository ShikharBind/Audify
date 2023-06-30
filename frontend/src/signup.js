import { useState } from "react";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { useNavigate } from 'react-router-dom';

import { Link} from "react-router-dom";

function Signup() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const navigate = useNavigate();

  const register = async (event) => {
    event.preventDefault();
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
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
            <h3> Register User </h3>
            <input
              placeholder="Email..."
              onChange={(event) => {
                setRegisterEmail(event.target.value);
              }}
            />
            <input
              placeholder="Password..."
              onChange={(event) => {
                setRegisterPassword(event.target.value);
              }}
            />
            <button onClick={register}> Create User </button>
            <p className="message">Not registered? <Link to="/login">login</Link></p>
          </form>

        </div>
      </div>
  );
}

export default Signup;