import React from 'react'

function Button({ label, handle, classStyle }) {
  return (
    <button className={ classStyle } onClick={handle}>
      {label}
    </button>
  );
}

export default Button;