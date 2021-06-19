import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { setQuestions } from '../redux/actions/setQuestions';
import './GameQuestion.css';
import { setScore } from '../redux/actions/setScore';

class GameQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionNumber: 0,
      answerClicked: false,
      time: 30,
      userPoints: 0,
      assertions: 0,
      redirect: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.stopInterval = this.stopInterval.bind(this);
    this.createStore = this.createStore.bind(this);
  }

  componentDidMount() {
    this.handleTime();
    this.createStore();
  }

  componentDidUpdate() {
    this.stopInterval();
  }

  setAnswer(incorrects, correct) {
    const { answerClicked, time } = this.state;
    const incorrectsElements = incorrects.map(
      (incorrect, index) => (
        <button
          type="button"
          key={ incorrect }
          data-testid={ `wrong-answer-${index}` }
          name="incorrectAnswer"
          className={ answerClicked ? 'incorrect' : null }
          onClick={ this.handleClick }
          disabled={ time < 1 }
        >
          {this.decode(incorrect)}
        </button>
      ),
    );
    const correctElement = (
      <button
        type="button"
        data-testid="correct-answer"
        key={ correct }
        name="correctAnswer"
        className={ answerClicked ? 'correct' : null }
        onClick={ this.handleClick }
        disabled={ time < 1 }
      >
        {this.decode(correct)}
      </button>
    );
    incorrectsElements.splice(2, 0, correctElement);
    return incorrectsElements;
  }

  decode(text) {
    const txt = document.createElement('textarea');
    txt.innerHTML = text;
    return txt.value;
  }

  stopInterval(answered) {
    const { time } = this.state;
    if (time < 1 || answered) {
      clearInterval(this.time);
    }
  }

  createStore() {
    const { userName, userEmail } = this.props;
    const { userPoints, assertions } = this.state;
    const state = {
      player: {
        userName,
        assertions,
        score: userPoints,
        userEmail,
      },
    };
    localStorage.setItem('state', JSON.stringify(state));
  }

  handleClick({ target }) {
    const { questions } = this.props;
    const { questionNumber, time, userPoints } = this.state;
    let difficulty;
    const hard = 3;
    let points = userPoints;
    const assert = 10;
    switch (questions[questionNumber].difficulty) {
    case 'hard':
      difficulty = hard;
      break;
    case 'medium':
      difficulty = 2;
      break;
    case 'easy':
      difficulty = 1;
      break;
    default:
      difficulty = 0;
    }
    if (target.name === 'correctAnswer') {
      points += assert + (time * difficulty);
      this.setState((prev) => ({
        assertions: prev.assertions + 1,
        userPoints: points,
      }), () => this.createStore());
    }
    this.setState({
      answerClicked: true,
    });
    this.stopInterval(true);
  }

  handleTime() {
    const magicNumber = 990;
    this.time = setInterval(() => {
      this.setState((prev) => ({
        time: prev.time - 1,
      }));
    }, magicNumber);
  }

  handleNext() {
    const { questions } = this.props;
    const { questionNumber } = this.state;
    const maxQuestions = 5;
    if (questionNumber === questions.length - 1) {
      this.setState({
        redirect: true,
      });
      return;
    }
    if (questionNumber < maxQuestions) {
      this.setState({
        questionNumber: questionNumber + 1,
        time: 30,
        answerClicked: false,
      }, () => this.handleTime());
    }
  }

  render() {
    const { fetchQuestions, token, loading, questions, sendScore } = this.props;
    const { questionNumber, time, answerClicked,
      redirect, assertions, userPoints,
    } = this.state;
    if (loading) {
      fetchQuestions(token);
      return <h2>Loading...</h2>;
    }
    if (redirect) {
      const score = { assertions, score: userPoints };
      sendScore(score);
      return <Redirect to="/feedback" />;
    }
    this.createStore();
    return (
      <div>
        <h2>Pergunta</h2>
        <h4>
          Tempo:
          { time }
        </h4>
        <p data-testid="question-category">
          Categoria:
          { questions && this.decode(questions[questionNumber].category) }
        </p>
        <p data-testid="question-text">
          { questions && this.decode(questions[questionNumber].question) }
        </p>
        <div>
          { questions && this.setAnswer(
            questions[questionNumber].incorrect_answers,
            questions[questionNumber].correct_answer,
          )}
        </div>
        {answerClicked && (
          <button
            type="button"
            onClick={ this.handleNext }
            data-testid="btn-next"
          >
            Próxima
          </button>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchQuestions: (token) => dispatch(setQuestions(token)),
  sendScore: (score) => dispatch(setScore(score)),
});

const mapStateToProps = (state) => ({
  token: state.token.obj.token,
  loading: state.questions.loading,
  questions: state.questions.questions,
  userName: state.userData.name,
  userEmail: state.userData.email,
});

GameQuestions.propTypes = {
  fetchQuestions: PropTypes.func,
  sendScore: PropTypes.func,
  token: PropTypes.string,
  loading: PropTypes.bool,
  questions: PropTypes.arrayOf({}),
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(GameQuestions);