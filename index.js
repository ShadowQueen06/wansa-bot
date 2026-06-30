const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
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

        const embed = new EmbedBuilder()
            .setColor("#7B2CBF")
            .setTitle("🎮 ونسة")
            .setDescription(`
أهلًا بك في ونسة.

اختر اللعبة التي تريدها.

━━━━━━━━━━━━━━

🎭 كت
❌⭕ إكس أو
❓ أسئلة عامة
🎲 ألعاب فردية

قريبًا سيتم إضافة المزيد من الألعاب.
            `);

        message.reply({
            embeds: [embed]
        });

    }

});

client.login(process.env.TOKEN);
