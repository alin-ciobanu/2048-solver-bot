/**
 * Created by yozmo on 5/1/14.
 */

APP.controller('BoardController', ['$scope', 'BoardService', function($scope, BoardService) {

    $scope.boardService = BoardService;
    $scope.boardService.initBoard();

}]);