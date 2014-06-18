describe('BoardUtils testing', function(){

    var boardService;
    var appSettings;

    var getMatrix = function () {
        var matrix = [];
        for (var i = 0; i < 4; i++) {
            var line = []
            line.push(0 * i);
            line.push(1 * i);
            line.push(2 * i);
            line.push(3 * i);
            matrix.push(line);
        }
        return matrix;
    }

    var searchPosition = function (position, positionArray) {
        for (var i in positionArray) {
            if (position.line == positionArray[i].line && position.col == positionArray[i].col) {
                return true;
            }
        }
        return false;
    }

    beforeEach(function () {
        module('2048-app');

        inject(function ($injector) {
            boardService = $injector.get('BoardUtilsService');
            appSettings = $injector.get('AppSettings');
        });
    });

    describe("matrixCopy(board, size)", function() {

        it("should copy matrix @board of size @size * @size (square matrix)", function () {
            var matrix = getMatrix();
            var matrixCopy = boardService.matrixCopy(matrix, 4);
            expect(matrixCopy).toEqual(
                [
                    [0, 0, 0, 0],
                    [0, 1, 2, 3],
                    [0, 2, 4, 6],
                    [0, 3, 6, 9]
                ]
            );
        });
    })

    describe("markAPosition(board, value, position)", function () {

        it("should mark the position @position on the matrix @board with a value @value", function () {

            var board = getMatrix();
            var position = {
                line: 0,
                col: 0
            };
            boardService.markAPosition(board, 0, position);
            expect(board[0][0]).toEqual(0);
            boardService.markAPosition(board, 14, position);
            expect(board[0][0]).toEqual(14);
            boardService.markAPosition(board, 10, position);
            expect(board[0][0]).toEqual(10);

        });
    })

    describe("getEmptyPositions(board, size)", function () {

        it("should return all empty positions in the matrix @board", function () {

            var board = getMatrix();
            var emptyPositions = [];
            for (var i = 0; i < board.length; i++) {
                for (var j = 0; j < board.length; j++) {
                    if (board[i][j] == appSettings.constants.EMPTY) {
                        emptyPositions.push({
                            line: i,
                            col: j
                        });
                    }
                }
            }
            var testedEmptyPositions = boardService.getEmptyPositions(board, 4);
            expect(emptyPositions.length).toEqual(testedEmptyPositions.length);
            var found = true;

            expect(searchPosition({line: 1, col: 2}, [{line: 1, col: 2}, {line: 2, col: 2}, {line: 4, col: 2}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 1, col: 2}, {line: 1, col: 3}, {line: 1, col: 4}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 1, col: 2}, {line: 3, col: 3}, {line: 4, col: 4}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 3, col: 2}, {line: 1, col: 2}, {line: 4, col: 2}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 6, col: 2}, {line: 1, col: 2}, {line: 4, col: 2}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 21, col: 2}, {line: 2, col: 2}, {line: 1, col: 2}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 2, col: 2}, {line: 1, col: 2}, {line: 1, col: 2}])).toEqual(true);
            expect(searchPosition({line: 1, col: 2}, [{line: 2, col: 2}, {line: 2, col: 2}, {line: 5, col: 2}])).toEqual(false);
            expect(searchPosition({line: 1, col: 2}, [{line: 2, col: 2}, {line: 2, col: 2}, {line: 3, col: 2}])).toEqual(false);
            expect(searchPosition({line: 1, col: 2}, [{line: 1, col: 1}, {line: 2, col: 1}, {line: 9, col: 2}])).toEqual(false);

            for (var i in testedEmptyPositions) {
                if (!searchPosition(testedEmptyPositions[i], emptyPositions)) {
                    found = false;
                    break;
                }
            }
            expect(found).toEqual(true);

        });
    })

    describe("randomEmptyPosition(board, size)", function () {

        it("should return an empty position in the matrix @board", function () {

            var board = getMatrix();
            var emptyPositions = boardService.getEmptyPositions(board, 4);
            var randomEmptyPosition;
            var NO_TESTS = 30;
            var ret = true;

            for (var i = 0; i < NO_TESTS; i++) {
                var randomEmptyPosition = boardService.randomEmptyPosition(board, 4);
                if (!searchPosition(randomEmptyPosition, emptyPositions)) {
                    ret = false;
                    break;
                }
            }

            expect(ret).toEqual(true);

        });
    })

    describe("randomTileValue(possibleAppearingTileValues)", function () {
        it ("should return a random tile value according to possible values in @possibleAppearingTileValues", function () {

            var possibleValues = appSettings.possibleAppearingTileValues;
            var NO_TESTS = 30;

            for (var i = 0; i < NO_TESTS; i++) {
                var randomValue = boardService.randomTileValue(possibleValues);
                expect(randomValue).toBeDefined();
                var ret = false;
                for (var j in possibleValues) {
                    if (possibleValues[j].value == randomValue) {
                        ret = true;
                    }
                }
                expect(ret).toEqual(true);
            }

        })
    })

    describe("equalsBoard(board1, board2, size1, size2)", function () {
        it ("should check if @board1 and @board2 are equal", function () {

            expect(boardService.equalsBoard(
                [
                    [1, 2, 3, 4],
                    [0, 2, 0, 2],
                    [0, 0, 1, 1],
                    [14, 14, 2, 33]
                ],
                [
                    [1, 2, 3, 4],
                    [0, 2, 0, 2],
                    [0, 0, 1, 1],
                    [14, 14, 2, 33]
                ], 4, 4)).toEqual(true);

            expect(boardService.equalsBoard(
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ],
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ], 4, 4)).toEqual(true);

            expect(boardService.equalsBoard(
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ],
                [
                    [2, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ], 4, 4)).toEqual(false);

            expect(boardService.equalsBoard(
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ],
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 4, 16],
                    [16, 32, 128, 2048]
                ], 4, 4)).toEqual(false);

            expect(boardService.equalsBoard(
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ],
                [
                    [0, 0, 2, 2],
                    [0, 2, 4, 6],
                    [0, 2, 2, 16],
                    [16, 32, 128, 2048]
                ], 4, 3)).toEqual(false);

            expect(getMatrix()).toEqual(boardService.matrixCopy(getMatrix(), 4));

        })
    })

    describe("isGameOver(board, size)", function () {
        it ("should check if the @board allow any more moves, test 1", function () {

            expect(boardService.isGameOver(
                [
                    [2, 2, 2, 2],
                    [4, 8, 16, 128],
                    [2, 4, 8, 16],
                    [128, 256, 2048, 2]
                ], 4)).toEqual(false);

        })

        it ("should check if the @board allow any more moves, test 2", function () {

            expect(boardService.isGameOver(
                [
                    [0, 2, 4, 8],
                    [16, 32, 64, 128],
                    [2, 4, 8, 16],
                    [32, 64, 128, 512]
                ], 4)).toEqual(false);

        })

        it ("should check if the @board allow any more moves, test 3", function () {

            expect(boardService.isGameOver(
                [
                    [4, 4, 2, 4],
                    [2, 2, 16, 16],
                    [4, 8, 4, 8],
                    [2, 4, 2, 2]
                ], 4)).toEqual(false);

        })

        it ("should check if the @board allow any more moves, test 4", function () {

            expect(boardService.isGameOver(
                [
                    [2, 4, 8, 16],
                    [16, 2, 4, 8],
                    [2, 4, 8, 16],
                    [8, 16, 32, 2]
                ], 4)).toEqual(true);

        })
    })

    describe("move(direction, board, size)", function () {

        var matrix1 = [
            [2, 2, 4, 4],
            [0, 2, 0, 2],
            [2, 0, 0, 2],
            [0, 0, 0, 16]
        ];
        var size1 = 4;

        var matrix2 = [
            [128, 256, 256, 4],
            [0, 2, 2, 2],
            [4, 2, 0, 2],
            [8, 0, 8, 16]
        ];
        var size2 = 4;

        it ("should move the pieces to left on the @board, test 1", function () {

            var matrix1copy = boardService.matrixCopy(matrix1, size1);
            boardService.move(appSettings.constants.directions.LEFT, matrix1copy, size1);
            expect(matrix1copy).toEqual(
                [
                    [4, 8, 0, 0],
                    [4, 0, 0, 0],
                    [4, 0, 0, 0],
                    [16, 0, 0, 0]
                ]
            );

        })

        it ("should move the pieces to left on the @board, test 2", function () {

            var matrix2copy = boardService.matrixCopy(matrix2, size2);
            boardService.move(appSettings.constants.directions.LEFT, matrix2copy, size2);
            expect(matrix2copy).toEqual(
                [
                    [128, 512, 4, 0],
                    [4, 2, 0, 0],
                    [4, 4, 0, 0],
                    [16, 16, 0, 0]
                ]
            );

        })

        it ("should move the pieces to right on the @board, test 1", function () {

            var matrix1copy = boardService.matrixCopy(matrix1, size1);
            boardService.move(appSettings.constants.directions.RIGHT, matrix1copy, size1);
            expect(matrix1copy).toEqual(
                [
                    [0, 0, 4, 8],
                    [0, 0, 0, 4],
                    [0, 0, 0, 4],
                    [0, 0, 0, 16]
                ]
            );

        })

        it ("should move the pieces to right on the @board, test 2", function () {

            var matrix2copy = boardService.matrixCopy(matrix2, size2);
            boardService.move(appSettings.constants.directions.RIGHT, matrix2copy, size2);
            expect(matrix2copy).toEqual(
                [
                    [0, 128, 512, 4],
                    [0, 0, 2, 4],
                    [0, 0, 4, 4],
                    [0, 0, 16, 16]
                ]
            );

        })

        it ("should move the pieces up on the @board, test 1", function () {

            var matrix1copy = boardService.matrixCopy(matrix1, size1);
            boardService.move(appSettings.constants.directions.UP, matrix1copy, size1);
            expect(matrix1copy).toEqual(
                [
                    [4, 4, 4, 4],
                    [0, 0, 0, 4],
                    [0, 0, 0, 16],
                    [0, 0, 0, 0]
                ]
            );

        })

        it ("should move the pieces up on the @board, test 2", function () {

            var matrix2copy = boardService.matrixCopy(matrix2, size2);
            boardService.move(appSettings.constants.directions.UP, matrix2copy, size2);
            expect(matrix2copy).toEqual(
                [
                    [128, 256, 256, 4],
                    [4, 4, 2, 4],
                    [8, 0, 8, 16],
                    [0, 0, 0, 0]
                ]
            );

        })

        it ("should move the pieces down on the @board, test 2", function () {

            var matrix1copy = boardService.matrixCopy(matrix1, size1);
            boardService.move(appSettings.constants.directions.DOWN, matrix1copy, size1);
            expect(matrix1copy).toEqual(
                [
                    [0, 0, 0, 0],
                    [0, 0, 0, 4],
                    [0, 0, 0, 4],
                    [4, 4, 4, 16]
                ]
            );

        })

        it ("should move the pieces down on the @board, test 2", function () {

            var matrix2copy = boardService.matrixCopy(matrix2, size2);
            boardService.move(appSettings.constants.directions.DOWN, matrix2copy, size2);
            expect(matrix2copy).toEqual(
                [
                    [0, 0, 0, 0],
                    [128, 0, 256, 4],
                    [4, 256, 2, 4],
                    [8, 4, 8, 16]
                ]
            );

        })

    })

    describe("hidden", function () {
        it ("should be example of syntax", function () {

            expect(true).toEqual(true);

        })
    })

});