import { FaBell, FaCloud, FaUser } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function Navigation({ filter }) {
  const { username } = useContext(AuthContext);

  return (
    <div className="nav">
      <div className='container-nav-user'>
        <FaCloud />
        <h2>WorkCloud</h2>
      </div>
      <div className='container-nav-user'>
        <p className='greeting'>Welcome back, {username}!</p> {/* Aquí he añadido la variable username */}
        <div className="icon-container">
          <FaBell />
          <FaUser />
        </div>
      </div>
    </div>
  );
}
