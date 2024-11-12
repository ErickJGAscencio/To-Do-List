import { FaBell, FaCloud, FaUser } from 'react-icons/fa';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Navigation({ filter }) {
  const navigate = useNavigate();
  const { username, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  
  return (
    <div className="nav">
      <div className='container-nav-user'>
        <FaCloud />
        <h2 id='nav-lg'>WorkCloud</h2>
        <h2 id='nav-mobile'>WrCd</h2>
      </div>
      <div className='container-nav-user'>
        <p className='greeting'>Welcome back, {username}!</p> {/* Aquí he añadido la variable username */}
        <div className="icon-container">
          <FaBell />
          <FaUser onClick={handleLogout} />
        </div>
      </div>
    </div>
  );
}
