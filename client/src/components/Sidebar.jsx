import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FaSignOutAlt, FaCogs, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import CreateProject from './modal/CreateProject';

export function Sidebar({ buttons, children }) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="aside">
      <div>
        {children}
        <hr />    
        <div className="main-buttons">
          {buttons.map(({ label, onClick, icon: Icon }, index) => (
            <p key={index} className="create-btn" onClick={onClick}>
              <Icon /> {label}
            </p>
          ))}
        </div>
        <hr />    
      </div>

      <div className="aux-buttons">
        <p onClick={handleLogout}><FaSignOutAlt size={15} /></p>
        <p><FaCogs size={15} /></p>
      </div>
    </div>
  )

}