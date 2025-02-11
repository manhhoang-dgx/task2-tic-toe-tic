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

let ticks = document.querySelectorAll(".tick");
let gridMem = [];
let xTurn = true;
let ticked = 0;
let scoreXValue = 0;
let scoreYValue = 0;
let drawCount = 0;
let machineTick = 0;
startGame();

function checkWinner() {
  let winner = 0;
  console.log(gridMem);
  for (let i = 0; i < 3; i++) {
    let j = i * 3;
    if (
      gridMem[j] == gridMem[j + 1] &&
      gridMem[j] == gridMem[j + 2] &&
      gridMem[j] != 0
    ) {
      winner = gridMem[j];

      return winner;
    }
    if (
      gridMem[i] == gridMem[i + 3] &&
      gridMem[i] == gridMem[i + 6] &&
      gridMem[i] != 0
    ) {
      winner = gridMem[i];
      return winner;
    }
  }
  if (gridMem[0] == gridMem[4] && gridMem[0] == gridMem[8] && gridMem[0] != 0) {
    winner = gridMem[0];
  }
  if (gridMem[2] == gridMem[4] && gridMem[2] == gridMem[6] && gridMem[2] != 0) {
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
    for (let i = 0; i < 9; i++) {
      if (gridMem[i] === 0) {
        gridMem[i] = machineTick;
        if (checkWinner() === machineTick) {
          gridMem[i] = 0;
          return i;
        }
        gridMem[i] = 0;
      }
    }

    let myTick = machineTick === 1 ? 2 : 1;
    for (let j = 0; j < 9; j++) {
      if (gridMem[j] === 0) {
        gridMem[j] = myTick;
        if (checkWinner() === myTick) {
          gridMem[j] = 0;
          return j;
        }
        gridMem[j] = 0;
      }
    }
  }
  return machineChoice;
}

function triggerMachinePlay() {
  if (machineTick !== 0) {
    if (xTurn && machineTick !== 1) {
      return;
    }
    if (!xTurn && machineTick !== 2) {
      return;
    }
  } else {
    return;
  }
  let machineChoice = machinePlay();
  let machineChoiceElemenet = document.querySelector(`#cell-${machineChoice}`);
  let event;
  if (window.CustomEvent && typeof window.CustomEvent === "function") {
    event = new CustomEvent("click");
  }
  machineChoiceElemenet.dispatchEvent(event);
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
    let childimg = document.createElement("img");
    childimg.src = "svg/x-tick-lg.svg";
    childimg.classList.add("tick-img");
    tmp.appendChild(childimg);
  } else {
    gridMem[id] = 2;
    tmp.classList.add("tick-y");
    let childimg = document.createElement("img");
    childimg.src = "svg/o-tick-lg.svg";
    childimg.classList.add("tick-img");
    tmp.appendChild(childimg);
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
    textWinner.textContent = "Chiến thắng!";
    playGrid.classList.add("game-over");
    playResult.classList.add("play-result-game-over");
    return;
  }
  if (ticked === 9) {
    playGrid.classList.add("game-over");
    playResult.classList.add("play-result-game-over");
    tickWinner.textContent = "X O";
    textWinner.textContent = "Hòa!";
    drawCount++;
  }

  changeWhosTurn();
  triggerMachinePlay();
}

function startGame() {
  xTurn = (scoreXValue + scoreYValue + drawCount) % 2 ? false : true;
  changeWhosTurn();
  ticked = 0;
  gridMem = [];
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

playWith.addEventListener("change", (e) => {
  if (e.target.value === "machine") {
    machineTick = 2;
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
});

restartBtn.addEventListener("click", () => {
  startGame();
});
