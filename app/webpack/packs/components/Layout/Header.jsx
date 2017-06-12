import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import NavToggle from './NavToggle'

import Axios from 'axios'
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch } from 'react-axios'

// Components
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false};
    this.toggleClass = this.toggleClass.bind(this);
  }
  toggleClass() {
    this.setState({ active: !this.state.active });
  };
  render() {
    const {name} = this.props;
    return (
      <header className={name}>
        <Get url="/application.json">
          {(error, response, isLoading) => {
          if(error) {
            return (<div>Something bad happened: {error.message}</div>)
          }
          else if(isLoading) {
            return (<div>Loading...</div>)
          }
          else if(response !== null) {
            return (
              <ul>
                {response.data.map((link, id) => (
                    <li key={id}>Hello, {link.name}!</li>
                ))}
              </ul>
            )
          }
          return (<div>Default message before request is made.</div>)
        }}
      </Get>
        <nav>
          <a href="#">{name}</a>
          <a href="/pages">Pages</a>
          <NavToggle toggleClass={this.toggleClass} active={this.state.active}/>
        </nav>
      </header>
    )
  }
}

// Prop Management
Header.defaultProps = {
  name: 'David'
}

Header.propTypes = {
  name: PropTypes.string
}
