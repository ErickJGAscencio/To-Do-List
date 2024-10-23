import { useEffect, useState } from 'react';
import { FaCircle, FaPalette } from 'react-icons/fa';

export function ContextMenuColors({ menuRef, setSelectedColor }) {

  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsVisible(false); // Corregido aquí para cerrar el menú
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

  const colors1 = ['#787878', '#C19F1A', '#3357FF', '#1E930E', '#177CB7', '#7514B5'];
  const colors2 = ['#B51495', '#D9D9D9', '#E1BB23', '#4ADC37', '#DD40BE', '#8F0CE7'];
  const colors3 = ['#D6C376', '#81D676', '#76B3D6', '#D676C3', '#AF58EA'];

  return (
    <div>
      <p className='button' onClick={toggleMenu}><FaPalette /></p>
      {isVisible && (
        <div className="context-menu" ref={menuRef}>
          <div>
            {colors1.map((color, index) => (
              <div key={index} className="context-menu-item" onClick={toggleMenu}>
                <FaCircle
                  style={{ color: color }}
                  onClick={() => setSelectedColor(color)}
                />
              </div>
            ))}
            {colors2.map((color, index) => (
              <div key={index} className="context-menu-item" onClick={toggleMenu}>
                <FaCircle
                  style={{ color: color }}
                  onClick={() => setSelectedColor(color)}
                />
              </div>
            ))}
            {colors3.map((color, index) => (
              <div key={index} className="context-menu-item" onClick={toggleMenu}>
                <FaCircle
                  style={{ color: color }}
                  onClick={() => setSelectedColor(color)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
