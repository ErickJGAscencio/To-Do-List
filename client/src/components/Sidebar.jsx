import { useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import { FaSignOutAlt, FaCogs, FaThList, FaClipboardCheck, FaHourglassHalf, FaPlus, FaEye, FaExpand, FaExpandArrowsAlt, FaSlidersH, FaChevronCircleDown, FaChevronCircleLeft, FaChevronCircleRight, FaCompress, FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ContextMenu } from './ContextMenu';
import SubTitleLabel from './atoms/SubTitleLabel';

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
      {children}
    </div>
  );
}

