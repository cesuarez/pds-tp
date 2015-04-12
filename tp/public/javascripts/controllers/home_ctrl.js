angular.module('postsApp').controller('HomeCtrl', ['$scope', 'postsFactory', function($scope, postsFactory){

    $scope.posts = postsFactory.posts;

    $scope.addPost = function(){
        if($scope.title !== '' && $scope.title !== undefined) {
            postsFactory.create({
                title: $scope.title,
                link: $scope.link
            });
            $scope.title = '';
            $scope.link = '';
        }
    };

    $scope.incrementUpvotes = function(post){
        postsFactory.upvote(post);
    }

}]);