import { Children, useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';

export function ContextMenu({ mode, items, menuRef, children }) {

  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };


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
    <div>
      <FaEllipsisH className="button-menu" onClick={toggleMenu} />
      {isVisible && (
        <div className="context-menu" ref={menuRef}>
        {Children.map(children, (child, index) => (
          <div key={index} className="context-menu-item">
            <span>{child}</span>
            <span>{items[index] || null}</span>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
