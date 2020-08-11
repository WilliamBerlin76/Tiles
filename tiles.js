//// make a tile map

const buffer = document.createElement('canvas').getContext('2d');
const display = document.querySelector('canvas').getContext('2d');

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
            0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,
            0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,
            0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,
            3,3,2,2,2,0,2,2,2,2,2,0,0,0,0,0,
            3,3,3,3,2,2,2,3,3,3,2,2,0,0,0,0,
            3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,0,
            3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2]
};

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
    display.canvas.style.height = height - 150 + 'px';
    display.canvas.style.width = width - 150 + 'px';
};

buffer.canvas.width = display.canvas.width = map.width;

buffer.canvas.height = display.canvas.height = map.height;


buffer.imageSmoothingEnabled = display.imageSmoothingEnabled = false;

renderTiles();

renderDisplay();

window.addEventListener('resize', resize);

resize();