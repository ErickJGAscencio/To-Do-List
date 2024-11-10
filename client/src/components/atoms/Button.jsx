import React from 'react'

function Button({ handle, disabled, label}) {

  return (
    <button onClick={handle} disabled={disabled}>{label}</button>
  )
}

export default Button