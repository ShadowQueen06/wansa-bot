const { prefix } = require("../config.js");
const { mainMenuEmbed, mainMenuButtons } = require("../utils/menu.js");
const xo = require("../games/xo.js");

module.exports = async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    if (message.content === `${prefix}العاب`) {
        return message.reply({
            embeds: [mainMenuEmbed()],
            components: mainMenuButtons()
        });
    }

    if (message.content.startsWith(`${prefix}xo`)) {
        return xo.start(message);
    }
};
