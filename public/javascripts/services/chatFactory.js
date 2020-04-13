app.factory('chatFactory', ['$http','env', ($http,env) => {
    const getMessages = (roomId,userId) => {
        return $http({
            url: env.SERVICE_URL+'/messages/list',
            method: 'GET',
            params : {
                roomId,
                userId
            }
        }).then(response => {
                return response.data;
            }, (err) => {
                console.error(err);
            });
    };
    return{
        getMessages
    }
}]);