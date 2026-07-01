const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { color } = require("../config.js");
const { getPlayer, getTopPlayers, xpNeeded } = require("../utils/db.js");

function profileEmbed(user) {
    const player = getPlayer(user);

    return new EmbedBuilder()
        .setColor(color)
        .setTitle("👤 بروفايلي")
        .setDescription(`
👤 الاسم: ${user.username}

🏅 المستوى: ${player.level}
⭐ XP: ${player.xp} / ${xpNeeded(player.level)}
🪙 العملات: ${player.coins}

━━━━━━━━━━━━━━━━━━

🎭 كت: ${player.stats.kat}
❓ إجابات صحيحة: ${player.stats.quizCorrect}
❌ إجابات خاطئة: ${player.stats.quizWrong}
❌⭕ انتصارات XO: ${player.stats.xoWins}
🎲 انتصارات فردية: ${player.stats.soloWins}
        `);
}

function topEmbed() {
    const players = getTopPlayers(10);

    const lines = players.length
        ? players.map((p, i) => `${i + 1}. ${p.name} | مستوى ${p.level} | 🪙 ${p.coins}`).join("\n")
        : "لا توجد بيانات بعد.";

    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🏆 التوب")
        .setDescription(lines);
}

function backButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("back").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

module.exports = {
    profileEmbed,
    topEmbed,
    backButtons
};
