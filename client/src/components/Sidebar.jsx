import { useNavigate } from 'react-router-dom';
import { useContext, useRef } from 'react';
import { FaSignOutAlt, FaCogs, FaThList, FaClipboardCheck, FaHourglassHalf, FaPlus, FaEye } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ContextMenu } from './ContextMenu';

export function Sidebar({ id, setFilter, children }) {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="aside">
      <div>
        <div>{children}</div>
        <hr />
        <div className="main-buttons">
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
      {id && (
        <div> asd</div>
      )}
      
      <div className="aux-buttons" >
        {/* Profile section */}
        <div style={{ color: "white" }}>{username}
        </div>

        <ContextMenu items={["Config account"]} isVisible={true} menuRef={menuRef}>
          <FaEye size={15} />
        </ContextMenu>
        <FaSignOutAlt className='button-menu' size={15} onClick={handleLogout}/>
      </div>
    </div>
  );
}
