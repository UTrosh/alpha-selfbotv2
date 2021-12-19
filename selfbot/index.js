const Discord = require('discord.js');
const client = new Discord.Client()
const fs = require('fs');
const config = require('./config.json');
const db = require('../bdd.json');
const bdd = require('./bdd.json');
const moment = require('moment');
const axios = require('axios');
const cf = require('../config.json');
const backups = require("../Data/backups.json");
const lbackup = require("../Data/liste.json");

client.on('ready', () => {
    let n = db['usernumber'][config.token]
    if (!n) return;
    if (client.user.bot) {
        config.invalide = true
        fs.writeFile(`./bot${n}/config.json`, JSON.stringify(config, null, 4), (err) => {
            if (err) console.log("Une erreur est survenue.");
        });
        client.destroy().catch(err => console.log('Err : destroy'))
        return;
    } else {
        config.status = "on"
        fs.writeFile(`./bot${n}/config.json`, JSON.stringify(config, null, 4), (err) => {
            if (err) console.log("Une erreur est survenue.");
        });
        if (!bdd["prefix"]) {
            bdd["prefix"] = "-"
            bdd["dmlogger"] = "off"
            bdd["modules"] = "off"
            bdd["cacherinfos"] = "off"
            bdd["autostatut"] = "off"
            bdd["cmdguild"] = "on"
            bdd["chsendid"] = "None"
            fs.writeFile(`./bot${n}/bdd.json`, JSON.stringify(bdd, null, 4), (err) => {
                if (err) console.log("Une erreur est survenue.");
            });
        } else return;
    }
})

client.on('message', async message => {
    if (message.author.bot) return;
    const prefix = bdd["prefix"] || "-"
    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    if (message.mentions.users.first() === client.user) {
        if (bdd["autostatut"] === "on") {
            if (message.author.id === client.user.id) return;
                client.user.setActivity(`𝑀𝑒 𝑝𝑖𝑛𝑔 𝑝𝑎𝑠 ${message.author.username} 🔪`, { type: "STREAMING", url: "https://twitch.tv/sakey" })
            }
        }
        if (message.channel.type === "dm") {
            if (message.content.includes("Stream en cours:")) return;
            if (message.content.startsWith(prefix + "stream")) {
                if (message.author.id !== client.user.id) return;
                message.delete()
                let activity = args.slice(1).join(' ')
                if (!activity) return message.channel.send('\`❌ Message\`')
                client.user.setActivity(activity, { type: "STREAMING", url: "https://twitch.tv/sakey" })
                return message.channel.send(`\`Stream en cours:\` ${activity}`)
            } else {
                if (bdd["autostatut"] === "on") {
                    if (message.mentions.users.first() === client.user) return;
                    if (message.author.id === client.user.id) {
                        client.user.setActivity(`: ${message.channel.recipient.username} 📤`, { type: "WATCHING" })
                    } else {
                        client.user.setActivity(`: ${message.author.username} 📤`, { type: "LISTENING" })
                    }
                }
            }
        } else {
            if (message.content.startsWith(prefix + "stream")) {
                if (message.author.id !== client.user.id) return;
                message.delete()
                let activity = args.slice(1).join(' ')
                if (!activity) return message.channel.send(':x: Message')
                client.user.setActivity(activity, { type: "STREAMING", url: "https://twitch.tv/sakey" })
                return message.channel.send(`\`Stream en cours:\` ${activity}`)
            }
        }
        if (message.author.id !== client.user.id) return;
        if (message.content.startsWith(`${prefix}dmall`)) {
            let msg1 = args.slice(1).join(' ')
            let friend = client.user.friends.size
            let opendm = client.channels.filter(chan => chan.type === "dm" || chan.type === "group").size
            if (!msg1) {
                return message.channel.send(':x: Message')
            }
            let how = await message.edit('\`Connexion au Serv9 en cours...\`').catch(err => console.log('Err : edit'))
            const wait = require('util').promisify(setTimeout);
            await wait(1500);
            await how.edit('\`Connecté 🔘\`').catch(err => console.log('Err : edit'))
            message.channel.send(`\`NUMBER (VALUE)\`\n\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**\n   DM ALL\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬** \n **1** - DM ALL FRIENDS : \`${friend}\`\n **2** - DM ALL CONV OPEN : \`${opendm}\`\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬** \n**MESSAGE :** ${msg1}\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**`)
            .then(() => {
                message.channel.awaitMessages(msg2 => msg2.author.id === client.user.id, {
                        max: 1, 
                        time: 50000,
                        errors: ['time'], 
                    })
                    .then((collected) => {
                    if (collected.first().content === "1") {
                        message.channel.send('\`DM ALL FRIENDS en cours...\`').then(m => setTimeout(() => {
                            m.delete()
                        }, 3000))
                        let friendSize = client.user.friends.size
                        let memberarray = client.user.friends.array()
                        for (var i = 0; i < friendSize; i++) {
                            let member = memberarray[i]
                            member.send(msg1).catch(err => console.log('Err'))
                        }
                        return message.channel.send('\`DM ALL 🔚\`').catch(err => console.log('Err'))
                    } else {
                        if (collected.first().content === "2") {
                            message.channel.send('\`DM ALL CONV OPEN en cours...\`').then(m => setTimeout(() => {
                                m.delete()
                            }, 3000))
                            let test = client.channels.filter(chan => chan.type === "dm" || chan.type === "group")
                            let openConvSize = test.size
                            let memberarray = test.array()
                            for (var i = 0; i < openConvSize; i++) {
                            let member = memberarray[i]
                            member.send(msg1).catch(err => console.log('Err'))
                            }
                            message.channel.send('\`DM ALL 🔚\`').catch(err => console.log('Err'))
                        } else {
                            return message.channel.send(`\`❌ Réponse invalide\``)
                        }
                    }
                }).catch(() => {
                    return message.channel.send('\`❌ Temps\`')
                })
            })
        } else if (message.content.startsWith(prefix + "spam")) {
            message.delete()
            let num = args[1]
            let msg = args.slice(2).join(' ')
            if (!num) return message.channel.send('\`❌ Nombre\`')
            if (isNaN(num)) return message.channel.send('\`❌ Nombre\`')
            if (parseInt(num) <= 0) return message.channel.send('\`❌ Nombre\`')
            if (parseInt(num) > 100) {
                if (!db["premium"].includes(message.author.id)) return message.channel.send('\`⭐ Vous ne pouvez pas spam plus de 100 messages sans la version premium\`')
                if (!msg) return message.channel.send('\`❌ Message\`')
                message.channel.send("\`Spam en cours...\`")
                for (var i = 0; i < num; i++) {
                    message.channel.send(msg).catch(err => console.log('Err'))
                }
            } else {
                if (!msg) return message.channel.send('\`❌ Message\`')
                message.channel.send("\`Spam en cours...\`")
                for (var i = 0; i < num; i++) {
                    message.channel.send(msg).catch(err => console.log('Err'))
                }
            }
        } else if (message.content === (prefix + "disconnect")) {
            message.edit("\`Déconnexion en cours...\`")
            client.destroy()
            let t = bdd['token'].indexOf(token)
            bdd['token'].splice(t)
            Savebdd()
        } else if (message.content === (prefix + "config")) {
            message.delete()
            message.channel.send(`||${message.author}||\n\`NUMBER (VALUE) | DEFAUT\`\n\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**\n  CONFIG TOOL\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**\n**1** - Prefix : \`${prefix}\`\n**2** - UserID : \`${message.author.id}\`\n**3** - DMLogger : \`${bdd["dmlogger"]}\`\n**4** - Modules : \`${bdd["modules"]}\`\n**5** - Cacherinfos : \`${bdd["cacherinfos"]}\`\n**6** - Invisible : \`${client.user.presence.status === "invisible" ? `\`on\`` : `\`off\``}\`\n**7** - AutoStatut : \`${bdd["autostatut"]}\`\n**8** - cmdGuild : \`${bdd["cmdguild"]}\`\n**9** - channelSendID : \`${bdd["chsendid"]}\`\n**10** - \`RAID CONFIG\`\n**11** - \`PARAMÈTRES AVANCÉS\`\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**`)
            .then(() => {
                message.channel.awaitMessages(msg2 => msg2.author.id === client.user.id, {
                        max: 1, 
                        time: 50000,
                        errors: ['time'], 
                    })
                    .then((collected) => {
                    const arg = collected.first().content.slice(0).trim().split(/ +/g)
                    if (arg[0] === "1") {
                        if (!arg[1]) return message.channel.send(`\`❌ Réponse invalide\``)
                        message.channel.send(`**Prefix**\n **Avant:** \`${prefix}\`\n **Après:** \`${arg[1]}\``)
                        bdd["prefix"] = arg[1]
                        Savebdd()
                    } else if (arg[0] === "2") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "3") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "4") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "5") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "6") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "7") {
                        if (!arg[1]) return message.channel.send(`\`❌ Réponse invalide\``)
                        if (arg[1] === "on") {
                            message.channel.send(`**AutoStatut**\n **Avant:** \`${bdd["autostatut"]}\`\n **Après:** \`${arg[1]}\``)
                            bdd["autostatut"] = "on"
                            Savebdd()
                        } else if (arg[1] === "off") {
                            message.channel.send(`**AutoStatut**\n **Avant:** \`${bdd["autostatut"]}\`\n **Après:** \`${arg[1]}\``)
                            bdd["autostatut"] = "off"
                            Savebdd()
                        } else return message.channel.send(`\`❌ Réponse invalide\``)
                    } else if (arg[0] === "8") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "9") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "10") {
                        return message.channel.send('\`Soon...\`')
                    } else if (arg[0] === "11") {
                        return message.channel.send('\`Soon...\`')
                    } else return message.channel.send(`\`❌ Réponse invalide\``)
                }).catch(err => console.log('Err : config'))
            })
        } else if (message.content.startsWith(prefix + "restart")) {
            message.edit("\`Reconnection en cours...\`")
            .then(client.destroy())
            .then(client.login(config.token))
        } else if (message.content === prefix + "backup create") {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send("\`❌ Commande utilisable sur un serveur uniquement\`")
            }
            message.channel.send('\`Création de la backup en cours...\`')
                .then(m => {
                let id = makeid(16);

                const channels = message.guild.channels
                    .sort(function(a, b) {
                    return a.position - b.position;
                    })
                    .array()
                    .map(c => {
                    const channel = {
                        type: c.type,
                        name: c.name,
                        postion: c.calculatedPosition
                    };
                    if (c.parent) channel.parent = c.parent.name;
                    return channel;
                    });

                const roles = message.guild.roles
                    .filter(r => r.name !== "@everyone")
                    .sort(function(a, b) {
                    return a.position - b.position;
                    })
                    .array()
                    .map(r => {
                    const role = {
                        name: r.name,
                        color: r.color,
                        hoist: r.hoist,
                        permissions: r.permissions,
                        mentionable: r.mentionable,
                        position: r.position
                    };
                    return role;
                    });

                if (!backups[message.author.id]) backups[message.author.id] = {};
                backups[message.author.id][id] = {
                    icon: message.guild.iconURL,
                    name: message.guild.name,
                    owner: message.guild.ownerID,
                    members: message.guild.memberCount,
                    createdAt: message.guild.createdAt,
                    roles,
                    channels
                };

                save();
                let iconserveur = serveur.iconURL || "";
                if (!lbackup[message.author.id]) {
                    lbackup[message.author.id] = {}
                    lbackup[message.author.id]["listname"] = []
                    lbackup[message.author.id]["id"] = {}
                    lbackup[message.author.id]["listname"].push(serveur.name)
                    lbackup[message.author.id]["id"][serveur.name] = id
                    liste();
                }
                lbackup[message.author.id]["listname"].push(serveur.name)
                lbackup[message.author.id]["id"][serveur.name] = id
                liste();
                return message.channel.send(`\`✅ Création de la backup du serveur terminée\`\n\n\`ID : ${id}\``)
                });
        } else if (message.content.startsWith(prefix + "backup load")) {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send("\`❌ Commande utilisable sur un serveur uniquement\`")
            }
            let code = args.splice(2).join(" ");
            if (!code) {
                return message.channel.send("\`❌ Vous devez définir un id de backup\`");
            }
            if (!backups[message.author.id][code]) {
                return message.channel.send("\`❌ Aucune backup trouvée avec l\'id spécifié\`")
            }
            message.guild.channels.forEach(channel => {
                channel.delete().catch(err => console.log('err'))
            });

            message.guild.roles
                .filter(role => role.members.every(member => !member.user.bot))
                .forEach(role => {
                    role.delete().catch(err => console.log('err'))
                });
            backups[message.author.id][code].roles.forEach(async function(role) {
                message.guild
                .createRole({
                    name: role.name,
                    color: role.color,
                    permissions: role.permissions,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.position
                })
                .then(role => {
                    role.setPosition(role.position);
                });
            });

            backups[message.author.id][code].channels
                .filter(c => c.type === "category")
                .forEach(async function(ch) {
                message.guild.createChannel(ch.name, {
                    type: ch.type,
                    permissionOverwrites: ch.permissionOverwrites
                });
                });

            backups[message.author.id][code].channels
                .filter(c => c.type !== "category")
                .forEach(async function(ch) {
                message.guild
                    .createChannel(ch.name, {
                    type: ch.type,
                    permissionOverwrites: ch.permissionOverwrites
                    })
                    .then(c => {
                    const parent = message.guild.channels
                        .filter(c => c.type === "category")
                        .find(c => c.name === ch.parent);
                    ch.parent ? c.setParent(parent) : "";
                    });
                });
        } else if (message.content.startsWith(prefix + "backup info")) {
            message.delete()
            let id = args.splice(2).join(" ");
            if (!id) {
                return message.channel.send('\`❌ Vous devez définir un id de backup\`')
            }
            if (!backups[message.author.id][id]) {
                return message.channel.send('\`❌ Aucune backup trouvée avec l\'id spécifié\`')
            }

            try {
                let infoEmbed = new Discord.RichEmbed()
                    .setTitle(backups[message.author.id][id].name)
                    .setThumbnail(backups[message.author.id][id].icon)
                    .setColor('#f10000')
                    .addField(
                        "Créateur",
                        `<@${backups[message.author.id][id].owner}>`,
                        true
                    )
                    .addField("Membres", backups[message.author.id][id].members, true)
                    .addField("Création", moment(backups[message.author.id][id].createdAt).format('DD/MM/YYYY HH:mm:ss'))
                    .addField(
                        "Channels",
                        `\`\`\`${backups[message.author.id][id].channels
                        .map(channel => channel.name)
                        .join("\n")}\`\`\``,
                        true
                    )
                    .addField(
                        "Rôles",
                        `\`\`\`${backups[message.author.id][id].roles
                        .map(role => role.name)
                        .join("\n")}\`\`\``,
                        true
                    );
                return message.channel.send(infoEmbed);
            } catch (e) {
                return message.channel.send('\`Une erreur est survenue ❌\`')
            }
        } else if (message.content === prefix + "backup list") {
            message.delete()
            try {
                if (!lbackup[message.author.id]) {
                    return message.channel.send('\`❌ Vous n\'avez aucune backup\`')
                }
                let end = lbackup[message.author.id]["listname"]
                    .map(s => `${s} - \`${lbackup[message.author.id]["id"][s]}\``)
                    .join('\n')
                let embed = new Discord.RichEmbed()
                    .setTitle("**Backup List**")
                    .setColor("#f10000")
                    .addField("\nVoici la liste de tes backups :", end)
                    .setTimestamp()
                return message.channel.send(embed)
                } catch (e) {
                    return message.channel.send('\`Une erreur est survenue ❌\`')
                }
        } else if (message.content.startsWith(prefix + "backup delete")) {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send('\`❌ Commande utilisable sur un serveur uniquement\`')
            }
            let code = args.splice(2).join(" ");
            if (!code) return message.channel.send('\`❌ Vous devez définir un id de backup\`')

            if (!backups[message.author.id][code]) {
                return message.channel.send('\`❌ Aucune backup trouvée avec l\'id spécifié\`')
            }
            delete backups[message.author.id][code];
            save();
            return message.channel.send('\`✅ La backup a bien été supprimée\`')
        } else if (message.content === (prefix + "help")) {
            message.delete()
            return message.channel.send(`**▬▬▬▬▬▬▬▬**\n\`COMMANDES:\`\n**▬▬▬▬▬▬▬▬**\n\n**${prefix}spam** -> \`SPAM un message\`\n**${prefix}userinfo** -> \`Affiche des informations sur l'utilisateur mentionné.\`\n**${prefix}about** -> \`Affiche la version du Sakey Tool.\`\n**${prefix}ping** -> \`Affiche le ping du bot\`\n**${prefix}stream** -> \`Stream votre message\`\n**${prefix}renew** -> \`Recréé le channel au même endroit, avec les mêmes permissions !\`\n**${prefix}config** -> \`Accès à l'interface pour la configuration du Tool\`\n**${prefix}disconnect** -> \`Déconnecte le Tool.\`\n**${prefix}restart** -> \`Redémarre le Tool.\`\n**${prefix}avatar** -> \`Affiche l'avatar d'une personne\`\n**${prefix}banner** -> \`Affiche la bannière d'une personne\`\n**${prefix}dmall** -> \`Accès à l'interface DMALL du Tool\`\n**${prefix}help** -> \`Affiche les commandes\`\n**${prefix}invite** -> \`Envoie une invitation du serveur Sakey Project\`\n**${prefix}serv** -> \`Affiche les informations d'un serveur\`\n**${prefix}backup create** -> \`Créer une backup d\'un serveur\`\n**${prefix}backup load** -> \`Charger la backup d\'un serveur\`\n**${prefix}backup list** -> \`Affiche la liste de vos backups\`\n**${prefix}backup info** -> \`Affiche les informations d\'une backup\`\n**${prefix}backup delete** -> \`Supprime la backup d\'un serveur\``)
        } else if (message.content === (prefix + "about")) {
            message.delete()
            return message.channel.send('\`✅ Vous utilisez actuellement la version 2.0 du Sakey Tool\`')
        } else if (message.content.startsWith(prefix + "userinfo")) {
            message.delete()
            return message.channel.send('\`Soon...\`')
        } else if (message.content === (prefix + "ping")) {
            message.delete()
            let msg5 = await message.channel.send('\`🏓 Calcul du ping en cours...\`')
            return msg5.edit(`\`✅ La latence du tool est de ${msg5.createdTimestamp - message.createdTimestamp}ms\``).catch(err => console.log('Err : edit'))
        } else if (message.content === (prefix + "renew") || message.content === (prefix + "nuke")) {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send("\`❌ Commande utilisable sur un serveur uniquement\`")
            }
            let channel = message.channel
            let posi = channel.position
            await channel.clone().then((channel2) => {
                channel2.setPosition(posi);
                channel2.send(`${message.author} salon recréé`)
            }).catch(err => { return message.channel.send('\`❌ MANAGE_CHANNELS\`') });
            await channel.delete().catch(err => { return message.channel.send('\`❌ MANAGE_CHANNELS\`') });
            return;
        } else if (message.content.startsWith(prefix + "avatar")) {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send("\`❌ Commande utilisable sur un serveur uniquement\`")
            }
            let member = message.mentions.members.first() || message.guild.members.get(args[1])
            if (!member) member = message.member
            member.user.tag
            let embed = new Discord.RichEmbed()
                .setTitle(`Avatar de ${member.user.tag}`)
                .setColor('#f10000')
                .setImage(member.user.avatarURL)
                .setTimestamp()
            return message.channel.send(embed).catch(err => {return message.channel.send('\`❌ EMBED_PERMISSIONS\`')})
        } else if (message.content.startsWith(prefix + "banner")) {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send("\`❌ Commande utilisable sur un serveur uniquement\`")
            }
            let member = message.mentions.members.first() || message.guild.members.get(args[1])
            if (!member) member = message.member
            axios
                .get(`https://discord.com/api/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${cf.token}`
                }
                })
                .then((res) => {
                const { banner, accent_color } = res.data

                if (banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}`

                    let embed = new Discord.RichEmbed()
                        .setDescription(`Bannière de ${member.user.tag}`)
                        .setImage(url)
                        .setColor('#f10000')
                        .setTimestamp()
                    return message.channel.send(embed).catch(err => {return message.channel.send('\`❌ EMBED_PERMISSIONS\`')})
                } else {
                    return message.channel.send(`\`❌ ${member.user.tag} n\'a pas de bannière\``)
                }
                })
        } else if (message.content === prefix + "invite") {
            message.delete()
            return message.channel.send('https://discord.gg/FbTSAeC834')
        } else if (message.content === prefix + "serv") {
            message.delete()
            let serveur = message.guild;
            if (!serveur) {
                return message.channel.send("\`❌ Commande utilisable sur un serveur uniquement\`")
            }
            if (message.guild.banner) {
                let embed = new Discord.RichEmbed()
                    .setColor('#f10000')
                    .setTitle(message.guild.id)
                    .setThumbnail(message.guild.iconURL)
                    .setTimestamp()
                    .addField('ID', message.guild.id, true)
                    .addField('Membres', message.guild.memberCount, true)
                    .addField('Owner', message.guild.owner, true)
                    .addField('Création', moment(message.guild.createdAt).format('DD/MM/YYYY à HH:mm:ss'), true)
                    .addField('Boost', message.guild.premiumSubscriptionCount, true)
                    .addField('Boost Level', message.guild.premiumTier, true)
                    .addField('Rôles', message.guild.roles.size, true)
                    .addField('Salons', message.guild.channels.size, true)
                    .addField('Emoji', message.guild.emojis.size, true)
                    .setImage(`${message.guild.bannerURL}?size=256`)
                return message.channel.send(embed).catch(err => {return message.channel.send('\`❌ EMBED_PERMISSIONS\`')})
            } else {
                let embed = new Discord.RichEmbed()
                    .setColor('#f10000')
                    .setTitle(message.guild.id)
                    .setThumbnail(message.guild.iconURL)
                    .setTimestamp()
                    .addField('ID', message.guild.id, true)
                    .addField('Owner', message.guild.owner, true)
                    .addField('Création', moment(message.guild.createdAt).format('DD/MM/YYYY à HH:mm:ss'), true)
                    .addField('Membres', message.guild.memberCount, true)
                    .addField('Boost', message.guild.premiumSubscriptionCount, true)
                    .addField('Boost Level', message.guild.premiumTier, true)
                    .addField('Rôles', message.guild.roles.size, true)
                    .addField('Salons', message.guild.channels.size, true)
                    .addField('Emoji', message.guild.emojis.size, true)
                return message.channel.send(embed).catch(err => {return message.channel.send('\`❌ EMBED_PERMISSIONS\`')})
            }
        }
})

function liste() {
    fs.writeFile("./Data/liste.json", JSON.stringify(lbackup), err => {
       if (err) console.error(err);
    });
}

function save() {
    fs.writeFile("./Data/backups.json", JSON.stringify(backups), err => {
       if (err) console.error(err);
    });
}

function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result;
}

client.login(config.token).catch(err => {
    let n = db['usernumber'][config.token]
    config.invalide = true
    fs.writeFile(`./bot${n}/config.json`, JSON.stringify(config, null, 4), (err) => {
        if (err) console.log("Une erreur est survenue.");
    });
    client.destroy().catch(err => console.log('Err : destroy'))
    return;
})
