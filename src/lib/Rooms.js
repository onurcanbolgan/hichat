const redisClient = require('../redisClient');
const shortid = require('shortid');
const _ = require('lodash');

function Rooms() {
    this.client = redisClient.getClient();
}
module.exports = new Rooms();

Rooms.prototype.upsert = function (data,userData) {
    if (!userData.userId || userData.userId != undefined){
        if (!data._id || data._id != undefined){
            this.client.hset(
                "rooms:" + userData.userId,
                data._id,
                JSON.stringify({
                    id: data._id,
                    name: data.name,
                    surname: data.surname,
                    profilePhotoUrl: data.profilePhotoUrl,
                    when: Date.now()
                }),
                err => {
                    if (err)
                        console.log(err);
                }
            );
            this.client.hset(
                "rooms:" + data._id,
                userData.userId,
                JSON.stringify({
                    id: userData.userId,
                    name: userData.name,
                    surname: userData.surname,
                    profilePhotoUrl: userData.profilePhotoUrl,
                    when: Date.now()
                }),
                err => {
                    if (err)
                        console.log(err);
                }
            );
        }
    }
};


Rooms.prototype.list = function (myId, callback) {
    let active = [];
    this.client.hgetall('rooms:'+ myId, (err, rooms) => {
        if (err){
            return callback([]);
        }
        for(let room in rooms){
            active.push(JSON.parse(rooms[room]));
        }
        return callback(_.orderBy(active, 'when','asc'));
    });
};