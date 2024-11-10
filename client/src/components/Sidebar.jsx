import { useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import { FaSignOutAlt, FaCogs, FaThList, FaClipboardCheck, FaHourglassHalf, FaPlus, FaEye, FaExpand, FaExpandArrowsAlt, FaSlidersH, FaChevronCircleDown, FaChevronCircleLeft, FaChevronCircleRight, FaCompress, FaExpandAlt, FaCompressAlt } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { ContextMenu } from './ContextMenu';
import SubTitleLabel from './atoms/SubTitleLabel';

export function Sidebar({ id, setFilter, children }) {
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={'aside'}>
      {children}
    </div>
  );
}

