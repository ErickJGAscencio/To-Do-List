import React from 'react'

function Button({ label, handle }) {
  return (
    <button onClick={handle}>
      {label}
    </button>
  );
}

export default Button;