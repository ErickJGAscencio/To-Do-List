import React from 'react'

function Button ({ label, handle, classStyle, disabled}) {
  return (
    <button 
      onClick={handle} 
      disabled={disabled} 
      className={classStyle}
    >
      {label}
    </button>
  );
};
export default Button;