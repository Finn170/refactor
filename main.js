import { calculateWinner } from "./winner";

/**
 * CONSTANTS
 */
const classNames = {
  step: "js-step",
};

const selectors = {
  square: ".js-square",
  status: ".js-status",
  history: ".js-history",
  step: `.${classNames.step}`,
};
const status = {
  next: "Next player: [[player]]",
  winner: "Winner is [[player]]",
};

/**
 * Refactor: make the squares array more readable
 */
const history = [
  { squares: [null, null, null, null, null, null, null, null, null] },
];
const activePlayer = "X";
const stepNumber = 0;
const hasWinner = false;

/**
 * Remove all history values after clicked button index
 */
const removeHistoryValues = () => {
  history.splice(stepNumber);

  setHistory();
};

/**
 * Print clicked values that are stored in the history
 */
const printSelectedValues = () => {
  const squares = document.querySelectorAll(selectors.square);
  const current = history[stepNumber];

  squares.forEach((element, index) => {
    const value = current.squares[index];

    if (value === null) {
      return;
    }

    element.innerHTML = value;
  });
};

/**
 * Navigate to previous step
 *
 * @param {String} step
 */
const goToStep = (step) => {
  stepNumber = Number(step);

  setNextPlayer();
  printSelectedValues();
  removeHistoryValue();
  setStatus();
};

/**
 * Get all previous steps
 *
 * @returns Array
 */
const getSteps = () => {
  let count = 0;
  const steps = history.map((_step, move) => {
    if (count === stepNumber) {
      return;
    }

    const description = move ? `Go to move #${move}` : "Go to game start";
    const item = `<li>
      <button class="step js-step" data-step="${move}">${description}</button>
    </li>`;

    count++;

    return item;
  });

  return steps.filter((o) => o !== undefined);
};

/**
 * Print list of previous steps
 */
const setHistory = () => {
  const historyElement = document.querySelector(selectors.history);
  const steps = getSteps();

  historyElement.innerHTML = `<ol class="history-list">${steps.join("")}</ol>`;
};

/**
 * Make visible which player is next or has won
 */
const setStatus = () => {
  const statusElement = document.querySelector(selectors.status);
  const string = hasWinner ? status.winner : status.next;

  statusElement.innerHTML = string;
};

/**
 * Pass the turn to the next player
 * All even stepNumbers should return X
 *
 * @returns X or O
 */
const setNextPlayer = () => {
  activePlayer = stepNumber % 2 === 0 ? "O" : "X";
};

/**
 * Store clicked value
 * Set next player
 * Count the steps
 *
 * @param {HTMLElement} target
 */
const clickHandlers = ({ target }) => {
  const id = Number(target.getAttribute("data-id"));

  const localHistory = history.slice(0, stepNumber + 1);
  const current = localHistory[localHistory.length - 1];
  const squares = current.squares.slice();

  if (calculateWinner(squares)) {
    return;
  }

  squares[id] = activePlayer;

  history = localHistory.concat([
    {
      squares: squares,
    },
  ]);
  stepNumber = localHistory.length;

  printSelectedValues();

  hasWinner = calculateWinner(squares);

  setNextPlayer();
  setStatuss(hasWinner);
  setHistory();
};

/**
 * Bind click event to elements
 *
 * @param {HTMLElement} element
 */
const bind = (element) => {
  element.addEventListener("click", clickHandler);

  document.addEventListener("click", ({ target }) => {
    if (target && target.classList.contains(classNames.step)) {
      goToStep(target.getAttribute("data-step"));
    }
  });
};

/**
 * Initialize the game
 */
const init = () => {
  const squares = document.querySelectorAll(selectors.square);

  squares.forEach(bind);

  setStatus();
};
