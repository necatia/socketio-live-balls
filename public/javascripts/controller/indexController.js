app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    indexFactory.connectSocket('http://localhost:3000').then((socket)=>{
        console.log('bağlantı gerçekleşti', socket);
    }).catch((err)=>{
        console.log(err);
    });
    
    //const socket = io.connect('http://localhost:3000');

}]);