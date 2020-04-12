const socketio = require('socket.io');
const socketAuthorization = require('../middleware/socketAuthorization');


const io = socketio();

const socketApi = {
    io
};

// libs
const Users = require('../src/lib/Users');
const Rooms = require('../src/lib/Rooms');
const Messages = require('../src/lib/Messages');

// Socket authorization
io.use(socketAuthorization);


/**
 * Redis adapter
 */

const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({
    host: process.env.REDIS_URI,
    port: process.env.REDIS_PORT
}));

io.on('connection', socket => {
    console.log("a user connected with name "+ socket.request.user.name);

    Users.upsert(socket.id, socket.request.user);

    Users.list(users => {
        io.emit('onlineList', users);
    });

    Rooms.list(rooms => {
        io.emit('roomList', rooms);
    });

    socket.on('newMessage', data => {
        console.log(data)
        Messages.upsert({
            ...data,
            username: socket.request.user.name,
            surname: socket.request.user.surname
        })
    })

    socket.on('newRoom', roomName => {
        Rooms.upsert(roomName);
        Rooms.list(rooms => {
            io.emit('roomList', rooms);
        });
    });

    socket.on('disconnect', () => {
        Users.remove(socket.request.user.googleId);

        Users.list(users => {
            io.emit('onlineList', users);
        });
    });
});

module.exports = socketApi;