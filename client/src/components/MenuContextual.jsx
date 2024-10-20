import React, { useEffect, useRef, useState } from 'react'
import { FaEllipsisH } from 'react-icons/fa';

function MenuContextual() {
  // Estado para controlar la visibilidad del menú contextual
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsMenuVisible(false);  // Cerrar el menú si se hace clic fuera de él
    }
  };

  // Hook para manejar clics fuera del menú
  useEffect(() => {
    if (isMenuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuVisible]);


  return (
    <div>
      <FaEllipsisH />
      {/* Menú contextual */}
      {isMenuVisible && (
        <div className="context-menu" ref={menuRef}>
          <div className="context-menu-item">
            {/* <EditProject project={project} updateDataProject={updateDataProject} /> */}
          </div>
          <div className="context-menu-item">
            {/* <Delete name={"project " + project.project_name} deleteMethod={deleteMethod} /> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuContextual