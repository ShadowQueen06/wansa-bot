const { prefix } = require("../config.js");
const { mainMenuEmbed, mainMenuButtons } = require("../utils/menu.js");
const xo = require("../games/xo.js");
const kat = require("../games/kat.js");

module.exports = async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    if (message.content === `${prefix}العاب`) {
        return message.reply({
            embeds: [mainMenuEmbed()],
            components: mainMenuButtons()
        });
    }

    if (message.content === `${prefix}كت`) {
        return message.reply({
            embeds: [kat.questionEmbed(message.author)],
            components: kat.menuButtons()
        });
    }

    if (message.content.startsWith(`${prefix}xo`)) {
        return xo.start(message);
    }
};
