import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Header name="react" />,
    document.querySelector('header')
  )

  ReactDOM.render(
    <Footer name="footer" />,
    document.querySelector('footer')
  )
})
