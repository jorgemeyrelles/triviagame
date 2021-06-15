import React, { Component } from 'react';
import { connect } from 'react-redux';
import { string, func } from 'prop-types';
import { Link } from 'react-router-dom';
import { getToken } from '../actions/index';

class Login extends Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.validInput = this.validInput.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      name: '',
      email: '',
      validation: true,
    };
  }

  async handleClick() {
    const { tokenRequest } = this.props;
    await tokenRequest();
    const { token } = this.props;
    console.log(token);
    localStorage.setItem('token', token);
  }

  validInput() {
    const { email, name } = this.state;
    const re = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/gi;
    this.setState({
      validation: !(re.test(email) && name.length > 1),
    });
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: value,
    });
    this.validInput();
  }

  render() {
    const { name, email, validation } = this.state;

    return (
      <section>
        <label htmlFor="player-name">
          Nome:
          <input
            type="text"
            data-testid="input-player-name"
            name="name"
            id="player-name"
            value={ name }
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="player-email">
          E-mail:
          <input
            type="email"
            data-testid="input-gravatar-email"
            name="email"
            id="player-email"
            value={ email }
            onChange={ this.handleChange }
          />
        </label>
        <Link to="./Game">
          <button
            type="submit"
            onClick={ this.handleClick }
            data-testid="btn-play"
            disabled={ validation }
          >
            Jogar
          </button>
        </Link>
      </section>
    );
  }
}

Login.propTypes = {
  token: string,
  tokenRequest: func,
}.isRequired;

const mapStateToProps = (state) => ({
  token: state.game.token,
});

const mapDispatchToProps = (dispatch) => ({
  tokenRequest: () => dispatch(getToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
