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
            0,0,1,1,0,0,2,1,1,1,1,0,0,0,1,0,
            0,0,1,1,1,0,0,0,1,2,0,0,0,0,0,0,
            0,0,0,1,1,0,0,0,0,0,0,2,2,1,0,0,
            0,0,0,2,2,2,2,1,1,1,2,0,0,1,1,0,
            0,3,3,3,3,0,0,0,0,1,0,3,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
            3,3,2,2,2,0,2,2,2,2,2,0,0,0,0,0,
            3,3,3,3,2,2,2,3,3,3,2,2,0,0,0,0,
            3,3,3,3,3,3,3,3,3,3,3,2,2,2,0,0,
            3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,0]
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
    hoverVal: 0,

    clickVal: (e) => {
        e.type === "click" && console.log('clicked', controller.hoverVal)
        map.tiles[controller.hoverVal] === 3 ? map.tiles[controller.hoverVal] = 0 : map.tiles[controller.hoverVal]++
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
};

const collision = {
    0:function(object, row, column){
        
    },

    1:function(object, row, column){

    },

    2:function(object, row, column){

        this.topCollision(object, row);
        
    },

    3:function(object, row, column){
        this.topCollision(object, row);
    },

    topCollision(object, row){
        

        if(object.velocityY > 0){

            let top = row * tileSize;

            if (top < object.y + object.height && top >= object.oldY + object.height){

                object.velocityY = 0;
                object.jumping = false;
                object.oldY = object.y = top - object.height - 0.01;

                return true;
            };
        };
        
        return false
    }
};

const loop = function(timestamp){
    
    let width = parseInt(display.canvas.style.width.replace('px', ''));
    let height = parseInt(display.canvas.style.height.replace('px', ''));

    let tileX = Math.floor(controller.pointerX / (width / 16));
    let tileY = Math.floor(controller.pointerY / (height / 14));

    let value = map.tiles[tileY * 16 + tileX];

    controller.hoverVal = tileY * 16 + tileX;

    player.velocityY += 0.5;
    if (controller.up && !player.jumping){
        player.jumping = true
        player.velocityY -= 13;
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
    tile_y = Math.floor((player.y + player.height) / tileSize);

    valueAtIndex = map.tiles[tile_y * map.columns + tile_x];
    
    if(valueAtIndex){
        collision[valueAtIndex](player, tile_y, tile_x)
    }
    


    renderTiles();

    buffer.fillStyle = "rgba(128, 128, 128, 0.5)";
    buffer.fillRect(tileX * tileSize, tileY * tileSize, tileSize, tileSize);

    display.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, display.canvas.width, display.canvas.height);
    output.innerHTML = `tile value: ${valueAtIndex},<br>tileX: ${tile_x}, <br>tileY: ${tile_y}` ;

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
window.addEventListener('click', controller.clickVal)

resize();
window.requestAnimationFrame(loop);

