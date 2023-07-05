import {
  createBrowserRouter, 
  createRoutesFromElements,
  Route, 
  RouterProvider
} from 'react-router-dom'

import React from 'react';
import { AccessTokenProvider } from './AccessTokenContext';

import Home from './Home';
import Signup from './signup';
import Login from './login';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route >
      <Route exact path="/" element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login/>} />
    </Route>
  )
)

function App() {
  return (
    <AccessTokenProvider>
      <RouterProvider router={router} />
    </AccessTokenProvider>
  );
}

export default App;