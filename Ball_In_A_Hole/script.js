document.addEventListener("DOMContentLoaded", initialization);

function initialization() {
    Game.setGame();
    Player.setPlayer();
    Game.setHole();
    Player.move();
    Game.reset();
    window.addEventListener("deviceorientation", orientationChange);
}

function orientationChange(e) {
    Player.addVelocityX(e.alpha * Game.gravity);
    Player.addVelocityY((e.beta - 90) * Game.gravity);
}

// pozycja początkowa gracza

Player = {
    element: {},
    pos: {
        x: 0,
        y: 0
    },
    size: 15,
    color: "red",

    vel: {
        x: 0,
        y: 0,
        max: 4
    },

    // poruszanie po osi X
    addVelocityX: function(value) {
        this.vel.x += value;
        if (Math.abs(this.vel.x) > this.vel.max) this.vel.x = this.vel.max * Math.sign(this.vel.x);
    },
    // poruszanie po osi Y
    addVelocityY: function(value) {
        this.vel.y += value;
        if (Math.abs(this.vel.y) > this.vel.max) this.vel.y = this.vel.max * Math.sign(this.vel.y);
    },

    setPlayer: function() {
        this.element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

        this.pos.x = Game.boardSize.x / 2;
        this.pos.y = Game.boardSize.y / 2;

        this.element.setAttribute("cx", this.pos.x);
        this.element.setAttribute("cy", this.pos.y);
        this.element.setAttribute("r", this.size);
        this.element.setAttribute("fill", this.color);

        Game.gameBoardEl.appendChild(this.element);
    },

    borderTest: function() {
        this.pos.x = this.pos.x > Game.boardSize.x - this.size ? Game.boardSize.x - this.size : this.pos.x;
        this.pos.x = this.pos.x < this.size ? this.size : this.pos.x;

        this.pos.y = this.pos.y > Game.boardSize.y - this.size ? Game.boardSize.y - this.size : this.pos.y;
        this.pos.y = this.pos.y < this.size ? this.size : this.pos.y;
    },

    holeTest: function() {
        if (Math.abs(this.pos.x - Game.hole.x) < this.size) {
            if (Math.abs(this.pos.y - Game.hole.y) < this.size) {
                Game.win();
            }
        }
    },

    move: function() {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.borderTest();
        this.holeTest();

        this.element.setAttribute("cx", this.pos.x);
        this.element.setAttribute("cy", this.pos.y);

        requestAnimationFrame(() => { this.move() });
    }

}

Game = {
    gameBoardEl: {},
    boardSize: {
        x: 0,
        y: 0
    },

    gravity: 0.01,

    setGame: function() {
        this.gameBoardEl = document.querySelector("#gameBoard");
        this.boardSize.x = this.gameBoardEl.getBoundingClientRect().width;
        this.boardSize.y = this.gameBoardEl.getBoundingClientRect().height;

        this.timerElement = document.querySelector("#timer");

    },

    timerElement: {},
    gameTime: 15,
    timeLeft: 0,
    timerInterval: 1,
    runTimer: function() {
        this.timeLeft = this.gameTime;
        this.timerElement.innerHtml = this.timeLeft;
        if (this.timerInterval != {}) this.timerInterval = setInterval(() => { this.timer() }, 1000)
    },
    //timer
    timer: function() {
        this.timerElement.innerHTML = --this.timeLeft;
        if (this.timeLeft <= 0) this.gameOver();
    },

    hole: {
        element: {},
        color: "black",
        x: 0,
        y: 0
    },
    //losowe miejsce dziury
    setHole: function() {
        this.hole.element = document.createElementNS("http://www.w3.org/2000/svg", 'circle');

        this.hole.x = Math.random() * 10000 % this.boardSize.x;
        this.hole.y = Math.random() * 10000 % this.boardSize.y;

        this.hole.element.setAttribute("cx", this.hole.x);
        this.hole.element.setAttribute("cy", this.hole.y);
        this.hole.element.setAttribute("r", Player.size);
        this.hole.element.setAttribute("fill", this.hole.color);

        this.gameBoardEl.appendChild(this.hole.element);
    },

    // koniec gry
    gameOver: function() {
        clearInterval(this.timerInterval);
        window.alert("You Lose");
        this.reset();
    },
    // wygrana
    win: function() {
        clearInterval(this.timerInterval);
        window.alert("You Win");
        this.reset();
    },

    reset: function() {
        this.boardSize.x = this.gameBoardEl.getBoundingClientRect().width;
        this.boardSize.y = this.gameBoardEl.getBoundingClientRect().height;

        Player.pos.x = this.boardSize.x / 2;
        Player.pos.y = this.boardSize.y / 2;

        this.hole.x = Math.random() * 10000 % (this.boardSize.x - Player.size) + Player.size;
        this.hole.y = Math.random() * 10000 % (this.boardSize.y - Player.size) + Player.size;
        this.hole.element.setAttribute("cx", this.hole.x);
        this.hole.element.setAttribute("cy", this.hole.y);

        this.runTimer();
    }
}