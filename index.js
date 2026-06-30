const questions = require("./data/kat_questions.json");
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

📚 الأسئلة: 2000
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

function katQuestionEmbed() {
    const questions = [
        "إذا تقدر ترجع يوم واحد من حياتك، أي يوم تختار؟",
        "شنو أكثر موقف ضحكك وما نسيته؟",
        "منو أكثر شخص تثق بيه؟",
        "شنو الشي اللي تحبه بنفسك؟",
        "إذا ربحت مليون، شنو أول شي تشتري؟"
    ];

    const question = questions[Math.floor(Math.random() * questions.length)];

    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("🎭 كت")
        .setDescription(`
❓ السؤال

${question}

━━━━━━━━━━━━━━━━━━

📚 التصنيف: كت
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

client.login(process.env.TOKEN);
