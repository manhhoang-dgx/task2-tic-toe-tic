const scoreView = document.querySelector(".score-view");
const scoreViewX = document.querySelector("#score-view-x");
const scoreViewY = document.querySelector("#score-view-y");
const scoreX = document.querySelector("#score-x");
const scoreY = document.querySelector("#score-y");

const whosTurn = document.querySelector(".whos-turn");
const whosTurnText = document.querySelector(".whos-turn-text");
const whosTurnInfo = document.querySelector("#whos-turn-info");

const playGrid = document.querySelector(".play-grid");
const cells = document.querySelectorAll(".cell");
const playResult = document.querySelector(".play-result");
const tickWinner = document.querySelector("#tick-winner");
const textWinner = document.querySelector("#text-winner");

const restartBtn = document.querySelector("#restart");

let ticks = document.querySelectorAll(".tick");
let gridMem = [];
let xTurn = true;
let ticked = 0;
let scoreXValue = 0;
let scoreYValue = 0;
startGame();

function checkWinner() {
  let winner = 0;
  for (let i = 0; i < 3; i++) {
    let j = i * 3;
    if (gridMem[j] == gridMem[j + 1] && gridMem[j] == gridMem[j + 2]) {
      winner = gridMem[j];
      break;
    }
    if (gridMem[i] == gridMem[i + 3] && gridMem[i] == gridMem[i + 6]) {
      winner = gridMem[i];
      break;
    }
  }
  if (gridMem[0] == gridMem[4] && gridMem[0] == gridMem[8]) {
    winner = gridMem[0];
  }
  if (gridMem[2] == gridMem[4] && gridMem[2] == gridMem[6]) {
    winner = gridMem[2];
  }
  return winner;
}

function changeWhosTurn() {
  whosTurnText.textContent = "Lượt của";
  if (xTurn) {
    whosTurnInfo.textContent = "X";
    scoreViewX.classList.add("score-turn");
    scoreViewY.classList.remove("score-turn");
  } else {
    whosTurnInfo.textContent = "O";
    scoreViewY.classList.add("score-turn");
    scoreViewX.classList.remove("score-turn");
  }
}

function cellClickedHandler(e) {
  console.log(e.currentTarget.classList);
  let id = Number(e.currentTarget.id.replace(/[^0-9]/g, ""));
  console.log(id);
  console.log(gridMem[id]);
  if (gridMem[id]) return;

  ticked++;
  let tmp = document.createElement("div");
  tmp.classList.add("tick");
  if (xTurn) {
    gridMem[id] = 1;
    tmp.classList.add("tick-x");
  } else {
    gridMem[id] = 2;
    tmp.classList.add("tick-y");
  }

  xTurn = !xTurn;
  e.currentTarget.appendChild(tmp);
  let winner = checkWinner();
  if (winner) {
    console.log("Winner is " + winner);
    cells.forEach((cell) => {
      cell.removeEventListener("click", cellClickedHandler);
    });
    if (winner === 1) {
      scoreXValue++;
      scoreX.textContent = scoreXValue;
      tickWinner.textContent = "X";
    }
    if (winner === 2) {
      scoreYValue++;
      scoreY.textContent = scoreYValue;
      tickWinner.textContent = "O";
    }
    textWinner.textContent = "Chiến thắng";
    playGrid.classList.add("game-over");
    playResult.classList.add("play-result-game-over");
    return;
  }
  if (ticked === 9) {
    playGrid.classList.add("game-over");
    playResult.classList.add("play-result-game-over");
    tickWinner.textContent = "X O";
    textWinner.textContent = "Hòa";
  }

  changeWhosTurn();
}

function startGame() {
  xTurn = (scoreXValue + scoreYValue) % 2 ? false : true;
  changeWhosTurn();

  ticked = 0;
  gridMem = [];
  playGrid.classList.remove("game-over");
  playResult.classList.remove("play-result-game-over");
  ticks = document.querySelectorAll(".tick");
  ticks.forEach((tick) => tick.remove());
  cells.forEach((cell) => {
    gridMem.push(0);
    cell.addEventListener("click", cellClickedHandler);
  });
}

restartBtn.addEventListener("click", () => {
  startGame();
});
