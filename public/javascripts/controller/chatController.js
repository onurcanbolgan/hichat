app.controller('chatController', ['$scope','chatFactory','userFactory','roomFactory',($scope,chatFactory,userFactory,roomFactory) => {
    /**
     * initialization
     */

    function init () {
        userFactory.getUser().then(user => {
            $scope.user = user;
        });
        roomFactory.getRooms().then(rooms => {
            $scope.rooms[$scope.user._id] = rooms;
        });
    }

    init();

    /**
     * Angular variables
     */
    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 1;
    $scope.chatClicked = false;
    $scope.loadingMessages = false;
    $scope.chatName = "";
    $scope.roomId = "";
    $scope.message = "";
    $scope.messages = [];
    $scope.rooms = [];
    $scope.user = {};

    /**
     * Socket.io event handling.
     */
    const socket = io.connect('http://localhost:3000');
    socket.on('onlineList', users => {
        $scope.onlineList = users;
        $scope.$apply();
    });


    socket.on('recieveMessage', data => {
        console.log(data)
        $scope.messages[data.roomId].push({
            userId: data.userId,
            username: data.username,
            surname: data.surname,
            message: data.message,
            ...data
        });
        $scope.$apply();
    });

    socket.on('recieveRoom', (data,myId) => {
        $scope.rooms[myId].push({
            userId: data.userId,
            name: data.name,
            surname: data.surname,
            profilePhotoUrl: data.profilePhotoUrl
        });
        $scope.$apply();
    });

    $scope.switchRoom = room => {
        $scope.chatName = room.name;
        $scope.roomId = room.id;
        $scope.chatClicked = true;
        if (!$scope.messages.hasOwnProperty(room.id)){
            $scope.loadingMessages = true;
            chatFactory.getMessages(room.id,$scope.user._id).then(data => {
                $scope.messages[room.id] = data;
                $scope.loadingMessages = false;
            });
        }

    };

    $scope.newMessage = () => {
        if ($scope.message.trim() !== ''){
            socket.emit('newMessage', {
                message: $scope.message,
                roomId: $scope.roomId
            });

            $scope.messages[$scope.roomId].push({
                userId: $scope.user._id,
                username: $scope.user.name,
                surname: $scope.user.surname,
                message: $scope.message
            });
            roomFactory.getRooms().then(rooms => {
                $scope.rooms[$scope.user._id] = rooms;
            });

            $scope.message = "";
        }
    };

    $scope.changeTab = tab => {
        $scope.activeTab = tab;
    };

    $scope.newRoom = (data) => {
        let myId = $scope.user._id;
        if (data.meta._id != $scope.user._id && data != null){
                socket.emit('newRoom', data.meta,myId);
        }
    };

}]);