var blockSize;
var r;
var c;
var board;
var context;
var zoro;
var treasure;
var gameOver = false;
var zoroX;
var zoroY;
var treasureX;
var treasureY;
var moveInterval;
var currentDirection;
var characterID;
var backgroundImage;

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    characterID = urlParams.get('item');

    initializeGame();
    setupCanvas();
    loadImages(characterID);
    setupControls();
}

function initializeGame() {
    blockSize = Math.floor(Math.min(window.innerWidth, window.innerHeight) / 20);
    r = Math.floor(window.innerHeight / blockSize);
    c = Math.floor(window.innerWidth / blockSize);

    zoroX = Math.floor(c / 2) * blockSize;
    zoroY = Math.floor(r / 2) * blockSize;
    treasureX = Math.floor(Math.random() * c) * blockSize;
    treasureY = Math.floor(Math.random() * r) * blockSize;
    currentDirection = null;
    gameOver = false;
    document.getElementById("gameOver").style.display = "none";
}

function setupCanvas() {
    board = document.getElementById("board");
    board.width = c * blockSize;
    board.height = r * blockSize;
    context = board.getContext("2d");

    backgroundImage = new Image();
    backgroundImage.src = "Images/background1.jpg";

    backgroundImage.onload = function() {
        context.drawImage(backgroundImage, 0, 0, board.width, board.height);
        update();
    };
}

function loadImages(characterID) {
    zoro = new Image();
    zoro.src = `Images/image${characterID}.png`;

    treasure = new Image();
    treasure.src = "Images/image6.png";

    zoro.onload = function() {
        treasure.onload = function() {
            update();
        }
    }
}

function setupControls() {
    document.addEventListener("keydown", function(event) {
        if (!gameOver) {
            switch (event.key) {
                case "ArrowUp":
                case "ArrowDown":
                case "ArrowLeft":
                case "ArrowRight":
                    setDirection(event.key);
                    break;
            }
        }
    });

    var upButton = document.getElementById("upButton");
    var downButton = document.getElementById("downButton");
    var leftButton = document.getElementById("leftButton");
    var rightButton = document.getElementById("rightButton");
    var resetButton = document.getElementById("resetButton");

    upButton.addEventListener("click", function() {
        if (!gameOver) setDirection("ArrowUp");
    });
    downButton.addEventListener("click", function() {
        if (!gameOver) setDirection("ArrowDown");
    });
    leftButton.addEventListener("click", function() {
        if (!gameOver) setDirection("ArrowLeft");
    });
    rightButton.addEventListener("click", function() {
        if (!gameOver) setDirection("ArrowRight");
    });
    resetButton.addEventListener("click", resetGame);
}

function update() {
    if (gameOver) return;

    context.drawImage(backgroundImage, 0, 0, board.width, board.height);
    context.drawImage(treasure, treasureX, treasureY);
    context.drawImage(zoro, zoroX, zoroY);

    if (zoroX === treasureX && zoroY === treasureY) {
        endGame();
    }

    if (zoroX < 0 || zoroX >= board.width || zoroY < 0 || zoroY >= board.height) {
        endGame();
    }
}

function setDirection(direction) {
    clearInterval(moveInterval);

    if (characterID === "5" || characterID === "6") {
        switch (direction) {
            case "ArrowUp":
                direction = "ArrowDown";
                break;
            case "ArrowDown":
                direction = "ArrowUp";
                break;
            case "ArrowLeft":
                direction = "ArrowRight";
                break;
            case "ArrowRight":
                direction = "ArrowLeft";
                break;
        }
    }

    currentDirection = direction;
    moveInterval = setInterval(function() {
        moveZoro(currentDirection);
    }, 100);
}

function moveZoro(direction) {
    switch (direction) {
        case "ArrowUp":
            zoroY -= blockSize;
            break;
        case "ArrowDown":
            zoroY += blockSize;
            break;
        case "ArrowLeft":
            zoroX -= blockSize;
            break;
        case "ArrowRight":
            zoroX += blockSize;
            break;
        default:
            return;
    }
    update();
}

function endGame() {
    gameOver = true;
    clearInterval(moveInterval);
    document.getElementById("gameOver").style.display = "block";
}

function resetGame() {
    clearInterval(moveInterval);
    initializeGame();
    update();
}
