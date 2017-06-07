import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import { Header, Footer } from './components/Layout'

const App = () =>
    <div>
      <Header name="react" />
      <Footer name="foot" />
    </div>


document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div')),
  )
})
