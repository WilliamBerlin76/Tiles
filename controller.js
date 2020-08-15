import { map } from "./map.js";
import { display } from "./game.js";

export const controller = {

    ////////// MOUSE HOVER///////
    pointerX: 0,
    pointerY: 0,

    move: (e) => {
        // canvas element location
        let rect = display.canvas.getBoundingClientRect();

        // store position of te move event inside the pointer variables
        controller.pointerX = e.clientX - rect.left;
        controller.pointerY = e.clientY - rect.top;
        
    },
    hoverVal: 0,
    ///// TILE CHANGE CLICKER/////
    clickVal: (e) => {
        
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
            case 65: controller.left = keyState; break;

            case 38: controller.up = keyState; break;
            case 87: controller.up = keyState; break;

            case 39: controller.right = keyState; break;
            case 68: controller.right = keyState; break;

            case 40: controller.down = keyState; break;
            case 83: controller.down = keyState; break;
        }
    },
    
    gravityToggle: (e) => {
        if(e.keyCode === 71) map.gravity = !map.gravity;
    }
};

