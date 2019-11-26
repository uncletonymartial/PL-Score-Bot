var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var https = require('https');



// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '?') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        logger.info(args);
        switch(cmd) {
            // !ping
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Welcome to PL Score Bot. More commands to be added in the future' +'\n'+
                    'Commands: '+'\n'+
                    'Type ?results <matchDay> to get all results for that PL matchweek' + '\n'+
                    'For example: ?results 1 will return all results for PL matchweek'
                })
            case 'results':
                var options = {
                    hostname: 'api.football-data.org', //your hostname youtu
                    path: '/v2/competitions/2021/matches?matchday=' + args[1],
                    method: 'GET',
                    headers:{
                        "X-Auth-Token":"aee789cd27934968ada15f347670869b"
                    }
                };
                var jsonStr = ""; var matchString = "";
                callback = function(response)
                {
                    
                    response.on('data', function (chunk) {
                        jsonStr += chunk;
                      });
                    
                      response.on('end', function () {
                        var json = JSON.parse(jsonStr);
                        var matches = json['matches'];
                        matches.forEach(function(match) {
                            matchString =  matchString + match.homeTeam.name + ' ' + match.score.fullTime.homeTeam + ' - ' + match.score.fullTime.awayTeam + ' ' + match.awayTeam.name + '\n';
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: matchString
                        })
                      });
                }
                var req = https.request(options, callback).end();                
                
            break;
            // Just add any case commands if you want to..
         }
     }
});