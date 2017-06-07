import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

export const Header = props => (
  <header className={props.name}>
    <nav>
      <a href="#">Home</a>
      <a href="/pages">Pages</a>
    </nav>
  </header>
)

Header.defaultProps = {
  name: 'David'
}

Header.propTypes = {
  name: PropTypes.string
}

export const Footer = props => (
  <footer className={props.name}>
    <nav>
      <a href="#">Home</a>
      <a href="/pages">Pages</a>
    </nav>
  </footer>
)

Footer.defaultProps = {
  name: 'David'
}

Footer.propTypes = {
  name: PropTypes.string
}
