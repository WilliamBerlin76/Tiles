import { map } from "./map.js";

const tileSize = 16;

export const collision = {
    0:function(object, row, column){
        
    },

    1:function(object, row, column){

    },

    2:function(object, row, column){

        this.topCollision(object, row);
        
    },

    3:function(object, row, column){
        if(this.topCollision(object, row)){
            return
        } 
        this.bottomCollision(object, row, column);
    },

    topCollision(object, row){
        
        if(object.velocityY > 0){

            let top = row * tileSize;

            if (top < object.y + object.height && top >= object.oldY + object.height){

                object.velocityY = 0;
                object.jumping = false;
                object.oldY = object.y = top - object.height;

                return true;
            };
        };
        
        return false;
    },

    bottomCollision(object, row, column){
        if(object.velocityY < 0){

            let bottom = row * tileSize + tileSize;
            
            if(bottom > object.y && bottom <= object.oldY){
                object.velocityY = 0;
                object.oldY = object.y = bottom;
                
                return true;
            } else if (bottom >= object.y + object.height && map.tiles[(row - 1) * map.columns + row] === 3){
                object.velocityY = 0;
                object.oldY = object.y = bottom - object.height

                return true;
            }
        };

        return false;
    }
};
