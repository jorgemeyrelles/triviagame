import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { permutate } from '../services';

class GameQuestion extends Component {
  constructor(props) {
    super();
    const { currentQuestion } = props;
    const answers = [currentQuestion
      .correct_answer, ...currentQuestion.incorrect_answers];
    this.state = {
      sortedQuestions: answers,
    };
    this.sortQuestions = this.sortQuestions.bind(this);
  }

  componentDidUpdate() {
    const { timeExpired, userAnswered, clearButton,
      buttonCleared, shuffle, questionsShuffled } = this.props;
    const btnArr = document.getElementsByClassName('btn');
    if (timeExpired || userAnswered) {
      this.colorButtonsBorder();
      [...btnArr].forEach((btn) => { btn.disabled = true; });
    }
    if (clearButton) {
      buttonCleared();
      this.clearButtonsBorder();
      [...btnArr].forEach((btn) => { btn.disabled = false; });
    }
    if (shuffle) {
      questionsShuffled();
      this.sortQuestions();
    }
  }

  getID(answer) {
    const { currentQuestion } = this.props;
    if (answer === currentQuestion.correct_answer) return 'correct-answer';
    return `wrong-answer-${currentQuestion.incorrect_answers.indexOf(answer)}`;
  }

  sortQuestions() {
    const { currentQuestion } = this.props;
    const answers = [currentQuestion
      .correct_answer, ...currentQuestion.incorrect_answers];
    this.setState({ sortedQuestions: permutate(...answers) });
  }

  clearButtonsBorder() {
    const btnArr = document.getElementsByClassName('btn');
    [...btnArr].forEach((btn) => {
      btn.classList.remove('correct');
      btn.classList.remove('wrong');
    });
  }

  colorButtonsBorder() {
    const btnArr = document.getElementsByClassName('btn');
    [...btnArr].forEach((btn) => {
      if (btn.getAttribute('data-testid') === 'correct-answer') {
        btn.classList.add('correct');
        // TODO I don't think the condition below is necessary
      } else if (btn.getAttribute('data-testid').includes('wrong-answer')) {
        btn.classList.add('wrong');
      }
    });
  }

  render() {
    const { currentQuestion: { category, question },
      userClick } = this.props;
    const { sortedQuestions } = this.state;
    return (
      <div>
        <h3 data-testid="question-category">{category}</h3>
        <h2 data-testid="question-text">{question}</h2>
        {sortedQuestions.map((answer, i) => (
          <button
            type="button"
            className="btn"
            onClick={ userClick }
            data-testid={ this.getID(answer) }
            // TODO shouldn't use index as key
            key={ i }
          >
            {answer}
          </button>
        ))}
      </div>
    );
  }
}

GameQuestion.propTypes = {
  currentQuestion: PropTypes.number,
  sortedQuestions: PropTypes.arrayOf(PropTypes.object),
  timeExpired: PropTypes.bool,
  userAnswered: PropTypes.bool,
  userClick: PropTypes.func,
  clearButton: PropTypes.bool,
  buttonCleared: PropTypes.func,

}.isRequired;

export default GameQuestion;