/**
 * Created by yozmo on 5/1/14.
 */

APP.controller('BoardController',
['$scope', 'BoardService', 'AppSettings',
function($scope, BoardService, AppSettings) {

    $scope.boardService = BoardService;
    $scope.boardService.initBoard();

    $scope.directions = AppSettings.constants.directions;

}]);