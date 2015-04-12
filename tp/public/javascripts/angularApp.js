var app = angular.module('postsApp', ['ui.router']);


// Hackeada para que exista la variable 'post' antes de que se inicialice el 'Post_Ctrl'
app.factory('post',[function(){return null;}])


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'HomeCtrl',
        resolve: {
            postPromise: ['postsFactory', function(postsFactory){
                return postsFactory.getAll();
            }]
        }
    })
    
    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve: {
            post: ['$stateParams', 'postsFactory', function($stateParams, postsFactory) {
                return postsFactory.get($stateParams.id);
            }]
        }
        
    });

    $urlRouterProvider.otherwise('home');
}]);

