describe('BoardUtils testing', function(){

    var boardService;

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

    beforeEach(function () {
        module('2048-app');

        inject(function ($injector) {
            boardService = $injector.get('BoardUtilsService');
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

});