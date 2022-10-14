import React from 'react'
import styles from '../styles/InputField.module.css'
const InputField = ({ label, placeholder, type, input, setInput }) => {
  return (
    <div className={styles.inputFieldContainer}>
      <label className={styles.label} htmlFor={label}>
        {label}
      </label>
      <br />
      <input type={type?type:'text'}
        onChange={setInput}
        value={input}
        className={styles.inputField}
        placeholder={placeholder?placeholder:label}
      />
    </div>
  )
}

export default InputField