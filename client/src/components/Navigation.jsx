import { FaBell, FaCloud, FaUser } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Navigation() {
  const navigate = useNavigate();
  const { username, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav">
      <div className='container-nav-user'>
        <FaCloud className='icon-cloud' />
        <h2 id='nav-lg'>WorkCloud</h2>
        <h2 id='nav-mobile'>WkCd</h2>
      </div>
      <div className='container-nav-user'>
        <p className='greeting'>Welcome back, {username}!</p>
        <div className="icon-container">
          <FaBell />
          <FaUser onClick={toggleMenu} />
          {menuOpen && (
            <div className='menu-user'>
              <ul>
                <li>Account</li>
                <li onClick={handleLogout}>Log out</li>
                {/* Puedes agregar más opciones de menú aquí */}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
