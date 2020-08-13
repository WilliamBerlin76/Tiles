//// make a tile map

const buffer = document.createElement('canvas').getContext('2d');
const display = document.querySelector('canvas').getContext('2d');

const output = document.querySelector('p');

const tileSize = 16;


const tiles = {
    0: { color:'#d8f4f4' }, // sky
    1: { color:'#ffffff' }, // cloud
    2: { color:'#3e611e' }, // grass
    3: { color:'#412823' }  // dirt
};

const map = {

    columns: 16,
    rows: 14,
    height: 14 * tileSize,
    width: 16 * tileSize,

    widthHeightRatio: 16 / 14,

    tiles: [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,
            0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,
            0,0,1,1,0,0,1,1,1,1,1,0,0,0,1,0,
            0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,
            0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,
            0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,0,
            0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
            3,3,2,2,2,0,2,2,2,2,2,0,0,0,0,0,
            3,3,3,3,2,2,2,3,3,3,2,2,0,0,0,0,
            3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,0,
            3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2]
};

const controller = {

    ////////// MOUSE HOVER///////
    pointerX: 0,
    pointerY: 0,

    move: (e) => {
        // canvas element location
        let rect = display.canvas.getBoundingClientRect();

        // store position of te move event inside the pointer variables
        controller.pointerX = e.clientX - rect.left;
        controller.pointerY = e.clientY - rect.top;
        // console.log(controller.pointerX, controller.pointerY)
    },


    ////////// ARROW CONTROLS////////
    left: false,
    right: false,
    up: false,
    down: false,

    keyStrokes: (e) => {

        let keyState = e.type === "keydown" ? true : false;

        switch(e.keyCode){

            case 37: controller.left = keyState; break;
            case 38: controller.up = keyState; break;
            case 39: controller.right = keyState; break;
            case 40: controller.down = keyState; break;
        }
    }   
};

const player = {
    width: 16,
    height: 16,
    color: '#ff0000',
    jumping: false,
    oldX: 224,
    oldY: 256,
    velocityX: 0,
    velocityY: 0,
    x: 128,
    y: 0
}

const loop = function(timestamp){
    
    let width = parseInt(display.canvas.style.width.replace('px', ''));
    let height = parseInt(display.canvas.style.height.replace('px', ''));

    let tileX = Math.floor(controller.pointerX / (width / 16));
    let tileY = Math.floor(controller.pointerY / (height / 14));

    let value = map.tiles[tileY * 16 + tileX];

    if (controller.up){
        player.velocityY -= 0.25;
    }
    
    if (controller.left){
        player.velocityX -= 0.25
    }

    if (controller.right){
        player.velocityX += 0.25;
    }

    if (controller.down){
        player.velocityY += 0.25;
    }

    
    player.x += player.velocityX;
    player.y += player.velocityY;
    player.velocityX *= 0.9;
    player.velocityY *= 0.9;

    if (player.x >= display.canvas.width - 16){ // right side collision
        player.x = display.canvas.width - 16;
    } 
    if (player.x <= 0){ // left side collision
        player.x = 0;
    };
    if (player.y <= 0){ // top collision
        player.y = 0;
    } 

    renderTiles();

    buffer.fillStyle = "rgba(128, 128, 128, 0.5)";
    buffer.fillRect(tileX * tileSize, tileY * tileSize, tileSize, tileSize);

    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
    output.innerHTML = `tile value: ${value},<br>tile_color: ${tiles[value] ? tiles[value].color : null}<br>tileX: ${tileX}, <br>tileY: ${tileY}` ;

    window.requestAnimationFrame(loop)
}

function renderTiles(){

    var mapIndex = 0;

    for(let top = 0; top < map.height; top += tileSize){
        for(let left = 0; left < map.width; left += tileSize){

            var tileValue = map.tiles[mapIndex];
            var tile = tiles[tileValue];

            buffer.fillStyle = tile.color;
            buffer.fillRect(left, top, tileSize, tileSize);
            
            mapIndex++;
        };
    };
    buffer.fillStyle = player.color;
    buffer.fillRect(player.x, player.y, player.width, player.height);
};

function renderDisplay(){

    display.drawImage(buffer.canvas, 0 , 0);

};

function resize(event){

    var height = document.documentElement.clientHeight;
    var width = document.documentElement.clientWidth;

    if (width / height < map.widthHeightRatio){
        height = Math.floor(width / map.widthHeightRatio);
        
    } else {
        width = Math.floor(height * map.widthHeightRatio);
        
    };
    display.canvas.style.height = height - 100 + 'px';
    display.canvas.style.width = width - 100 + 'px';

};

buffer.canvas.width = display.canvas.width = map.width;

buffer.canvas.height = display.canvas.height = map.height;


buffer.imageSmoothingEnabled = display.imageSmoothingEnabled = false;

// renderTiles();

renderDisplay();

window.addEventListener('resize', resize);
display.canvas.addEventListener("mousemove", controller.move);

window.addEventListener('keydown', controller.keyStrokes);
window.addEventListener('keyup', controller.keyStrokes);

resize();
window.requestAnimationFrame(loop);

