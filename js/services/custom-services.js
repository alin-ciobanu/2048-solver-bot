/**
 * Created by yozmo on 5/1/14.
 */

APP

    .factory('AppSettings', function() {

        var settings = {};

        settings.boardSize = 4;
        settings.initialTilesNo = 2;
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
             },
            MAX_DEPTH: 9,
            INFINITY: 999999
        };

        return settings;

    })

    .factory('BoardService', function (AppSettings, BoardUtilsService, $timeout, $rootScope) {

        var thisService = {};

        thisService.board = [];
        thisService.boardSize = AppSettings.boardSize;
        thisService.moves = 0;

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

        thisService.checkGameOver = function () {
            alert (BoardUtilsService.isGameOver(thisService.board, thisService.boardSize));
        }

        thisService.move = function (direction) {
            BoardUtilsService.move(direction, thisService.board, thisService.boardSize);
        };

        var evaluateBoard = function (board, size) {
            return 0;
        };

        thisService.worstRandomPosition = function (possibleAppearingTileValues, positions, board, size) {

            var minScore = AppSettings.constants.INFINITY;
            var worstPosition;

            for (var i = 0; i < positions.length; i++) {
                for (var j = 0; j < possibleAppearingTileValues.length; j++) {
                    BoardUtilsService.markAPosition(board, possibleAppearingTileValues[j].value, positions[i]);
                    var score = evaluateBoard(board, size);
                    if (score < minScore) {
                        minScore = score;
                        worstPosition = {
                            pos: {
                                line: positions[i].line,
                                col: positions[i].col
                            },
                            value: possibleAppearingTileValues[j].value
                        };
                    }
                    BoardUtilsService.markAPosition(board, AppSettings.constants.EMPTY, positions[i]);
                }
            }

            return worstPosition;

        }

        thisService.optimumNextMove = function (depth, board, size, bestDir) {

            if (depth == 0) {
                return {
                    max: evaluateBoard(board, size),
                    dir: bestDir
                };
            }

            var max = -AppSettings.constants.INFINITY;

            for (var i in AppSettings.constants.directions) {
                var direction = AppSettings.constants.directions[i];
                var newBoard = BoardUtilsService.matrixCopy(board, size);
                BoardUtilsService.move(direction, newBoard, size);
                var boardSnapshot = BoardUtilsService.matrixCopy(board, size);
                var score;
                if (!BoardUtilsService.equalsBoard(newBoard, boardSnapshot, size, size)) {
                    var freePositions = BoardUtilsService.getEmptyPositions(newBoard, size);
                    var worstPosition = thisService.worstRandomPosition(AppSettings.possibleAppearingTileValues,
                                                                        freePositions, newBoard, size);
                    BoardUtilsService.markAPosition(newBoard, worstPosition.value, worstPosition.pos);
                    score = thisService.optimumNextMove(depth - 1, newBoard, size, bestDir);
                    BoardUtilsService.markAPosition(newBoard, AppSettings.constants.EMPTY, worstPosition.pos);
                    if (score.max > max) {
                        max = score.max;
                        bestDir = direction;
                    }
                }
            }

            return {
                max: max,
                dir: bestDir
            };

        };

        thisService.putRandomTile = function () {
            BoardUtilsService.markAPosition(thisService.board,
                BoardUtilsService.randomTileValue(AppSettings.possibleAppearingTileValues),
                BoardUtilsService.randomEmptyPosition(thisService.board, thisService.boardSize));
        }

        thisService.doNextMove = function () {
            var next = thisService.optimumNextMove(AppSettings.constants.MAX_DEPTH, thisService.board, thisService.boardSize, -1);
            console.log(next, "nextMove", thisService.board);
            thisService.move(next.dir);
            thisService.putRandomTile();
        }

        thisService.solve = function () {

            var i = 0;

            while (!BoardUtilsService.isGameOver(thisService.board, thisService.boardSize)) {

                var next = thisService.optimumNextMove(AppSettings.constants.MAX_DEPTH, thisService.board, thisService.boardSize, -1);
                console.log(next, "nextMove", thisService.board);
                thisService.move(next.dir);
                thisService.putRandomTile();
                thisService.moves++;

                $timeout(function() {
                    $rootScope.$digest();
                }, 0);

                if (i == 4) {
                    break;
                }

                i++;

            }

        }

        return thisService;

    })

    .factory('BoardUtilsService', function (AppSettings){

        var thisService = {};

        thisService.markAPosition = function (board, value, position) {
            board[position.line][position.col] = value;
        };

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

        thisService.equalsBoard = function (board1, board2, size1, size2) {

            if (size1 != size2) {
                return false;
            }

            for (var i = 0; i < size1; i++) {
                for (j = 0; j < size1; j++) {
                    if (board1[i][j] != board2[i][j]) {
                        return false;
                    }
                }
            }

            return true;

        }

        thisService.isGameOver = function (board, size) {

            for (var i = 0; i < size; i++) {
                for (var j = 0; j < size; j++) {
                    if (board[i][j] == AppSettings.constants.EMPTY) {
                        return false;
                    }
                }
            }

            var bCopy = thisService.matrixCopy(board, size);
            for (var i in AppSettings.constants.directions) {
                var direction = AppSettings.constants.directions[i];
                thisService.move(direction, bCopy, size);
                if (thisService.equalsBoard(board, bCopy, size, size)) {
                    return true;
                }
                bCopy = thisService.matrixCopy(board, size);
            }

            return false;

        }

        var moveLeft = function (board, size) {

            for (var i = 0; i < size; i++) {
                var line = board[i];
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

        var moveUp = function (board, size) {

            for (var i = 0; i < size; i++) {
                var lastNonZeroIndex = -1;
                var currentCompare = {
                    index: -1,
                    value: -1
                };

                for (var j = 0; j < size; j++) {
                    if (board[j][i] != AppSettings.constants.EMPTY) {
                        if (board[j][i] == currentCompare.value) {
                            board[currentCompare.index][i] *= 2;
                            board[j][i] = AppSettings.constants.EMPTY;
                        }
                        currentCompare.value = board[j][i];
                        currentCompare.index = j;
                        lastNonZeroIndex = j;
                    }
                }

                for (var j = 0; j < size; j++) {
                    while (board[j][i] == AppSettings.constants.EMPTY && j < lastNonZeroIndex) {
                        for (var k = j; k < size - 1; k++) {
                            board[k][i] = board[k + 1][i];
                        }
                        board[size - 1][i] = AppSettings.constants.EMPTY;
                        lastNonZeroIndex--;
                    }
                }
            }

        };

        var moveRight = function (board, size) {

            for (var i = 0; i < size; i++) {
                var line = board[i];
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

        var moveDown = function (board, size) {

            for (var i = 0; i < size; i++) {
                var lastNonZeroIndex = -1;
                var currentCompare = {
                    index: -1,
                    value: -1
                };

                for (var j = size - 1; j >= 0; j--) {
                    if (board[j][i] != AppSettings.constants.EMPTY) {
                        if (board[j][i] == currentCompare.value) {
                            board[currentCompare.index][i] *= 2;
                            board[j][i] = AppSettings.constants.EMPTY;
                        }
                        currentCompare.value = board[j][i];
                        currentCompare.index = j;
                        lastNonZeroIndex = j;
                    }
                }

                for (var j = size - 1; j >= 0; j--) {
                    while (board[j][i] == AppSettings.constants.EMPTY && j > lastNonZeroIndex) {
                        for (var k = j; k > 0; k--) {
                            board[k][i] = board[k - 1][i];
                        }
                        board[0][i] = AppSettings.constants.EMPTY;
                        lastNonZeroIndex++;
                    }
                }
            }

        };

        thisService.move = function (direction, board, size) {

            switch(direction) {

                case AppSettings.constants.directions.RIGHT:
                    moveRight(board, size);
                    break;

                case AppSettings.constants.directions.LEFT:
                    moveLeft(board, size);
                    break;

                case AppSettings.constants.directions.UP:
                    moveUp(board, size);
                    break;

                case AppSettings.constants.directions.DOWN:
                    moveDown(board, size);
                    break;

            }

        };


        thisService.matrixCopy = function (board, size) {

            var bCopy = [];

            for (var i = 0; i < size; i++) {
                bCopy.push([]);
                for (var j = 0; j < size; j++) {
                    bCopy[i].push(board[i][j]);
                }
            }

            return bCopy;

        };

        return thisService;

    });
