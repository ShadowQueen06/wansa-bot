const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { color, rewards } = require("../config.js");
const { addReward } = require("../utils/db.js");

const numberGames = new Map();

function menuEmbed() {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🎲 ألعاب فردية")
        .setDescription(`
اختر لعبة فردية.

━━━━━━━━━━━━━━━━━━

🎯 تخمين الرقم
🪨 حجر ورقة مقص
🎲 رمي النرد
        `);
}

function menuButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("solo_number").setLabel("تخمين الرقم").setEmoji("🎯").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("solo_rps").setLabel("حجر ورقة مقص").setEmoji("🪨").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("solo_dice").setLabel("رمي النرد").setEmoji("🎲").setStyle(ButtonStyle.Secondary)
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("back").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

function numberEmbed(user) {
    const number = Math.floor(Math.random() * 5) + 1;
    numberGames.set(user.id, number);

    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🎯 تخمين الرقم")
        .setDescription("اختر رقم من 1 إلى 5.");
}

function numberButtons() {
    return [
        new ActionRowBuilder().addComponents(
            ...[1, 2, 3, 4, 5].map(n =>
                new ButtonBuilder().setCustomId(`solo_guess_${n}`).setLabel(String(n)).setStyle(ButtonStyle.Primary)
            )
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("solo").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

function rpsEmbed() {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle("🪨 حجر ورقة مقص")
        .setDescription("اختر حركتك.");
}

function rpsButtons() {
    return [
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("solo_rps_rock").setLabel("حجر").setEmoji("🪨").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("solo_rps_paper").setLabel("ورقة").setEmoji("📄").setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId("solo_rps_scissors").setLabel("مقص").setEmoji("✂️").setStyle(ButtonStyle.Primary)
        ),
        new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId("solo").setLabel("رجوع").setEmoji("🔙").setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId("close").setLabel("إغلاق").setEmoji("❌").setStyle(ButtonStyle.Danger)
        )
    ];
}

async function handleButton(interaction) {
    const id = interaction.customId;

    if (id === "solo_number") {
        return interaction.update({
            embeds: [numberEmbed(interaction.user)],
            components: numberButtons()
        });
    }

    if (id.startsWith("solo_guess_")) {
        const guess = Number(id.split("_")[2]);
        const real = numberGames.get(interaction.user.id);
        const win = guess === real;

        if (win) addReward(interaction.user, rewards.soloCoins, rewards.soloXp, "soloWins");
        numberGames.delete(interaction.user.id);

        return interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(win ? "#2ECC71" : "#E74C3C")
                    .setTitle("🎯 تخمين الرقم")
                    .setDescription(win
                        ? `✅ صح! الرقم كان ${real}\n\n🪙 +${rewards.soloCoins}\n⭐ +${rewards.soloXp}`
                        : `❌ خطأ. الرقم كان ${real}`)
            ],
            components: menuButtons()
        });
    }

    if (id === "solo_rps") {
        return interaction.update({
            embeds: [rpsEmbed()],
            components: rpsButtons()
        });
    }

    if (id.startsWith("solo_rps_")) {
        const choices = ["rock", "paper", "scissors"];
        const names = { rock: "حجر", paper: "ورقة", scissors: "مقص" };
        const userChoice = id.split("_")[2];
        const botChoice = choices[Math.floor(Math.random() * choices.length)];

        let result = "draw";
        if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) result = "win";
        else if (userChoice !== botChoice) result = "lose";

        if (result === "win") addReward(interaction.user, rewards.soloCoins, rewards.soloXp, "soloWins");

        return interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(result === "win" ? "#2ECC71" : result === "lose" ? "#E74C3C" : color)
                    .setTitle("🪨 حجر ورقة مقص")
                    .setDescription(`
اختيارك: ${names[userChoice]}
اختيار ونسة: ${names[botChoice]}

${result === "win" ? `✅ فزت!\n🪙 +${rewards.soloCoins}\n⭐ +${rewards.soloXp}` : result === "lose" ? "❌ خسرت." : "تعادل!"}
                    `)
            ],
            components: menuButtons()
        });
    }

    if (id === "solo_dice") {
        const userRoll = Math.floor(Math.random() * 6) + 1;
        const botRoll = Math.floor(Math.random() * 6) + 1;
        const win = userRoll > botRoll;

        if (win) addReward(interaction.user, rewards.soloCoins, rewards.soloXp, "soloWins");

        return interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor(win ? "#2ECC71" : "#E74C3C")
                    .setTitle("🎲 رمي النرد")
                    .setDescription(`
أنت رميت: ${userRoll}
ونسة رمى: ${botRoll}

${win ? `✅ فزت!\n🪙 +${rewards.soloCoins}\n⭐ +${rewards.soloXp}` : userRoll === botRoll ? "تعادل!" : "❌ خسرت."}
                    `)
            ],
            components: menuButtons()
        });
    }

    return false;
}

module.exports = {
    menuEmbed,
    menuButtons,
    handleButton
};
