angular.module('postsApp').controller('PostsCtrl', 
    ['$scope', '$stateParams', 'postsFactory', 'post', '$location', function(
    $scope, $stateParams, postsFactory, post, $location){

    if ($stateParams.id){
        $scope.post = post;
        $scope.customFilter = '-upvotes';
        updateTimes();

        $scope.addComment = function(){
            if($scope.body !== '' && $scope.body !== undefined) {
                postsFactory.addComment(post._id, {
                    body: $scope.body,
                    author: ($scope.author ? $scope.author : 'Anonymous'),
                    time: moment().toDate()
                    }).success(function(comment) {
                        $scope.post.comments.push(comment);
                        updateTimes();
                    });
                $scope.body = '';
                $scope.author = '';
            }
        };

        $scope.incrementUpvotes = function(comment){
            postsFactory.upvoteComment(post, comment);
        };

        $scope.back = function(){
            $location.url("");
        }

        function updateTimes(){
            angular.forEach($scope.post.comments, function(value){
                value.time = (moment(value.time));
            });
        }

        // Dynamic Ordering
        $scope.order = "-upvotes";

        $scope.changeOrderTo = function(order) {
            $scope.order = order;
        }

    }

}]);
