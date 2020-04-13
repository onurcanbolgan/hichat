app.factory('roomFactory', ['$http','env', ($http,env) => {
    const getRooms = () => {
        return $http({
            url: env.SERVICE_URL+'/rooms/list',
            method: 'GET'
        }).then(response => {
                return response.data;
            }, (err) => {
                console.error(err);
            });
    };
    return{
        getRooms
    }
}]);