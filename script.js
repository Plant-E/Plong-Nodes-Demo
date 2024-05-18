let gameState = 'start';
let p1 = document.querySelector('.p1');
let p2 = document.querySelector('.p2');
let board = document.querySelector('.board');
let initialBall = document.querySelector('.ball');
let ball = document.querySelector('.ball');
let p1score = document.querySelector('.p1score');
let p2score = document.querySelector('.p2score');
let message = document.querySelector('.message');
let p1Coord = p1.getBoundingClientRect();
let p2Coord = p2.getBoundingClientRect();
let initialBallCoord = ball.getBoundingClientRect();
let ballCoord = initialBallCoord;
let boardCoord = board.getBoundingClientRect();
let paddleCommon = document.querySelector('.paddle').getBoundingClientRect();

let dx = Math.floor(Math.random() * 4) + 3;
let dy = Math.floor(Math.random() * 4) + 3;
let dxd = Math.floor(Math.random() * 2);
let dyd = Math.floor(Math.random() * 2);

//-----//




document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        gameState = gameState == 'start' ? 'play' : 'start';
        if (gameState == 'play') {
            message.innerHTML = "Game Started";
            message.style.left = 42 + 'vw';
            requestAnimationFrame(() => {
                dx = Math.floor(Math.random() * 4) + 3;
                dy = Math.floor(Math.random() * 4) + 3;
                dxd = Math.floor(Math.random() * 2);
                dyd = Math.floor(Math.random() * 2);
                moveBall(dx, dy, dxd, dyd);
                triggerNode();
            });
        }
    }
    if (gameState == 'play') {
        if (e.key == 'w') {
            p1.style.top = Math.max(
                boardCoord.top,
                p1Coord.top - window.innerHeight * 0.06) + 'px';
            p1Coord = p1.getBoundingClientRect();
        }
        if (e.key == 's') {
            p1.style.top = Math.min(
                boardCoord.bottom - paddleCommon.height,
                p1Coord.top + window.innerHeight * 0.06) + 'px';
            p1Coord = p1.getBoundingClientRect();
        }
        if (e.key == 'ArrowUp') {
            p2.style.top = Math.max(
                boardCoord.top,
                p2Coord.top - window.innerHeight * 0.1
            ) + 'px';
            p2Coord = p2.getBoundingClientRect();
        }
        if (e.key == 'ArrowDown') {
            p2.style.top = Math.min(
                boardCoord.bottom - paddleCommon.height,
                p2Coord.top + window.innerHeight * 0.1
            ) + 'px';
            p2Coord = p2.getBoundingClientRect();
        }
    }
});

function moveBall(dx, dy, dxd, dyd) {
    if (ballCoord.top <= boardCoord.top) {
        dyd = 1;
    }
    if (ballCoord.bottom >= boardCoord.bottom) {
        dyd = 0;
    }
    if (
        ballCoord.left <= p1Coord.right &&
        ballCoord.top >= p1Coord.top &&
        ballCoord.bottom <= p1Coord.bottom
    ) {
        dxd = 1;
        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
    }
    if (
        ballCoord.right >= p2Coord.left &&
        ballCoord.top >= p2Coord.top &&
        ballCoord.bottom <= p2Coord.bottom
    ) {
        dxd = 0;
        dx = Math.floor(Math.random() * 4) + 3;
        dy = Math.floor(Math.random() * 4) + 3;
    }
    if (
        ballCoord.left <= boardCoord.left ||
        ballCoord.right >= boardCoord.right
    ) {
        if (ballCoord.left <= boardCoord.left) {
            p2score.innerHTML = +p2score.innerHTML + 1;
        } else {
            p1score.innerHTML = +p1score.innerHTML + 1;
        }
        gameState = 'start';

        ballCoord = initialBallCoord;
        ball.style = initialBall.style;
        message.innerHTML = "Press Enter to play PLONG";
        message.style.left = 38 + "vw";
        return;
    }

    ball.style.top = ballCoord.top + dy * (dyd == 0 ? -1 : 1) + 'px';
    ball.style.left = ballCoord.left + dx * (dxd == 0 ? -1 : 1) + 'px';
    ballCoord = ball.getBoundingClientRect();
    requestAnimationFrame(() => {
        moveBall(dx, dy, dxd, dyd);
    })


}