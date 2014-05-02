/**
 * Created by yozmo on 5/1/14.
 */

APP

    .factory('AppSettings', function() {

        var settings = {};

        settings.boardSize = 4;
        settings.initialTilesNo = 10;
        settings.possibleAppearingTileValues = [
            {
                value: 2,
                probability: 0.9
            },
            {
                value: 4,
                probability: 0.1
            }
        ];
        settings.constants = {
            EMPTY: 0,
            directions: {
                UP: 1,
                DOWN: 2,
                RIGHT: 3,
                LEFT: 4
             }
        };

        return settings;

    })

    .factory('BoardService', function (AppSettings, BoardUtilsService) {

        var thisService = {};

        thisService.board = [];
        thisService.boardSize = AppSettings.boardSize;

        for (var i = 0; i < thisService.boardSize; i++) {
            thisService.board.push([]);
            for (var j = 0; j < thisService.boardSize; j++) {
                thisService.board[i].push(AppSettings.constants.EMPTY);
            }
        }

        var reset = function () {
            for (var i = 0; i < AppSettings.boardSize; i++) {
                for (var j = 0; j < AppSettings.boardSize; j++) {
                    thisService.board[i][j] = AppSettings.constants.EMPTY;
                }
            }
        };

        thisService.initBoard = function () {

            reset();

            var tilesSoFar = [];

            for (var i = 0; i < AppSettings.initialTilesNo; i++) {
                var pos = BoardUtilsService.randomEmptyPosition(thisService.board, thisService.boardSize);
                var posl = pos.line;
                var posc = pos.col;
                thisService.board[posl][posc] =
                    BoardUtilsService.randomTileValue(AppSettings.possibleAppearingTileValues);
            }

        };

        var moveLeft = function () {

            for (var i = 0; i < thisService.boardSize; i++) {
                var line = thisService.board[i];
                var lastNonZeroIndex = -1;
                var currentCompare = {
                    index: -1,
                    value: -1
                };

                for (var j = 0; j < line.length; j++) {
                    if (line[j] != AppSettings.constants.EMPTY) {
                        if (line[j] == currentCompare.value) {
                            line[currentCompare.index] *= 2;
                            line[j] = AppSettings.constants.EMPTY;
                        }
                        currentCompare.value = line[j];
                        currentCompare.index = j;
                        lastNonZeroIndex = j;
                    }
                }

                for (var j = 0; j < line.length; j++) {
                    while (line[j] == AppSettings.constants.EMPTY && j < lastNonZeroIndex) {
                        for (var k = j; k < line.length - 1; k++) {
                            line[k] = line[k + 1];
                        }
                        line[line.length - 1] = AppSettings.constants.EMPTY;
                        lastNonZeroIndex--;
                    }
                }
            }

        };

        var moveUp = function () {

            for (var i = 0; i < thisService.boardSize; i++) {
                var lastNonZeroIndex = -1;
                var currentCompare = {
                    index: -1,
                    value: -1
                };

                for (var j = 0; j < thisService.boardSize; j++) {
                    if (thisService.board[j][i] != AppSettings.constants.EMPTY) {
                        if (thisService.board[j][i] == currentCompare.value) {
                            thisService.board[currentCompare.index][i] *= 2;
                            thisService.board[j][i] = AppSettings.constants.EMPTY;
                        }
                        currentCompare.value = thisService.board[j][i];
                        currentCompare.index = j;
                        lastNonZeroIndex = j;
                    }
                }

                for (var j = 0; j < thisService.boardSize; j++) {
                    while (thisService.board[j][i] == AppSettings.constants.EMPTY && j < lastNonZeroIndex) {
                        for (var k = j; k < thisService.boardSize - 1; k++) {
                            thisService.board[k][i] = thisService.board[k + 1][i];
                        }
                        thisService.board[thisService.boardSize - 1][i] = AppSettings.constants.EMPTY;
                        lastNonZeroIndex--;
                    }
                }
            }

        };

        var moveRight = function () {

            for (var i = 0; i < thisService.boardSize; i++) {
                var line = thisService.board[i];
                var lastNonZeroIndex = -1;
                var currentCompare = {
                    index: -1,
                    value: -1
                };

                for (var j = line.length - 1; j >= 0; j--) {
                    if (line[j] != AppSettings.constants.EMPTY) {
                        if (line[j] == currentCompare.value) {
                            line[currentCompare.index] *= 2;
                            line[j] = AppSettings.constants.EMPTY;
                        }
                        currentCompare.value = line[j];
                        currentCompare.index = j;
                        lastNonZeroIndex = j;
                    }
                }

                for (var j = line.length - 1; j >= 0; j--) {
                    while (line[j] == AppSettings.constants.EMPTY && j > lastNonZeroIndex) {
                        for (var k = j; k >= 0; k--) {
                            line[k] = line[k - 1];
                        }
                        line[0] = AppSettings.constants.EMPTY;
                        lastNonZeroIndex++;
                    }
                }
            }

        };

        var moveDown = function () {

            for (var i = 0; i < thisService.boardSize; i++) {
                var lastNonZeroIndex = -1;
                var currentCompare = {
                    index: -1,
                    value: -1
                };

                for (var j = thisService.boardSize - 1; j >= 0; j--) {
                    if (thisService.board[j][i] != AppSettings.constants.EMPTY) {
                        if (thisService.board[j][i] == currentCompare.value) {
                            thisService.board[currentCompare.index][i] *= 2;
                            thisService.board[j][i] = AppSettings.constants.EMPTY;
                        }
                        currentCompare.value = thisService.board[j][i];
                        currentCompare.index = j;
                        lastNonZeroIndex = j;
                    }
                }

                for (var j = thisService.boardSize - 1; j >= 0; j--) {
                    while (thisService.board[j][i] == AppSettings.constants.EMPTY && j > lastNonZeroIndex) {
                        for (var k = j; k > 0; k--) {
                            thisService.board[k][i] = thisService.board[k - 1][i];
                        }
                        thisService.board[0][i] = AppSettings.constants.EMPTY;
                        lastNonZeroIndex++;
                    }
                }
            }

        };

        thisService.move = function (direction) {

            switch(direction) {

                case AppSettings.constants.directions.RIGHT:
                    moveRight();
                    break;

                case AppSettings.constants.directions.LEFT:
                    moveLeft();
                    break;

                case AppSettings.constants.directions.UP:
                    moveUp();
                    break;

                case AppSettings.constants.directions.DOWN:
                    moveDown();
                    break;

            }

        };

        return thisService;

    })

    .factory('BoardUtilsService', function (AppSettings){

        var thisService = {};

        thisService.randomEmptyPosition = function (board, size) {

            var emptyPositions = [];
            for (var i in board) {
                for (var j in board[i]) {
                    if (board[i][j] == AppSettings.constants.EMPTY) {
                        emptyPositions.push({
                            line: i,
                            col: j
                        });
                    }
                }
            }

            var random = Math.floor(Math.random() * emptyPositions.length);

            return emptyPositions[random];

        };

        thisService.randomTileValue = function(possibleAppearingTileValues) {

            var range = 0;
            var random = Math.random();
            var randomTileValueReturned;

            for (var i = 0; i < possibleAppearingTileValues.length; i++) {
                var tileValue = possibleAppearingTileValues[i];
                range += tileValue.probability;
                if (random < range) {
                    randomTileValueReturned = tileValue.value;
                    break;
                }
            }

            return randomTileValueReturned;

        };

        thisService.getEmptyPositions = function (board, size) {

            var emptyPositions = [];

            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    if (board[i][j] == AppSettings.constants.EMPTY) {
                        emptyPositions.push({
                            line: i,
                            col: j
                        });
                    }
                }
            }

            return emptyPositions;

        };

        return thisService;

    });
