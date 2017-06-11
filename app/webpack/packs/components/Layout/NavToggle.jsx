import React from 'react'

const NavToggle = (props) => {
  const {active, toggleClass} = props;
  return (
    <button
      id="navToggle"
      className={active ? 'active' : null}
      onClick={toggleClass}>
      <span>{active ? 'hey' : ''}</span>
      <span></span>
    </button>
  )
}

export default NavToggle;
