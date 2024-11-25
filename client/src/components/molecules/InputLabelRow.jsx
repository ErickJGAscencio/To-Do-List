import React from 'react'
import Input from "../atoms/Input";
import Label from '../atoms/Label';

function InputLabel({label}) {
  return (
    <div>
      <Label label={label}/>
      <Input />
    </div>
  )
}

export default InputLabel