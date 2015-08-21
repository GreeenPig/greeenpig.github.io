/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var ROWS = 50;
var COLS = 50;
//cell class
Cell = function () {
    this.alive = false;
}
//game class
Game = function (view) {
    this.init = function (cols, rows) {         //initialize the grid of cells
        this.cells = new Array(cols);
        for (x = 0; x < cols; x++) {
            this.cells[x] = new Array(rows);
            for (y = 0; y < rows; y++) {
                this.cells[x][y] = new Cell();
            }
        }
        view.init(COLS, ROWS);
    }
    //updates the entire game board one step in the next generation
    this.update = function () {
        var cellsToKill = [];
        var cellsToSpawn = [];
        for (x = 0; x < COLS; x++) {
            for (y = 0; y < ROWS; y++) {
                var myneighbours = this.numOfNeighbours(x, y);      //get number of neighbouring cells
                if (myneighbours < 2 || myneighbours > 3) {
                    cellsToKill.push(this.cells[x][y]);             //mark cells to kill
                    view.updateCell(x, y, false);
                } else {
                    if (!this.cells[x][y].alive && myneighbours == 3) {
                        cellsToSpawn.push(this.cells[x][y]);                    //mark cells to come alive
                        view.updateCell(x, y, true);
                    }
                }
            }
        }
        for (i = 0; i< cellsToKill.length; i++) {
            cellsToKill[i].alive = false;
        }
        for (i = 0; i< cellsToSpawn.length; i++) {
            cellsToSpawn[i].alive = true;
        }
    }
    //toggles a given cell between alive and dead
    this.toggleCellState = function (x, y) {
        this.cells[x][y].alive = !this.cells[x][y].alive;
        view.updateCell(x,y,this.cells[x][y].alive);
    }
    //returns a cell if it is within bounds
    this.getCell = function (x, y) {
        if (x < 0 || y < 0)
            return false;
        if (x >= COLS || y >= ROWS)
            return false;
        return this.cells[x][y];
    }
    //function to return number of neighbouring cells
    this.numOfNeighbours = function (x, y) {
        var num = 0;
        var neighbours = [[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], [x - 1, y], 
                           [x + 1, y], [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]];      //the 8 neighbouring cells
        for (i = 0; i < neighbours.length; i++) {
            if (this.getCell(neighbours[i][0], neighbours[i][1]).alive) {
                num++;
            }
        }
        return num;
    }
}
//view class
View = function () {
    this.init = function (cols, rows) {                 //set up the view board
        this.container = document.getElementById("container");
        this.cellElements = new Array(cols);
        for (x = 0; x < cols; x++) {
            this.cellElements[x] = new Array(rows);
            for (y = 0; y < rows; y++) {
                this.cellElements[x][y] = document.createElement("span");
                this.cellElements[x][y].setAttribute("class", "cell");
                this.cellElements[x][y].setAttribute("onclick", "game.toggleCellState("+x+","+y+")");
                this.container.appendChild(this.cellElements[x][y]);
            }
        }
    }
    //updates a cell element to the given status
    this.updateCell = function (x, y, state) {
        if (state) {
            this.cellElements[x][y].setAttribute("class", "cell alive");
        }
        else {
            this.cellElements[x][y].setAttribute("class", "cell");
        }
    }
}