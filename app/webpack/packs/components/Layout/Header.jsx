import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import NavToggle from './NavToggle'

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
