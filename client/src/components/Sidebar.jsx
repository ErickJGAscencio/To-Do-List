import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FaSignOutAlt, FaCogs, FaThList, FaClipboardCheck, FaHourglassHalf } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

export function Sidebar({ setFilter, children }) {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="aside">
      <div>
        {/* Profile section */}
        <div>{children}</div>
        <hr />
        <div className="main-buttons">
          {/* Aquí están los botones estáticos */}
          <p className="create-btn" onClick={() => setFilter('all')}>
            <FaThList /> All
          </p>
          <p className="create-btn" onClick={() => setFilter('completed')}>
            <FaClipboardCheck /> Completed
          </p>
          <p className="create-btn" onClick={() => setFilter('inProgress')}>
            <FaHourglassHalf /> In Progress
          </p>
        </div>
      </div>

      <div className="aux-buttons">
        <p onClick={handleLogout}><FaSignOutAlt size={15} /></p>
        <p><FaCogs size={15} /></p>
      </div>
    </div>
  );
}
