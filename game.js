import { tiles, map } from './map.js';
import { controller } from './controller.js';
import { player } from "./player.js";
import { collision } from "./collision.js"

const buffer = document.createElement('canvas').getContext('2d');
export const display = document.querySelector('canvas').getContext('2d');

const output = document.querySelector('p');

const tileSize = 16;


const loop = function(timestamp){
    
    let width = parseInt(display.canvas.style.width.replace('px', ''));
    let height = parseInt(display.canvas.style.height.replace('px', ''));

    let tileX = Math.floor(controller.pointerX / (width / 16));
    let tileY = Math.floor(controller.pointerY / (height / 14));

    // let value = map.tiles[tileY * 16 + tileX];

    controller.hoverVal = tileY * 16 + tileX;

    map.gravity && (player.velocityY += 0.5); /// add gravity if gravity is on

    if (controller.up && !player.jumping && map.gravity){
        player.jumping = true;
        player.velocityY -= 13;
    } else if(controller.up && !map.gravity){
        player.jumping = false;
        player.velocityY -= 0.25
    };
    
    if (controller.left){
        player.velocityX -= 0.25
    };

    if (controller.right){
        player.velocityX += 0.25;
    };

    if (controller.down){
        player.velocityY += 0.25;
    };

    // store old coordinates
    player.oldX = player.x;
    player.oldY = player.y
    
    // update new coordinates
    player.x += player.velocityX;
    player.y += player.velocityY;
    player.velocityX *= 0.9;
    player.velocityY *= 0.9;

    if (player.x >= display.canvas.width - 16){ // right side collision
        player.x = display.canvas.width - 16;
    }; 
    if (player.x <= 0){ // left side collision
        player.x = 0;
    };
    if (player.y <= 0){ // top collision
        player.y = 0;
    }; 
    if (player.y >= display.canvas.height - 16){
        player.y = display.canvas.height - 16;
        player.jumping = false;
    }


    let tile_x = Math.floor((player.x + player.width * 0.5) / tileSize);
    let tile_y = Math.floor((player.y + player.height) / tileSize);

    let valueAtIndex = map.tiles[tile_y * map.columns + tile_x];
    
    if(valueAtIndex){
        collision[valueAtIndex](player, tile_y, tile_x)
    }
    

    tile_x = Math.floor((player.x + player.width * 0.5) / tileSize);
    tile_y = Math.floor((player.y) / tileSize);

    valueAtIndex = map.tiles[tile_y * map.columns + tile_x];
    
    if(valueAtIndex){
        collision[valueAtIndex](player, tile_y, tile_x)
    }
    


    renderTiles();

    buffer.fillStyle = "rgba(128, 128, 128, 0.5)";
    buffer.fillRect(tileX * tileSize, tileY * tileSize, tileSize, tileSize);

    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
    // output.innerHTML = `tile value: ${valueAtIndex},<br>tileX: ${tile_x}, <br>tileY: ${tile_y}` ;
    output.innerHTML = `Gravity: ${map.gravity ? 'ON' : 'OFF'}` ;
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
    
    if (width <= 800){
        display.canvas.style.height = height - 50 + 'px';
        display.canvas.style.width = width - 50 + 'px';
    } else {
        display.canvas.style.height = height - 200 + 'px';
        display.canvas.style.width = width - 200 + 'px';
    }

};

buffer.canvas.width = display.canvas.width = map.width;

buffer.canvas.height = display.canvas.height = map.height;


buffer.imageSmoothingEnabled = display.imageSmoothingEnabled = false;


renderDisplay();

window.addEventListener('resize', resize);
display.canvas.addEventListener("mousemove", controller.move);

window.addEventListener('keydown', controller.keyStrokes);
window.addEventListener('keyup', controller.keyStrokes);
window.addEventListener('keydown', controller.gravityToggle)
window.addEventListener('click', controller.clickVal);

resize();
window.requestAnimationFrame(loop);