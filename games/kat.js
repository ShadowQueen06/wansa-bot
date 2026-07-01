const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { color } = require("../config.js");
const questions = require("../data/kat_questions.json");
const { addReward } = require("../utils/db.js");

let lastQuestion = null;

function menuEmbed() {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🎭 كت")
        .setDescription(`
اضغط على الزر للحصول على سؤال عشوائي.

━━━━━━━━━━━━━━━━━━

📚 عدد الأسئلة: ${questions.length}
🎲 يتم اختيار سؤال مختلف في كل مرة
        `);
}

function menuButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("kat_new").setLabel("سؤال جديد").setEmoji("🎲").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("back").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

function questionEmbed(user) {
    let randomQuestion;

    do {
        randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    } while (lastQuestion && randomQuestion.id === lastQuestion.id && questions.length > 1);

    lastQuestion = randomQuestion;
    addReward(user, 1, 1, "kat");

    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🎭 كت")
        .setDescription(`
❓ السؤال

${randomQuestion.question}

━━━━━━━━━━━━━━━━━━

📚 التصنيف: ${randomQuestion.category}
🆔 السؤال: #${randomQuestion.id}
📖 المجموع: ${questions.length}
        `);
}

module.exports = { menuEmbed, menuButtons, questionEmbed };
