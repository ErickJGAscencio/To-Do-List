import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Navigation({ filter }) {
  const { username, isLoggedIn, section } = useContext(AuthContext);

  return (
    <div className="nav">
      <h2>Workloud</h2>
      {/* <div className="profile">
        Hi {isLoggedIn ? username : 'guest'}!
      </div> */}
      <p className="seccion">{section}</p>
    </div>
  )
}