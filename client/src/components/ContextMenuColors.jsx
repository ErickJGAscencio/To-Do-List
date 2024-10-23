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

  const colors1 = ['#FF6B6B', '#FFD93D', '#4A90E2', '#5DD39E', '#F24C00', '#A97C97'];
  const colors2 = ['#D9534F', '#F7F7F7', '#FFC107', '#28A745', '#E83E8C', '#6F42C1'];
  const colors3 = ['#F5D76E', '#A8D8B9', '#6CB2EB', '#F1A7B2', '#C78DDA'];


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
