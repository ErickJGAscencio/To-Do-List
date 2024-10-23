import { Children, useEffect, useRef, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';

export function ContextMenu({ items, children }) {
  const menuRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const toggleMenu = (event) => {
    // Posicion clic y ajusta el menú
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    setIsVisible(!isVisible);
    
    if (!isVisible) {
      // Ajuste de posición del menú después de hacer clic
      setTimeout(() => {
        adjustMenuPosition(mouseX, mouseY);
      }, 0);
    }
  };

  const adjustMenuPosition = (mouseX, mouseY) => {
    const menu = menuRef.current;
    if (!menu) return;

    const menuRect = menu.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newLeft = mouseX;
    let newTop = mouseY;

    // Ajustar si se sale por la derecha
    if (mouseX + menuRect.width > windowWidth) {
      newLeft = windowWidth - menuRect.width - 10; // Restamos un margen pequeño
    }

    // Ajustar si se sale por abajo
    if (mouseY + menuRect.height > windowHeight) {
      newTop = windowHeight - menuRect.height - 10;
    }

    setPosition({ top: newTop, left: newLeft });
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {

      setIsVisible(false);
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
        <div
          className="context-menu"
          ref={menuRef}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,            
          }}
        >
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
