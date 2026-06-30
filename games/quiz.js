const quizQuestions = require("../data/quiz_questions.json");

const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

function quizMenuEmbed() {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("❓ أسئلة عامة")
        .setDescription(`
اختبر معلوماتك بسؤال عشوائي.

━━━━━━━━━━━━━━━━━━

📚 عدد الأسئلة: ${quizQuestions.length}
🏆 الإجابة الصحيحة تعطيك نقطة لاحقًا

اضغط على "ابدأ".
        `);
}

function quizMenuButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("start_quiz")
                .setLabel("ابدأ")
                .setEmoji("▶️")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("back")
                .setLabel("رجوع")
                .setEmoji("🔙")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("close")
                .setLabel("إغلاق")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
        )
    ];
}

function randomQuiz() {
    return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
}

function quizQuestionEmbed(question) {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
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

function quizAnswerButtons(question) {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`quiz_${question.id}_0`)
                .setLabel(question.answers[0])
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`quiz_${question.id}_1`)
                .setLabel(question.answers[1])
                .setStyle(ButtonStyle.Primary)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`quiz_${question.id}_2`)
                .setLabel(question.answers[2])
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`quiz_${question.id}_3`)
                .setLabel(question.answers[3])
                .setStyle(ButtonStyle.Primary)
        )
    ];
}

async function handleQuizButton(interaction) {
    if (interaction.customId === "start_quiz") {
        const question = randomQuiz();

        return interaction.update({
            embeds: [quizQuestionEmbed(question)],
            components: quizAnswerButtons(question)
        });
    }

    if (!interaction.customId.startsWith("quiz_")) return false;

    const parts = interaction.customId.split("_");
    const questionId = Number(parts[1]);
    const answerIndex = Number(parts[2]);

    const question = quizQuestions.find(q => q.id === questionId);

    if (!question) {
        await interaction.reply({
            content: "السؤال غير موجود.",
            ephemeral: true
        });
        return true;
    }

    const isCorrect = answerIndex === question.correct;

    const resultText = isCorrect
        ? "✅ إجابة صحيحة!"
        : `❌ إجابة خاطئة.\n\nالإجابة الصحيحة: ${question.answers[question.correct]}`;

    await interaction.update({
        embeds: [
            new EmbedBuilder()
                .setColor(isCorrect ? "#2ECC71" : "#E74C3C")
                .setTitle("❓ أسئلة عامة")
                .setDescription(`
${resultText}

━━━━━━━━━━━━━━━━━━

📚 التصنيف: ${question.category}
🆔 السؤال: #${question.id}
                `)
        ],
        components: [
            new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("start_quiz")
                    .setLabel("سؤال جديد")
                    .setEmoji("🔄")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("رجوع")
                    .setEmoji("🔙")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("close")
                    .setLabel("إغلاق")
                    .setEmoji("❌")
                    .setStyle(ButtonStyle.Danger)
            )
        ]
    });

    return true;
}

module.exports = {
    quizMenuEmbed,
    quizMenuButtons,
    handleQuizButton
};
