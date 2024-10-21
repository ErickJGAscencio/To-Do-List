import { useEffect, useRef } from 'react';
import { FaEllipsisH } from 'react-icons/fa';

export function ContextMenu({ isVisible, toggleMenu, menuRef, children }) {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      toggleMenu(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="button-menu" onClick={() => toggleMenu(isVisible)}>
      <FaEllipsisH />
      {isVisible && (
        <div className="context-menu" ref={menuRef}>
          {children}
        </div>
      )}
    </div>
  );
}
