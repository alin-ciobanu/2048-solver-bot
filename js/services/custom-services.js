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
            EMPTY: 0
        };

        return settings;

    })

    .factory('BoardService', function (AppSettings, BoardUtilsService) {

        var thisService = {};

        thisService.board = [];
        thisService.boardSize = AppSettings.boardSize;

        var initZero = function () {
            for (var i = 0; i < AppSettings.boardSize; i++) {
                thisService.board.push([]);
                for (var j = 0; j < AppSettings.boardSize; j++) {
                    thisService.board[i].push(AppSettings.constants.EMPTY);
                }
            }
        };

        thisService.initBoard = function () {

            initZero();

            var tilesSoFar = [];

            for (var i = 0; i < AppSettings.initialTilesNo; i++) {
                var pos = BoardUtilsService.randomEmptyPosition(thisService.board, thisService.boardSize);
                var posl = pos.line;
                var posc = pos.col;
                thisService.board[posl][posc] =
                    BoardUtilsService.randomTileValue(AppSettings.possibleAppearingTileValues);
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

        return thisService;

    });
