const Discord = require("discord.js");
const client = new Discord.Client();
var cli = new Discord.Client({autoReconnect:true});
const ytdl = require('ytdl-core');
const settings = require('./settings.json');
var prefix = (settings.prefix);

var game = '';

var fortunes = [
    "Yes",
    "No",
    "I don't honestly care."
];

// client.on('', '' => {});
// nodemon



client.on('ready', () => {
    console.log("Online");
    //client.channels.get('389826734255636480').send("Online");
    client.user.setGame(game);
})

client.on('guildMemberAdd', member => {
    let guild = member.guild;
    client.channels.get('383373932708757525').send(`Welcome to the server ${member.user.username}!`);
    member.addRole(member.guild.roles.find("name", "Member"));
});

client.on('guildMemberRemove', member => {
    let guild = member.guild;
    client.channels.get('383373932708757525').send(`It was nice having you here ${member.user.username}, farewell!`);
});

client.on('guildBanAdd',(guild, user) => {
  client.channels.get('383373932708757525').send(`Banned ${member.user.username}, be gone pest!`);
});

client.on('guildBanRemove',(guild, user) => {
  client.channels.get('383373932708757525').send(`Unbanned ${member.user.username}, someone invite him.`);
});

client.on('disconnect', () => {
    console.log("I have disconnected.");
});

client.on('reconnecting', () => {
    console.log("Attempting to reconnect!");
});

client.on('message', function(message) {

    if (message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");
    
    let arg = message.content.split(' ').slice(1);
    var argresult = arg.join(' ');

    switch(args[0].toLowerCase()) {

        case "help":
            message.channel.send("Currently under construction. DM Torbinator for help.");
        break;

        case "fortune":
            if(argresult) {
                message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
            } else {
                message.channel.send("I can't read your fortune");
            }
        break;

        case "setgame":
            if(!argresult) {
                args = null;
            }
            client.user.setGame(argresult);
            game = argresult;
        break;

        case "setstatus":
            if(!argresult) {
                args = 'online';
            }
            client.user.setStatus(argresult);
        break;

        case "send":
            client.channels.get('383373932708757525').send(argresult);
        break;

        case "clear": 
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                    message.channel.fetchMessages().then(function(list){
                    message.channel.bulkDelete(list);
                }, function(err){
                    message.channel.send("ERROR: ERROR CLEARING CHANNEL.")
                })
            }                     
        break;

        case "kick":
            var modRole = message.guild.roles.find("name", "Co-owner");
            if(!message.member.roles.has(modRole.id)) {
                message.channel.send("As much as I know you want to kick this user, your role is too low.");
                return;
            }
            var kickMember = message.guild.member(message.mentions.users.first());
            if(!kickMember) {
                message.channel.send("You can not kick that user!");
                return;
            }
            if(kickMember = null) {
                return;
            }
            if(kickMember) {
                    kickMember.kick().then(member => {
                    console.log(`${member.user.username} was kicked!`);
                }).catch(e => {
                    console.error(e);
                });
            } else {
                message.channel.send("You can not kick that user!");
            }
        break;

        case "ban":
            var ownerRole = message.guild.roles.find("name", "Owner");
            if(!message.member.roles.has(ownerRole.id)) {
                message.channel.send("As much as I know you want to ban this user, your role is too low.");
                return;
            }
            var banMember = message.guild.member(message.mentions.users.first());
            if(!banMember) {
                message.channel.send("You can not ban that user!");
                return;
            }
            if(banMember = null) {
                return;
            }
            if(banMember) {
                    banMember.ban().then(member => {
                    console.log(`${member.user.username} was banned!`);
                }).catch(e => {
                    console.error(e);
                });
            } else {
                message.channel.send("You can not ban that user!");
            }
        break;

        default:
            if(!message.content.startsWith("-play")&&!message.content.startsWith("-stop")) {
                message.channel.send("Invalid command. Maybe next time. Do -help for commands.");
            }
        break;
    }
});

client.on('message', async msg => {
    var adminRole = msg.guild.roles.find("name", "Co-owner");
        if(!msg.member.roles.has(adminRole.id)) {
            return;
        }

    if (msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;
    var args = msg.content.substring(prefix.length).split(" ");
    
    let arg = msg.content.split(' ').slice(1);
    var argresult = arg.join(' ');

    if(msg.content.startsWith(prefix + "play")) {
        const voiceChannel = msg.member.voiceChannel;
        if(!voiceChannel) {
            return msg.channel.send("Please join a voice channel.");
        }
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if(!permissions.has('CONNECT')) {
            return msg.channel.send("I do not have the CONNECT permission!");
        }
        if(!permissions.has('SPEAK')){
            return msg.channel.send("I do not have the SPEAK permission!");
        }

        try {
            var connection = await voiceChannel.join();
        } catch (error) {
            console.error("I couldn't join the voice channel.");
            return msg.channel.send("I couldn't join the voice channel.");
        }

        const dispatcher = connection.playStream(ytdl(args[1], {filter: "audioonly"}))
            .on('start', () => {
                console.log('Song started!');
            })
            .on('end', () => {
                console.log('Song ended!');
                voiceChannel.leave();
            })
            .on('error', error => {
                console.error(error);
                msg.channel.send("Can not play that song.");
            });
        dispatcher.setVolumeLogarithmic(5/5);
    } else if(msg.content.startsWith(prefix + "stop")) {
        if(!msg.member.voiceChannel) {
                return msg.channel.send("You are not in a voice channel!");
            }
        msg.member.voiceChannel.leave();
        return undefined;
    }
});
client.login(process.env.BOT_TOKEN);
