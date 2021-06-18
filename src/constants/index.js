export const API_TRIVIA_TOKEN = 'https://opentdb.com/api_token.php?command=request';
export const API_TRIVIA_QUESTIONS = (amount, token) => `https://opentdb.com/api.php?amount=${amount}&token=${token}`;
export const API_GRAVATAR = (md5Hash) => `https://www.gravatar.com/avatar/${md5Hash}`;

export const LOGIN = 'LOGIN';
export const SET_GRAVATAR = 'SET_GRAVATAR';
export const SET_QUESTIONS = 'SET_QUESTIONS';
export const QUESTIONS_AMOUNT = '5';
export const ONE_SECOND = 1000;
export const GAME_TIMEOUT = 'GAME_TIMEOUT';
export const REQUEST_QUESTIONS = 'REQUEST_QUESTIONS';
export const BASE_SCORE = 10;
export const UPDATE_SCORE = 'UPDATE_SCORE';