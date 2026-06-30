const questions = require("./data/kat_questions.json");

let lastKatQuestion = null;

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("clientReady", () => {
    console.log(`✅ ${client.user.tag} شغال`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content === "-العاب") {
        await message.reply({
            embeds: [mainMenuEmbed()],
            components: mainMenuButtons()
        });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "kat") {
        return interaction.update({
            embeds: [katEmbed()],
            components: katButtons()
        });
    }

    if (interaction.customId === "new_kat") {
        return interaction.update({
            embeds: [katQuestionEmbed()],
            components: katButtons()
        });
    }

    if (interaction.customId === "xo") {
        return interaction.update({
            embeds: [xoEmbed()],
            components: xoButtons()
        });
    }

    if (interaction.customId === "start_xo") {
        return interaction.reply({
            content: "قريبًا نضيف اختيار الخصم ونبدأ اللعبة.",
            ephemeral: true
        });
    }

    if (interaction.customId === "back") {
        return interaction.update({
            embeds: [mainMenuEmbed()],
            components: mainMenuButtons()
        });
    }

    if (interaction.customId === "close") {
        return interaction.update({
            content: "تم إغلاق القائمة.",
            embeds: [],
            components: []
        });
    }

    return interaction.reply({
        content: "هذه الميزة قريبًا.",
        ephemeral: true
    });
});

function mainMenuEmbed() {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("🎮 ونسة")
        .setDescription(`
أهلًا بك في ونسة.

اختر لعبة من الأزرار بالأسفل.

━━━━━━━━━━━━━━━━━━

📚 الأسئلة: ${questions.length}
🎮 الألعاب: 8
⭐ قريبًا المزيد...
        `);
}

function mainMenuButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("kat")
                .setLabel("كت")
                .setEmoji("🎭")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("xo")
                .setLabel("إكس أو")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("quiz")
                .setLabel("أسئلة")
                .setEmoji("❓")
                .setStyle(ButtonStyle.Secondary)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("solo")
                .setLabel("ألعاب فردية")
                .setEmoji("🎲")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("profile")
                .setLabel("بروفايلي")
                .setEmoji("👤")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("top")
                .setLabel("التوب")
                .setEmoji("🏆")
                .setStyle(ButtonStyle.Secondary)
        ),

        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("close")
                .setLabel("إغلاق")
                .setEmoji("❌")
                .setStyle(ButtonStyle.Danger)
        )
    ];
}

function katEmbed() {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("🎭 كت")
        .setDescription(`
اضغط على الزر للحصول على سؤال عشوائي.

━━━━━━━━━━━━━━━━━━

📚 عدد الأسئلة: ${questions.length}
🎲 يتم اختيار سؤال مختلف في كل مرة
        `);
}

function katQuestionEmbed() {
    let randomQuestion;

    do {
        randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    } while (
        lastKatQuestion &&
        randomQuestion.id === lastKatQuestion.id &&
        questions.length > 1
    );

    lastKatQuestion = randomQuestion;

    return new EmbedBuilder()
        .setColor("#7B2CBF")
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

function katButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("new_kat")
                .setLabel("سؤال جديد")
                .setEmoji("🎲")
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
    ];
}

function xoEmbed() {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("❌⭕ إكس أو")
        .setDescription(`
العب ضد أحد أصدقائك.

━━━━━━━━━━━━━━━━━━

👥 عدد اللاعبين: 2

اضغط على "ابدأ لعبة".
        `);
}

function xoButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("start_xo")
                .setLabel("ابدأ لعبة")
                .setEmoji("🎮")
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

client.login(process.env.TOKEN);
