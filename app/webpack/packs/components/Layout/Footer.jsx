import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// Components
const Footer = props => (
  <footer className={props.name}>
    <nav>
      <a href="#">Home</a>
      <a href="/pages">Pages</a>
    </nav>
  </footer>
)


// Prop Management
Footer.defaultProps = {
  name: 'David'
}

Footer.propTypes = {
  name: PropTypes.string
}

export default Footer;
