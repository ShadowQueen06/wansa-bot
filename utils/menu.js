const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { color } = require("../config.js");
const katQuestions = require("../data/kat_questions.json");
const quizQuestions = require("../data/quiz_questions.json");

function mainMenuEmbed() {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🎮 ونسة")
        .setDescription(`
أهلًا بك في ونسة.

اختر لعبة من الأزرار بالأسفل.

━━━━━━━━━━━━━━━━━━

🎭 أسئلة كت: ${katQuestions.length}
❓ أسئلة عامة: ${quizQuestions.length}
🎮 الألعاب: كت، إكس أو، أسئلة، ألعاب فردية
🪙 نظام عملات
⭐ نظام XP ومستويات
        `);
}

function mainMenuButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("kat").setLabel("كت").setEmoji("🎭").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("xo").setLabel("إكس أو").setEmoji("❌").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("quiz").setLabel("أسئلة").setEmoji("❓").setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("solo").setLabel("ألعاب فردية").setEmoji("🎲").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("profile").setLabel("بروفايلي").setEmoji("👤").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("top").setLabel("التوب").setEmoji("🏆").setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

module.exports = { mainMenuEmbed, mainMenuButtons };
