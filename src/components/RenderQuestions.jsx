import React, { Component } from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';

class RenderQuestions extends Component {
  constructor() {
    super();
    this.dificultyLevel = this.dificultyLevel.bind(this);
  }

  sortArr(arr) {
    const outPut = arr;
    for (let index = outPut.length; index > 0; index -= 1) {
      const index2 = Math.floor(Math.random() * (index));
      const temp = outPut[index];
      outPut[index] = outPut[index2];
      outPut[index2] = temp;
    }
    return outPut;
  }

  dificultyLevel(string) {
    const LEVEL_MAX = 3;
    switch (string) {
    case 'easy':
      return 1;
    case 'medium':
      return 2;
    case 'hard':
      return LEVEL_MAX;
    default:
      break;
    }
  }

  handleAnswerClick(event, questionLevel) {
    const { checkAnswer } = this.props;
    checkAnswer(event, questionLevel);
    const correct = document.getElementsByClassName('correct-answer');
    correct[0].style.border = '3px solid rgb(6, 240, 15)';
    const incorrect = document.querySelectorAll('.wrong-answer');
    for (let i = 0; i < incorrect.length; i += 1) {
      incorrect[i].style.border = '3px solid rgb(255, 0, 0)';
    }
  }

  renderQuestion() {
    const { apiResult, question, timeOut } = this.props;
    const { results } = apiResult;
    if (results === undefined) return;
    const currQuestion = results[question];
    const { difficulty } = currQuestion;
    const questionLevel = this.dificultyLevel(difficulty);
    const correctQuestion = (
      <button
        disabled={ timeOut }
        key={ 5 }
        type="button"
        data-testid="correct-answer"
        onClick={ (event) => this.handleAnswerClick(event, questionLevel) }
        className="correct-answer"
      >
        {currQuestion.correct_answer}
      </button>);
    const arrayInCorretAnswers = currQuestion.incorrect_answers
      .map((answer, index) => (
        <button
          type="button"
          key={ index }
          disabled={ timeOut }
          data-testid={ `wrong-answer-${index}` }
          onClick={ (event) => this.handleAnswerClick(event, questionLevel) }
          className="wrong-answer"
        >
          { answer }
        </button>
      ));
    const arrayAllAnswers = arrayInCorretAnswers.concat(correctQuestion);
    const arrsort = this.sortArr(arrayAllAnswers);
    return (
      <div>
        <p data-testid="question-category">{currQuestion.category}</p>
        <h2 data-testid="question-text">{currQuestion.question}</h2>
        { arrsort }
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderQuestion()}
      </div>
    );
  }
}
const mapStateToProps = ({ apiResponse: { apiResult }, player: { timeOut } }) => ({
  apiResult,
  timeOut,
});

RenderQuestions.propTypes = {
  apiResult: Proptypes.arrayOf(Object),
}.isRequired;

export default connect(mapStateToProps)(RenderQuestions);