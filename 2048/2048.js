/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ROWS = 4;
var COLS = 4;
var BLOCK_SIZE = 100;
var PROBABILITY_DOUBLE = 0.1;
var BASE_NUMBER = 2;

var blockElements = [];
var blocks = [];
//Block class
function Block(x, y, value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.canmerge = true;
}
//Game controller
function Game(view) {
    init(ROWS, COLS);
    //initialize game grid, and populate it with blocks
    function init(rows, cols) {
        for (i = 0; i < rows; i++)
            for (j = 0; j < cols; j++) {
                blocks.push(new Block(j, i, 0));
            }
        view.initView();
        spawnBlock();
        view.updateView();
    }
    
    this.move = function (direction) {
        view.stopAnimation();
        if (direction == "LEFT") {
            if (moveLeft()) {
                spawnBlock();
            }
        }
        if (direction == "RIGHT") {
            if (moveRight()) {
                spawnBlock();
            }
        }
        if (direction == "UP") {
            if (moveUp()) {
                spawnBlock();
            }
        }
        if (direction == "DOWN") {
            if (moveDown()) {
                spawnBlock();
            }
        }
        view.updateView();
        if (!hasValidMoves()) {
            this.reset(); //No more valid moves.. game over 
            alert("Game over");
        }
    }
    
    function moveLeft() {
        var line = [];
        var destinationBlock;
        var isValid = false;
        for (k = 0; k < ROWS; k++) {
            line = [];
            for (i = k * COLS; i < k * COLS + COLS; i++) {                                  //get a horizontal line of blocks
                line.push(blocks[i]);
                blocks[i].canmerge = true;
            }
            for (i = 0; i < line.length; i++) {                                             //iterate starting from leftmost block in the line
                if (line[i].value > 0)
                    for (j = line[i].x - 1; j >= 0; j--) {                                  //compare with blocks in same line starting from block that is one unit to the right
                        if (line[j].value === 0) {                                          //if value of comparing block is zero, mark it as viable move destination
                            destinationBlock = line[j];
                        } else if (line[j].value === line[i].value && line[j].canmerge) {   //if comparing block has not merged and has the same value, confirm it as destination
                            destinationBlock = line[j];
                            j = -1;
                        } else {
                            j = -1;
                        }
                    }
                if (destinationBlock) {
                    moveBlock(line[i], destinationBlock);
                    destinationBlock = null;
                    isValid = true;                         //if a block has changed positions, this is a valid move
                }
            }
        }
        return isValid;
    }

    function moveRight() {
        var line = [];
        var destinationBlock;
        var isValid = false;
        for (k = 0; k < ROWS; k++) {
            line = [];
            for (i = k * COLS; i < k * COLS + COLS; i++) {
                line.push(blocks[i]);
                blocks[i].canmerge = true;
            }
            for (i = COLS - 1; i >= 0; i--) {
                if (line[i].value > 0)
                    for (j = line[i].x + 1; j < COLS; j++) {
                        if (line[j].value === 0) {
                            destinationBlock = line[j];
                        } else if (line[j].value === line[i].value && line[j].canmerge) {
                            destinationBlock = line[j];
                            j = COLS;
                        } else {
                            j = COLS;
                        }
                    }
                if (destinationBlock) {
                    moveBlock(line[i], destinationBlock);
                    destinationBlock = null;
                    isValid = true;
                }
            }
        }
        return isValid;
    }

    function moveUp() {
        var line = [];
        var destinationBlock;
        var isValid = false;
        for (k = 0; k < COLS; k++) {
            line = [];
            for (i = k; i < COLS * ROWS; i += COLS) {
                line.push(blocks[i]);
                blocks[i].canmerge = true;
            }
            for (i = 0; i < line.length; i++) {
                if (line[i].value > 0)
                    for (j = line[i].y - 1; j >= 0; j--) {
                        if (line[j].value === 0) {
                            destinationBlock = line[j];
                        } else if (line[j].value === line[i].value && line[j].canmerge) {
                            destinationBlock = line[j];
                            j = -1;
                        } else {
                            j = -1;
                        }
                    }
                if (destinationBlock) {
                    moveBlock(line[i], destinationBlock);
                    destinationBlock = null;
                    isValid = true;
                }
            }
        }
        return isValid;
    }

    function moveDown() {
        var line = [];
        var destinationBlock;
        var isValid = false;
        for (k = 0; k < COLS; k++) {
            line = [];
            for (i = k; i < COLS * ROWS; i += COLS) {
                line.push(blocks[i]);
                blocks[i].canmerge = true;
            }
            for (i = ROWS - 1; i >= 0; i--) {
                if (line[i].value > 0)
                    for (j = line[i].y + 1; j < ROWS; j++) {
                        if (line[j].value === 0) {
                            destinationBlock = line[j];
                        } else if (line[j].value === line[i].value && line[j].canmerge) {
                            destinationBlock = line[j];
                            j = ROWS;
                        } else {
                            j = ROWS;
                        }
                    }
                if (destinationBlock) {
                    moveBlock(line[i], destinationBlock);
                    destinationBlock = null;
                    isValid = true;
                }
            }
        }
        return isValid;
    }
    //function to transfer value of blocks
    function moveBlock(source, destination) {
        view.animateMove(source, destination);
        if (destination.value > 0) {                 //blocks can only merge once every move
            destination.canmerge = false;
        }
        destination.value += source.value;
        source.value = 0;
    }

    function gridIsFull() {
        for (i = 0; i < blocks.length; i++) {
            if (blocks[i].value === 0) {
                return false;
            }
        }
        return true;
    }
    //function to spawn a block at a random position
    function spawnBlock() {
        var randomPosition;
        do {
            randomPosition = Math.round(Math.random() * (blocks.length - 1));
        }
        while (blocks[randomPosition].value > 0)
        blocks[randomPosition].value = BASE_NUMBER * (Math.random() < PROBABILITY_DOUBLE ? 2 : 1);   //adds a number to the chosen block
        //perform spawn animation
        view.animateSpawn(randomPosition);
    }
    //function to check if there are any valid moves left for the player
    function hasValidMoves() {
        if (!gridIsFull()) {
            return true;
        }
        for (var i = 0; i < blocks.length - 1; i++) {
            if (blocks[i - 1])
                if (blocks[i].value === blocks[i - 1].value && blocks[i].y === blocks[i - 1].y) {
                    return true;
                }
            if (blocks[i + 1])
                if (blocks[i].value === blocks[i + 1].value && blocks[i].y === blocks[i + 1].y) {
                    return true;
                }
            if (blocks[i + COLS])
                if (blocks[i].value === blocks[i + COLS].value && blocks[i].x === blocks[i + COLS].x) {
                    return true;
                }
            if (blocks[i - COLS])
                if (blocks[i].value === blocks[i - COLS].value && blocks[i].y === blocks[i - COLS].y) {
                    return true;
                }
        }
        return false;
    }
    //resets the game
    this.reset = function () {
        blocks = [];
        view.reset();
        init(ROWS, COLS);
    };
}
//view controller
function View() {
    var container;
    this.initView = function () {
        this.container = document.getElementById("container");
        var w = COLS * BLOCK_SIZE;
        var h = ROWS * BLOCK_SIZE;
        this.container.style.width = w + "px";
        this.container.style.height = h + "px";                                 //adjust container according to grid size
        for (i = 0; i < blocks.length; i++) {                                   //fill the container with grids and blocks
            var grid = document.createElement("span");
            grid.setAttribute("class", "grid");
            this.container.appendChild(grid);
            blockElements[i] = document.createElement("span");
            blockElements[i].setAttribute("class", "block");
            this.container.appendChild(blockElements[i]);
        }
    };
    //function to update the view, sets block elements to their respective values
    this.updateView = function () {
        for (i = 0; i < blocks.length; i++) {
            if (blocks[i].value > 0) {
                var val = blocks[i].value;
                blockElements[i].innerHTML = val;
                blockElements[i].setAttribute("class", "block value" + val);
                blockElements[i].style.opacity = "1";
            }
        }
    };
    
    this.animateSpawn = function (position) {
        var blockElement = blockElements[position];
        $(blockElement).css({                       //sets the starting css for animation
            width: 0,
            height: 0,
            marginLeft: -BLOCK_SIZE / 2,
            marginTop: BLOCK_SIZE / 2,
            opacity: 0,
        });
        $(blockElement).animate({                   //animate to the given values
            width: BLOCK_SIZE - 10,
            height: BLOCK_SIZE - 10,
            marginLeft: -BLOCK_SIZE,
            marginTop: 0,
            opacity: 1
        }, 300);
    };

    this.animateMove = function (source, destination) {
        var sourceElement = blockElements[source.x + source.y * COLS];                      //gets the dom element based on x and y values of given block
        var destinationElement = blockElements[destination.x + destination.y * COLS];       
        var xdistance = (destination.x - source.x) * BLOCK_SIZE;                                   //calculate the distance a block should move
        var ydistance = (destination.y - source.y) * BLOCK_SIZE;
        $(sourceElement).animate({
            left: xdistance,
            top: ydistance
        }, 125);
        $(sourceElement).animate({          //sets the block back to its original position, then hide it
            left: 0,
            top: 0,
            opacity: 0
        }, 0);
        $(destinationElement).animate({             //makes sure the destination blocks are visible
             opacity: 1
        },0);
    };

    this.stopAnimation = function () {
        $("*").finish();
    };
    //reset the view
    this.reset = function () {
        while (this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        blockElements = [];
    };
}


