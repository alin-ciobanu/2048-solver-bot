/**
 * Created by yozmo on 5/1/14.
 */

APP

    .factory('AppSettings', function() {

        this.boardSize = 4;
        this.initialTilesNo = 2;
        this.possibleAppearingTileValues = [
            {
                value: 2,
                probability: 0.9
            },
            {
                value: 4,
                probability: 0.1
            }
        ];

        return this;

    })

    .factory('BoardService', function (AppSettings, BoardUtilsService) {

        this.board = [];
        this.boardSize = AppSettings.boardSize;

        for (var i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
        }

        this.initBoard = function () {

            for (var i = 0; i < AppSettings.initialTilesNo; i++) {
                var pos = BoardUtilsService.randomPosition(this.boardSize);
                var posl = pos.line;
                var posc = pos.col;
                this.board[posl][posc] =
                    BoardUtilsService.randomTileValue(AppSettings.possibleAppearingTileValues);
            }

        };

        return this;

    })

    .factory('BoardUtilsService', function (){

        this.randomPosition = function (size) {

            var pos = {};
            var date = new Date();
            var time = d.getTime();
            var random_line = Math.floor(Math.random() * size);
            var random_col = Math.floor(Math.random() * size);

            pos.line = random_line;
            pos.col = random_col;

            return pos;

        };

        this.randomTileValue = function(possibleAppearingTileValues) {

            var range = 0;
            var random = Math.random();
            var randomTileValueReturned;

            for (var i = 0; i < possibleAppearingTileValues; i++) {
                var tileValue = possibleAppearingTileValues[i];
                range += tileValue.probability;
                if (random < range) {
                    randomTileValueReturned = tileValue.value;
                    break;
                }
            }

            return randomTileValueReturned;

        };

        return this;

    });