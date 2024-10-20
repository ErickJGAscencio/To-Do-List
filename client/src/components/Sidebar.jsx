import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FaSignOutAlt, FaCogs, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
// import CreateProject from './modal/CreateProject';

export function Sidebar({ buttons, children }) {
  const { username } = useContext(AuthContext);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="aside">
      <div>
        {/* <div className="profile">
          <img
            src="https://th.bing.com/th/id/OIP._ezwdDr0iyZSMAn-BTFHUwHaFj?rs=1&pid=ImgDetMain"
            alt="" />
          <div>{username}</div>
        </div> */}
        {children}
        <hr />
        <div className="main-buttons">
          {buttons.map(({ label, onClick, icon: Icon }, index) => (
            <p key={index} className="create-btn" onClick={onClick}>
              <Icon /> {label}
            </p>
          ))}
        </div>
      </div>

      <div className="aux-buttons">
        <p onClick={handleLogout}><FaSignOutAlt size={15} /></p>
        <p><FaCogs size={15} /></p>
      </div>
    </div>
  )

}