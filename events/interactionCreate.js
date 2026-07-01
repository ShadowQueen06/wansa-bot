const { mainMenuEmbed, mainMenuButtons } = require("../utils/menu.js");
const kat = require("../games/kat.js");
const quiz = require("../games/quiz.js");
const xo = require("../games/xo.js");
const solo = require("../games/solo.js");
const profile = require("../games/profile.js");

module.exports = async (interaction) => {
    try {
        if (!interaction.isButton()) return;

        const customId = interaction.customId;

        if (customId.startsWith("xo_")) return xo.handleButton(interaction);
        if (customId.startsWith("quiz_") || customId === "quiz_start") return quiz.handleButton(interaction);
        if (customId.startsWith("solo_")) return solo.handleButton(interaction);

        if (customId === "kat") {
            return interaction.update({ embeds: [kat.menuEmbed()], components: kat.menuButtons() });
        }

        if (customId === "kat_new") {
            return interaction.update({ embeds: [kat.questionEmbed(interaction.user)], components: kat.menuButtons() });
        }

        if (customId === "quiz") {
            return interaction.update({ embeds: [quiz.menuEmbed()], components: quiz.menuButtons() });
        }

        if (customId === "solo") {
            return interaction.update({ embeds: [solo.menuEmbed()], components: solo.menuButtons() });
        }

        if (customId === "profile") {
            return interaction.update({ embeds: [profile.profileEmbed(interaction.user)], components: profile.backButtons() });
        }

        if (customId === "top") {
            return interaction.update({ embeds: [profile.topEmbed()], components: profile.backButtons() });
        }

        if (customId === "xo") {
            return interaction.reply({
                content: "لبداية لعبة إكس أو اكتب:\n`-xo @player`",
                ephemeral: true
            });
        }

        if (customId === "back") {
            return interaction.update({ embeds: [mainMenuEmbed()], components: mainMenuButtons() });
        }

        if (customId === "close") {
            return interaction.update({ content: "تم إغلاق القائمة.", embeds: [], components: [] });
        }

        return interaction.reply({ content: "هذه الميزة قريبًا.", ephemeral: true });
    } catch (error) {
        console.error("Interaction error:", error);
    }
};
