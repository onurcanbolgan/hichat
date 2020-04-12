const redisClient = require('../redisClient');
const shortid = require('shortid');
function Rooms() {
    this.client = redisClient.getClient();
}
module.exports = new Rooms();

Rooms.prototype.upsert = function (name) {
    const newId = shortid.generate();
  this.client.hset(
      'rooms',
      '@Room:' + newId,
      JSON.stringify({
          id: '@Room:' + newId,
          name,
          when: Date.now()
      }),
      err => {
          if (err)
              console.log(err);
      }
  );
};

Rooms.prototype.list = function (callback) {
    let active = [];
    this.client.hgetall('rooms', (err, rooms) => {
        if (err){
            return callback([]);
        }
        for(let room in rooms){
            active.push(JSON.parse(rooms[room]));
        }
        return callback(active);
    });
};