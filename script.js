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

var settings = {};

$(document).ready(() => {
    loadSettings();
})

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        gameState = gameState == 'start' ? 'play' : 'start';
        if (gameState == 'play') {
            message.innerHTML = "Game Started";
            message.style.left = 42 + 'vw';
            requestAnimationFrame(() => {
                console.log('test');
                dx = Math.floor(Math.random() * 4) + 3;
                dy = Math.floor(Math.random() * 4) + 3;
                dxd = Math.floor(Math.random() * 2);
                dyd = Math.floor(Math.random() * 2);
                moveBall(dx, dy, dxd, dyd);
                findNode()
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
        loadBallVisibility();
        return;
    }

    ball.style.top = ballCoord.top + dy * (dyd == 0 ? -1 : 1) + 'px';
    ball.style.left = ballCoord.left + dx * (dxd == 0 ? -1 : 1) + 'px';
    ballCoord = ball.getBoundingClientRect();
    requestAnimationFrame(() => {
        moveBall(dx, dy, dxd, dyd);
    })
}


//Nodes
function findNode(){
    const ball_center = getCenter(ballCoord);
    const visual_distance = Number(settings.visual_distance);

    $('.plant.active').removeClass('active').css({opacity: ''});

    $('.plant').each(function(){
        const plant_coords = $(this).get(0).getBoundingClientRect();
        const plant_center = getCenter(plant_coords);
        const distance = getDistance(ball_center, plant_center);


        if(distance < visual_distance){
            let opacity = (1 - (distance / visual_distance)).toFixed(1)
            if (opacity < 0.25){ opacity = 0.25; }

            $(this).addClass('active').css({opacity: opacity});
        }

    });

    requestAnimationFrame(findNode);
}

//Utility
function _get(name, def = null) {
    let result = def;
    let tmp = [];

    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
function getCenter(rect){
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}
const getDistance = (point1, point2) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

//Settings
function loadSettings(){
    location.search
        .substr(1)
        .split("&")
        .forEach(segment => {
            const segment_params = segment.split("=");
            const name = segment_params[0];
            const value = segment_params[1];

            $(`[data-settings=${name}]`).val(value);
            settings[name] = value;
        });

    loadNodes();
    loadBallVisibility();
}
function setSettings(){
    const settings = [];

    $('[data-settings]').each(function(){
        settings.push({
            key: $(this).attr('data-settings'),
            value: this.value,
        });
    })

    const segments = settings.map(setting => `${setting.key}=${setting.value}`);
    window.location.href = `?${ segments.join('&') }`
}

//Targeted settings
function loadNodes(){
    const x = _get('x_nodes')
    const y = _get('y_nodes')

    if(!x || !y){ return; }

    const overlay = $('.overlay');

    for(let y_index = 1; y_index <= y; y_index++){
        overlay.append(`<div class="plants-row" data-y="${y_index}" ></div>`);

        for(let column = 1; column <= x; column ++){
            $(`.plants-row[data-y=${y_index}]`).append(`<div class="plant" data-y="${y_index}" data-x="${column}" > <i class="fa-solid fa-seedling"></i> </div>`)

        }
    }

    overlay.addClass('active');

}
function loadBallVisibility(){
    $(ball).css({opacity: settings.ball_visible})
}