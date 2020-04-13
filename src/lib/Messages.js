const redisClient = require('../redisClient');
const shortid = require('shortid');
const _ = require('lodash');
function Messages() {
    this.client = redisClient.getClient();
}
module.exports = new Messages();

Messages.prototype.upsert = function ({roomId, message, userId, username, surname}) {
  this.client.hset(
      'messages:' + roomId + ":" + userId,
      shortid.generate(),
      JSON.stringify({
          userId,
          username,
          surname,
          message,
          when: Date.now()
      }),
      err => {
          if (err)
              console.log(err);
      }
  );
    this.client.hset(
        'messages:' + userId + ":" + roomId,
        shortid.generate(),
        JSON.stringify({
            userId,
            username,
            surname,
            message,
            when: Date.now()
        }),
        err => {
            if (err)
                console.log(err);
        }
    );
};

Messages.prototype.list = function (roomId,userId, callback) {
    let messageList = [];
    this.client.hgetall('messages:'+ roomId + ":" + userId, (err, messages) => {
        if (err){
            return callback([]);
        }
        for(let message in messages){
            messageList.push(JSON.parse(messages[message]));
        }
        return callback(_.orderBy(messageList, 'when','asc'));
    });
};