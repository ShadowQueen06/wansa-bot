const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { color, rewards } = require("../config.js");
const questions = require("../data/quiz_questions.json");
const { addReward } = require("../utils/db.js");

let lastQuestionId = null;

function menuEmbed() {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle("❓ أسئلة عامة")
        .setDescription(`
اختبر معلوماتك بسؤال عشوائي.

━━━━━━━━━━━━━━━━━━

📚 عدد الأسئلة: ${questions.length}
🏆 الإجابة الصحيحة: +${rewards.quizCorrectCoins} عملات و +${rewards.quizCorrectXp} XP

اضغط على "ابدأ".
        `);
}

function menuButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("quiz_start").setLabel("ابدأ").setEmoji("▶️").setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId("back").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

function randomQuestion() {
    let q;
    do {
        q = questions[Math.floor(Math.random() * questions.length)];
    } while (q.id === lastQuestionId && questions.length > 1);

    lastQuestionId = q.id;
    return q;
}

function questionEmbed(question) {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle("❓ أسئلة عامة")
        .setDescription(`
📚 التصنيف: ${question.category}

${question.question}

━━━━━━━━━━━━━━━━━━

A) ${question.answers[0]}
B) ${question.answers[1]}
C) ${question.answers[2]}
D) ${question.answers[3]}
        `);
}

function answerButtons(question) {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`quiz_answer_${question.id}_0`).setLabel(question.answers[0].slice(0, 80)).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`quiz_answer_${question.id}_1`).setLabel(question.answers[1].slice(0, 80)).setStyle(ButtonStyle.Primary)
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(`quiz_answer_${question.id}_2`).setLabel(question.answers[2].slice(0, 80)).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(`quiz_answer_${question.id}_3`).setLabel(question.answers[3].slice(0, 80)).setStyle(ButtonStyle.Primary)
        )
    ];
}

async function handleButton(interaction) {
    if (interaction.customId === "quiz_start") {
        const question = randomQuestion();

        return interaction.update({
            embeds: [questionEmbed(question)],
            components: answerButtons(question)
        });
    }

    if (!interaction.customId.startsWith("quiz_answer_")) return false;

    const parts = interaction.customId.split("_");
    const questionId = Number(parts[2]);
    const answerIndex = Number(parts[3]);
    const question = questions.find(q => q.id === questionId);

    if (!question) {
        return interaction.reply({ content: "السؤال غير موجود.", ephemeral: true });
    }

    const isCorrect = answerIndex === question.correct;

    if (isCorrect) {
        addReward(interaction.user, rewards.quizCorrectCoins, rewards.quizCorrectXp, "quizCorrect");
    } else {
        addReward(interaction.user, 0, 0, "quizWrong");
    }

    return interaction.update({
        embeds: [
            new EmbedBuilder()
                .setColor(isCorrect ? "#2ECC71" : "#E74C3C")
                .setTitle("❓ أسئلة عامة")
                .setDescription(`
${isCorrect ? `✅ إجابة صحيحة!\n\n🪙 +${rewards.quizCorrectCoins} عملات\n⭐ +${rewards.quizCorrectXp} XP` : `❌ إجابة خاطئة.\n\nالإجابة الصحيحة: ${question.answers[question.correct]}`}

━━━━━━━━━━━━━━━━━━

📚 التصنيف: ${question.category}
🆔 السؤال: #${question.id}
                `)
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("quiz_start").setLabel("سؤال جديد").setEmoji("🔄").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId("back").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
            )
        ]
    });
}

module.exports = { menuEmbed, menuButtons, handleButton };
