import React from 'react';
import { NavLink } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
            <hr />
            <NavLink to="/about">About</NavLink>
            <hr />
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </nav>
      <h1>This is my Home Page</h1>
    </div>
  );
};

export default Home;
