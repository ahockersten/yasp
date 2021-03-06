var db = require('../db');
var async = require('async');
var operations = require('../operations');
var queueReq = operations.queueReq;
/**
 * Get all players who have visited and don't have full history, and queue for full history
 **/
module.exports = function fullhistory(cb, short) {
    db.players.find({
        last_visited: {
            $ne: null
        },
        full_history_time: null
    }, {
        /*
        sort: {
            full_history_time: 1,
            join_date: 1
        }
        */
    }, function(err, players) {
        if (err) {
            return cb(err);
        }
        async.eachSeries(players, function(player, cb) {
            player.priority = "low";
            queueReq(short ? "shorthistory" : "fullhistory", player, function(err, job) {
                cb(err);
            });
        }, function(err) {
            cb(err);
        });
    });
};