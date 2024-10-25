import { useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import { FaSignOutAlt, FaCogs, FaThList, FaClipboardCheck, FaHourglassHalf, FaPlus, FaEye, FaExpand, FaExpandArrowsAlt, FaSlidersH, FaChevronCircleDown, FaChevronCircleLeft, FaChevronCircleRight, FaCompress, FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ContextMenu } from './ContextMenu';

export function Sidebar({ id, setFilter, children }) {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado para controlar si el sidebar está retraído o no
  const [isRetraido, setIsRetraido] = useState(false);

  // Estado para controlar si el sidebar está visible o no
  const [isVisible, setIsVisible] = useState(true);

  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
    setIsRetraido(!isRetraido);// Mostrar/ocultar el sidebar
  };

  return (
    <div className={`aside ${isRetraido ? 'retraido' : ''}`}>
{/*       
      <p className="aside-button-switch" onClick={toggleSidebar}>
        {isVisible ? <FaCompressAlt /> : <FaExpandAlt />}
      </p> */}

      {/* {isVisible && (
        <div> */}
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

          
          
          <div className="aux-buttons">
            {/* Profile section */}
            <div style={{ color: "white" }}>{username}</div>

            <ContextMenu items={["Config account"]} isVisible={true} menuRef={menuRef}>
              <FaEye size={15} />
            </ContextMenu>
            <FaSignOutAlt className='button-menu' size={15} onClick={handleLogout} />
          </div>
        {/* </div>
      )} */}
    </div>
  );
}

