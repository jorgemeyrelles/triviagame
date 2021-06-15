import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      name: '',
      disabled: true,
    };
    this.handleButton = this.handleButton.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async handleChange({ target }) {
    const { name, value } = target;
    await this.setState({
      [name]: value,
    });
    this.handleButton();
  }

  handleButton() {
    const { name, email } = this.state;
    if (name.length > 0 && email.length > 0) {
      this.setState({
        disabled: false,
      });
    } else {
      this.setState({
        disabled: true,
      });
    }
  }

  async handleClick() {
    const { history } = this.props;
    const key = await fetch('https://opentdb.com/api_token.php?command=request');
    const token = await key.json();
    localStorage.setItem('token', token.token);
    history.push('/trivia');
  }

  preventLink(event) {
    event.preventDefault();
  }

  render() {
    const { name, email, disabled } = this.state;
    return (
      <form>
        <label htmlFor="name">
          <input
            name="name"
            id="name"
            type="text"
            placeholder="name"
            value={ name }
            data-testid="input-player-name"
            onChange={ (event) => this.handleChange(event) }
          />
        </label>
        <label htmlFor="email">
          <input
            name="email"
            id="email"
            type="text"
            placeholder="email"
            value={ email }
            data-testid="input-gravatar-email"
            onChange={ (event) => this.handleChange(event) }
          />
        </label>
        <button
          disabled={ disabled }
          data-testid="btn-play"
          type="button"
          onClick={ this.handleClick }
        >
          jogar
        </button>
        <button
          data-testid="btn-settings"
          type="button"
        >
          <Link
            to="/settings"
          >
            Configurações
          </Link>
        </button>
      </form>
    );
  }
}

Login.propTypes = {
  history: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default Login;