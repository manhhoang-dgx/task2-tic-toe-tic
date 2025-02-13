const playWith = document.querySelector("#play-with");

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

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let ticks = document.querySelectorAll(".tick");
let gridMem = [];
let xTurn = true;
let ticked = 0;
let scoreXValue = 0;
let scoreYValue = 0;
let drawCount = 0;
let machineTick = 0;
let machineFirstTick = 2;
let freshGame = true;
let lastWinnerCheck = [];
let switchPlayer = true;

configFirstGame(playWith.value);

function removeScoreViewEvent() {
  scoreViewX.removeEventListener("click", configMachineFirstTick);
  scoreViewY.removeEventListener("click", configMachineSecondTick);
}

function configMachineFirstTick() {
  removeScoreViewEvent();
  if (!switchPlayer) return;
  machineFirstTick = 2;
  configFirstGame(playWith.value);
}

function configMachineSecondTick() {
  removeScoreViewEvent();
  if (!switchPlayer) return;
  machineFirstTick = 1;
  configFirstGame(playWith.value);
}

function checkWinner() {
  for (let condition of winConditions) {
    if (
      gridMem[condition[0]] === gridMem[condition[1]] &&
      gridMem[condition[0]] === gridMem[condition[2]] &&
      gridMem[condition[0]] !== 0
    ) {
      lastWinnerCheck = condition;
      return gridMem[condition[0]];
    }
  }
  return 0;
}

function changeActiveScoreView(scoreViewNew, scoreViewOld) {
  scoreViewNew.classList.add("score-turn");
  scoreViewOld.classList.remove("score-turn");
}

function changeWhosTurn() {
  whosTurnText.textContent = "Lượt của";
  if (xTurn) {
    whosTurnInfo.textContent = "X";
    changeActiveScoreView(scoreViewX, scoreViewY);
  } else {
    whosTurnInfo.textContent = "O";
    changeActiveScoreView(scoreViewY, scoreViewX);
  }
}

function bestMove(currentTick) {
  for (let i = 0; i < 9; i++) {
    if (gridMem[i] === 0) {
      gridMem[i] = currentTick;
      if (checkWinner() === currentTick) {
        gridMem[i] = 0;
        return i;
      }
      gridMem[i] = 0;
    }
  }
  return -1;
}

function machinePlay() {
  let machineChoice = 4;
  for (let i = 0; i < 9; i++) {
    if (gridMem[i] === 0) {
      machineChoice = i;
    }
  }
  if (ticked < 2) {
    machineChoice = 4;
    if (gridMem[4] !== 0) {
      machineChoice = 1;
    }
  } else {
    let tmp = bestMove(machineTick);
    if (tmp !== -1) return tmp;

    let myTick = machineTick === 1 ? 2 : 1;
    tmp = bestMove(myTick);
    if (tmp !== -1) return tmp;
  }
  return machineChoice;
}

function triggerMachinePlay() {
  if (machineTick === 0) return;
  if (xTurn && machineTick !== 1) return;
  if (!xTurn && machineTick !== 2) return;

  let machineChoice = machinePlay();
  let machineChoiceElemenet = document.querySelector(`#cell-${machineChoice}`);
  let event;
  if (window.CustomEvent && typeof window.CustomEvent === "function") {
    event = new CustomEvent("click");
  }
  setTimeout(() => {
    machineChoiceElemenet.dispatchEvent(event);
  }, 500);
}

function createTick(tickClass, tickImgSrc) {
  let tmp = document.createElement("div");
  tmp.classList.add("tick");
  tmp.classList.add(tickClass);

  let childimg = document.createElement("img");
  childimg.src = tickImgSrc;
  childimg.classList.add("tick-img");
  tmp.appendChild(childimg);
  return tmp;
}

function showWinningCell() {
  lastWinnerCheck.forEach((id) => {
    let tmp = document.querySelector(`#cell-${id}`);
    tmp.classList.add("cell-win");
  });
}

function hideWinningCell() {
  lastWinnerCheck.forEach((id) => {
    let tmp = document.querySelector(`#cell-${id}`);
    tmp.classList.remove("cell-win");
  });
}

function cellClickedHandler(e) {
  switchPlayer = false;
  let id = Number(e.currentTarget.id.replace(/[^0-9]/g, ""));
  if (gridMem[id]) return;

  ticked++;

  let tmp;
  if (xTurn) {
    gridMem[id] = 1;
    tmp = createTick("tick-x", "svg/x-tick-lg.svg");
  } else {
    gridMem[id] = 2;
    tmp = createTick("tick-y", "svg/o-tick-lg.svg");
  }

  xTurn = !xTurn;
  e.currentTarget.appendChild(tmp);
  let winner = checkWinner();

  if (winner) {
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
    textWinner.textContent = "Chiến thắng!";
    showWinningCell();
    setTimeout(() => {
      playGrid.classList.add("game-over");
      playResult.classList.add("play-result-game-over");
    }, 1000);
    return;
  }
  if (ticked === 9) {
    drawCount++;
    tickWinner.textContent = "X O";
    textWinner.textContent = "Hòa!";
    setTimeout(() => {
      playGrid.classList.add("game-over");
      playResult.classList.add("play-result-game-over");
    }, 1000);
    return;
  }

  changeWhosTurn();
  triggerMachinePlay();
}

function startGame() {
  xTurn = (scoreXValue + scoreYValue + drawCount) % 2 ? false : true;
  if (!freshGame) changeWhosTurn();
  freshGame = false;
  ticked = 0;
  gridMem = [];

  hideWinningCell();
  playGrid.classList.remove("game-over");
  playResult.classList.remove("play-result-game-over");
  ticks = document.querySelectorAll(".tick");
  ticks.forEach((tick) => tick.remove());

  cells.forEach((cell) => {
    gridMem.push(0);
    cell.removeEventListener("click", startGame);
    cell.addEventListener("click", cellClickedHandler);
  });

  triggerMachinePlay();
}

function configFirstGame(mode) {
  if (mode === "machine") {
    if (freshGame) {
      whosTurnText.textContent = "Bắt đầu trò chơi hoặc chọn người chơi";
      whosTurnInfo.textContent = "";
    }
    machineTick = machineFirstTick;
  } else {
    machineTick = 0;
  }
  scoreXValue = 0;
  scoreYValue = 0;
  drawCount = 0;
  scoreX.textContent = "-";
  scoreY.textContent = "-";
  gridMem = [];
  startGame();
}

scoreViewX.addEventListener("click", configMachineFirstTick);
scoreViewY.addEventListener("click", configMachineSecondTick);

playWith.addEventListener("change", (e) => {
  if (e.target.value === "machine") freshGame = true;
  configFirstGame(e.target.value);
});

restartBtn.addEventListener("click", () => {
  startGame();
});
