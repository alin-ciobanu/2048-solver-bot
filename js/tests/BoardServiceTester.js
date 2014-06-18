describe('Board controlling game testing', function(){

    var boardService;
    var appSettings;

    beforeEach(function () {
        module('2048-app');
        inject(function ($injector) {
            boardService = $injector.get('BoardService');
            appSettings = $injector.get('AppSettings');
        });
    });

    describe("sleep(milliseconds)", function () {
        it ("should do work for @milliseconds and not give processor to another task, test 1, 10 ms", function () {

            var begin = new Date().getTime();
            boardService.sleepMilli(10);
            var end = new Date().getTime();
            expect(end - begin).toBeGreaterThan(9);

        })

        it ("should do work for @milliseconds and not give processor to another task, test 2, 50 ms", function () {

            var begin = new Date().getTime();
            boardService.sleepMilli(50);
            var end = new Date().getTime();
            expect(end - begin).toBeGreaterThan(49);

        })
    })

    describe("initBoard()", function () {
        it ("should reset and init the board with a configured number of tiles", function () {

            boardService.initBoard();
            var count = 0;
            for (var i = 0; i < boardService.boardSize; i++) {
                for (var j = 0; j < boardService.boardSize; j++) {
                    if (boardService.board[i][j] != appSettings.constants.EMPTY) {
                        count++;
                    }
                }
            }
            expect(count).toEqual(appSettings.initialTilesNo);

        })
    })

    describe("hidden", function () {
        it ("should be example of syntax", function () {

            expect(true).toEqual(true);

        })
    })

});