import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

const About = () => {
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
      <h1>This is About Page</h1>
    </div>
  );
};

export default About;
