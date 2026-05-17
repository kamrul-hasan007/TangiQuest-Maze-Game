const connectBtn = document.getElementById("connectBtn");
const soundBtn = document.getElementById("soundBtn");
const boardEl = document.getElementById("board");
const statusText = document.getElementById("statusText");
const levelText = document.getElementById("levelText");
const scoreText = document.getElementById("scoreText");
const movesText = document.getElementById("movesText");
const directionText = document.getElementById("directionText");
const difficultyText = document.getElementById("difficultyText");
const sequenceList = document.getElementById("sequenceList");
const levelGoal = document.getElementById("levelGoal");
const toast = document.getElementById("toast");

let port;
let reader;

let level = 1;
let score = 0;
let moves = 0;
let started = false;
let foundTreasure = false;
let levelLocked = false;
let sequence = [];

const GRID_SIZE = 6;
const MAX_LEVEL = 15;

const ROBOT_IMAGE = "images/companion.png";
const TREASURE_IMAGE = "images/treasure-chest.png";

const audioFiles = {
  connected: "audio/connected.wav",
  start: "audio/start.wav",
  move: "audio/move.wav",
  left: "audio/left.wav",
  submit: "audio/submit.wav",
  correct: "audio/correct.wav",
  wrong: "audio/wrong.wav",
  unknown: "audio/unknown.wav",
  blocked: "audio/blocked.wav",
  levelReady: "audio/level_ready.wav",
};

let currentAudio = null;

function playVoice(type) {
  const filePath = audioFiles[type];

  if (!filePath) {
    console.log("Audio file not found:", type);
    return;
  }

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  currentAudio = new Audio(filePath);
  currentAudio.volume = 1.0;

  currentAudio.play().catch((error) => {
    console.log("Audio play error:", error);
  });
}

const directions = ["right", "up", "left", "down"];

const directionSymbol = {
  right: "→",
  up: "↑",
  left: "←",
  down: "↓",
};

let robot = {
  row: 0,
  col: 0,
  dir: "right",
};

const levels = [
  {
    difficulty: "Easy",
    start: { row: 0, col: 0, dir: "right" },
    treasure: { row: 1, col: 1 },
    walls: [[0, 3], [1, 3], [2, 3]],
    minMoves: 3,
    hint: "Easy Level 1: Learn movement and turning.",
  },
  {
    difficulty: "Easy",
    start: { row: 0, col: 0, dir: "right" },
    treasure: { row: 2, col: 0 },
    walls: [[0, 2], [1, 2], [2, 2]],
    minMoves: 4,
    hint: "Easy Level 2: Turn left more than once.",
  },
  {
    difficulty: "Easy",
    start: { row: 5, col: 0, dir: "right" },
    treasure: { row: 4, col: 3 },
    walls: [[3, 1], [3, 2], [3, 3]],
    minMoves: 6,
    hint: "Easy Level 3: Move around a simple wall.",
  },
  {
    difficulty: "Easy",
    start: { row: 5, col: 5, dir: "left" },
    treasure: { row: 3, col: 3 },
    walls: [[4, 4], [4, 2], [2, 4]],
    minMoves: 5,
    hint: "Easy Level 4: Reach the treasure from the corner.",
  },
  {
    difficulty: "Easy",
    start: { row: 0, col: 5, dir: "down" },
    treasure: { row: 3, col: 2 },
    walls: [[1, 4], [2, 4], [3, 4], [4, 1]],
    minMoves: 7,
    hint: "Easy Level 5: Final easy level before medium mode.",
  },

  {
    difficulty: "Medium",
    start: { row: 0, col: 0, dir: "right" },
    treasure: { row: 4, col: 2 },
    walls: [[0, 2], [1, 2], [2, 2], [3, 4], [4, 4], [5, 4]],
    minMoves: 9,
    hint: "Medium Level 6: More walls and longer route.",
  },
  {
    difficulty: "Medium",
    start: { row: 5, col: 0, dir: "right" },
    treasure: { row: 1, col: 4 },
    walls: [[4, 1], [3, 1], [2, 1], [1, 1], [1, 3], [2, 3], [3, 3]],
    minMoves: 10,
    hint: "Medium Level 7: Navigate through a corridor.",
  },
  {
    difficulty: "Medium",
    start: { row: 0, col: 5, dir: "down" },
    treasure: { row: 5, col: 1 },
    walls: [[1, 4], [2, 4], [3, 4], [3, 2], [4, 2], [0, 2]],
    minMoves: 10,
    hint: "Medium Level 8: Avoid the blocked center.",
  },
  {
    difficulty: "Medium",
    start: { row: 2, col: 0, dir: "right" },
    treasure: { row: 5, col: 5 },
    walls: [[1, 1], [2, 2], [3, 3], [4, 4], [0, 4], [1, 4], [2, 4]],
    minMoves: 9,
    hint: "Medium Level 9: Reach the far corner.",
  },
  {
    difficulty: "Medium",
    start: { row: 5, col: 5, dir: "left" },
    treasure: { row: 0, col: 1 },
    walls: [[4, 3], [3, 3], [2, 3], [1, 3], [4, 1], [3, 1], [2, 1]],
    minMoves: 11,
    hint: "Medium Level 10: Final medium level before hard mode.",
  },

  {
    difficulty: "Hard",
    start: { row: 0, col: 0, dir: "right" },
    treasure: { row: 5, col: 5 },
    walls: [[0, 2], [1, 2], [2, 2], [4, 2], [5, 2], [2, 4], [3, 4], [4, 4]],
    minMoves: 12,
    hint: "Hard Level 11: Longer path with narrow openings.",
  },
  {
    difficulty: "Hard",
    start: { row: 5, col: 0, dir: "up" },
    treasure: { row: 0, col: 5 },
    walls: [[1, 0], [1, 1], [1, 2], [3, 2], [4, 2], [5, 2], [2, 4], [3, 4], [4, 4]],
    minMoves: 13,
    hint: "Hard Level 12: Use multiple turns carefully.",
  },
  {
    difficulty: "Hard",
    start: { row: 0, col: 5, dir: "left" },
    treasure: { row: 5, col: 0 },
    walls: [[0, 3], [1, 3], [2, 3], [3, 1], [4, 1], [5, 1], [3, 4], [4, 4]],
    minMoves: 13,
    hint: "Hard Level 13: Reverse-side navigation.",
  },
  {
    difficulty: "Hard",
    start: { row: 3, col: 0, dir: "right" },
    treasure: { row: 0, col: 4 },
    walls: [[2, 1], [2, 2], [2, 3], [4, 1], [4, 2], [4, 3], [1, 4], [3, 4], [5, 4]],
    minMoves: 12,
    hint: "Hard Level 14: Find the correct opening.",
  },
  {
    difficulty: "Hard",
    start: { row: 5, col: 5, dir: "left" },
    treasure: { row: 0, col: 0 },
    walls: [[4, 0], [4, 1], [4, 2], [2, 1], [2, 2], [2, 3], [1, 4], [3, 4], [4, 4]],
    minMoves: 14,
    hint: "Hard Level 15: Final challenge level.",
  },
];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function setStatus(message, type = "") {
  statusText.textContent = message;

  const card = document.querySelector(".status-card");
  card.className = "status-card";

  if (type) {
    card.classList.add(type);
  }
}

function getCurrentLevel() {
  return levels[level - 1];
}

function resetLevel() {
  const current = getCurrentLevel();

  robot = {
    row: current.start.row,
    col: current.start.col,
    dir: current.start.dir,
  };

  moves = 0;
  started = false;
  foundTreasure = false;
  levelLocked = false;
  sequence = [];

  render();
  updateStats();
  updateSequence();
}

function startLevel() {
  resetLevel();

  started = true;
  sequence.push("START");

  const current = getCurrentLevel();

  setStatus(`${current.difficulty} Level ${level} started. Guide the robot to the treasure.`, "success");
  playVoice("start");
  showToast(`Level ${level} started`);

  updateSequence();
}

function turnLeft() {
  if (!started || levelLocked) {
    setStatus("Please scan START first or wait for the next level.", "warning");
    showToast("Scan START first");
    return;
  }

  const currentIndex = directions.indexOf(robot.dir);
  const nextIndex = (currentIndex + 1) % directions.length;

  robot.dir = directions[nextIndex];

  moves++;
  sequence.push("LEFT");

  setStatus("Robot turned left.", "success");
  playVoice("left");
  showToast("LEFT scanned");

  render();
  updateStats();
  updateSequence();
}

function moveForward() {
  if (!started || levelLocked) {
    setStatus("Please scan START first or wait for the next level.", "warning");
    showToast("Scan START first");
    return;
  }

  let nextRow = robot.row;
  let nextCol = robot.col;

  if (robot.dir === "right") nextCol++;
  if (robot.dir === "left") nextCol--;
  if (robot.dir === "up") nextRow--;
  if (robot.dir === "down") nextRow++;

  const current = getCurrentLevel();

  if (
    nextRow < 0 ||
    nextRow >= GRID_SIZE ||
    nextCol < 0 ||
    nextCol >= GRID_SIZE ||
    isWall(nextRow, nextCol, current.walls)
  ) {
    setStatus("Blocked! The robot hit a wall or boundary.", "error");
    playVoice("blocked");
    showToast("Blocked");

    sequence.push("BLOCKED");
    updateSequence();
    return;
  }

  robot.row = nextRow;
  robot.col = nextCol;
  moves++;
  sequence.push("MOVE");

  checkTreasureTouch();

  if (foundTreasure) {
    setStatus("Treasure found! Scan SUBMIT to complete the level.", "success");
    showToast("Treasure found");
  } else {
    setStatus("Robot moved forward.", "success");
    playVoice("move");
    showToast("MOVE scanned");
  }

  render();
  updateStats();
  updateSequence();
}

function checkTreasureTouch() {
  const current = getCurrentLevel();

  if (
    robot.row === current.treasure.row &&
    robot.col === current.treasure.col
  ) {
    foundTreasure = true;
  }
}

function submitLevel() {
  if (!started || levelLocked) {
    setStatus("Please scan START first or wait for the next level.", "warning");
    showToast("Scan START first");
    return;
  }

  playVoice("submit");

  const current = getCurrentLevel();
  sequence.push("SUBMIT");

  const reachedTreasure =
    robot.row === current.treasure.row &&
    robot.col === current.treasure.col;

  if (reachedTreasure) {
    foundTreasure = true;
    levelLocked = true;
    started = false;

    render();

    const bonus = Math.max(0, 50 - Math.max(0, moves - current.minMoves) * 5);
    const levelPoints = 100 + bonus;
    score += levelPoints;

    setStatus(`Success! Level ${level} completed. You earned ${levelPoints} points.`, "success");
    showToast(`Level ${level} completed`);

    updateStats();
    updateSequence();

    setTimeout(() => {
      playVoice("correct");
    }, 500);

    setTimeout(() => {
      goToNextLevel();
    }, 2200);
  } else {
    score = Math.max(0, score - 20);

    setStatus("Wrong position. You did not reach the treasure. Try again.", "error");
    showToast("Wrong position");

    updateStats();
    updateSequence();

    setTimeout(() => {
      playVoice("wrong");
    }, 500);

    setTimeout(() => {
      resetLevel();
      setStatus(`Level ${level} reset. Scan START to try again.`, "warning");
    }, 2200);
  }
}

function goToNextLevel() {
  if (level < MAX_LEVEL) {
    level++;
    resetLevel();

    const next = getCurrentLevel();

    setStatus(`${next.difficulty} Level ${level} ready. Scan START to begin.`, "success");
    playVoice("levelReady");
    showToast(`${next.difficulty} Level ${level} unlocked`);

    updateStats();
    return;
  }

  setStatus(`Congratulations! You completed all ${MAX_LEVEL} levels. Final Score: ${score}`, "success");
  showToast("Game completed!");

  levelLocked = true;
  started = false;

  updateStats();
}

function isWall(row, col, walls) {
  return walls.some(([r, c]) => r === row && c === col);
}

function render() {
  const current = getCurrentLevel();

  boardEl.innerHTML = "";

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell", "path");

      const isTreasureCell =
        row === current.treasure.row &&
        col === current.treasure.col;

      const isRobotCell =
        row === robot.row &&
        col === robot.col;

      if (isWall(row, col, current.walls)) {
        cell.classList.add("wall");
      }

      if (isTreasureCell) {
        cell.classList.add("treasure");
        cell.innerHTML = `<img src="${TREASURE_IMAGE}" class="treasure-img" alt="Treasure" />`;
      }

      if (isRobotCell) {
        cell.classList.add("robot");

        if (isTreasureCell && foundTreasure) {
          cell.classList.add("found");
          cell.innerHTML = `
            <span class="success-check">✓</span>
            <img src="${ROBOT_IMAGE}" class="robot-img" alt="Robot" />
            <span class="direction-badge">${directionSymbol[robot.dir]}</span>
          `;
        } else {
          cell.innerHTML = `
            <img src="${ROBOT_IMAGE}" class="robot-img" alt="Robot" />
            <span class="direction-badge">${directionSymbol[robot.dir]}</span>
          `;
        }
      }

      boardEl.appendChild(cell);
    }
  }
}

function updateStats() {
  const current = getCurrentLevel();

  levelText.textContent = level;
  scoreText.textContent = score;
  movesText.textContent = moves;
  directionText.textContent = directionSymbol[robot.dir];
  difficultyText.textContent = current.difficulty;
  levelGoal.textContent = current.hint;
}

function updateSequence() {
  sequenceList.innerHTML = "";

  if (sequence.length === 0) {
    sequenceList.innerHTML = "<span>No card scanned yet</span>";
    return;
  }

  sequence.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    sequenceList.appendChild(span);
  });
}

function handleCommand(command) {
  command = command.trim().toUpperCase();

  if (command === "START") {
    startLevel();
  } else if (command === "MOVE") {
    moveForward();
  } else if (command === "LEFT") {
    turnLeft();
  } else if (command === "SUBMIT") {
    submitLevel();
  } else if (command === "UNKNOWN") {
    setStatus("Unknown RFID card scanned.", "error");
    playVoice("unknown");
    showToast("Unknown card");
  }
}

async function connectArduino() {
  if (!("serial" in navigator)) {
    alert("Web Serial is not supported. Use Google Chrome or Microsoft Edge.");
    return;
  }

  try {
    port = await navigator.serial.requestPort();

    await port.open({
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
      flowControl: "none",
    });

    connectBtn.textContent = "Arduino Connected";
    connectBtn.disabled = true;

    setStatus("Arduino connected. Scan START card.", "success");
    playVoice("connected");
    showToast("Arduino connected");

    const textDecoder = new TextDecoderStream();
    port.readable.pipeTo(textDecoder.writable);

    reader = textDecoder.readable.getReader();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      buffer += value;

      const lines = buffer.split("\n");
      buffer = lines.pop();

      for (let line of lines) {
        line = line.trim();
        console.log("Arduino:", line);

        if (line.startsWith("COMMAND:")) {
          const command = line.replace("COMMAND:", "").trim();
          handleCommand(command);
        }
      }
    }
  } catch (error) {
    console.error("Serial connection error:", error);
    setStatus("Connection failed. Close Serial Monitor and try again.", "error");
    showToast("Connection failed");
  }
}

soundBtn.addEventListener("click", () => {
  playVoice("connected");
  showToast("Sound enabled");
});

connectBtn.addEventListener("click", connectArduino);

resetLevel();
setStatus("Connect Arduino to start.");