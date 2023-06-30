import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="navbar">
      <h1>Audify</h1>
      <div className="links">
        <NavLink to="/">Home</NavLink>
        {user ? (
          <span className="user-email">{user.email}</span>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
        <button onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
};

export default Navbar;