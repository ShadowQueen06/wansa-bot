const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");

const xoGames = new Map();

function xoMenuEmbed() {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("❌⭕ إكس أو")
        .setDescription(`
العب ضد أحد أصدقائك.

━━━━━━━━━━━━━━━━━━

اكتب الأمر بهذا الشكل:

-xo @player
        `);
}

function startXO(message) {
    const opponent = message.mentions.users.first();

    if (!opponent) {
        return message.reply("منشن اللاعب هكذا: `-xo @player`");
    }

    if (opponent.bot) {
        return message.reply("ما تگدر تلعب ضد بوت.");
    }

    if (opponent.id === message.author.id) {
        return message.reply("ما تگدر تلعب ضد نفسك.");
    }

    const gameId = message.channel.id;

    xoGames.set(gameId, {
        players: [message.author.id, opponent.id],
        symbols: {
            [message.author.id]: "❌",
            [opponent.id]: "⭕"
        },
        turn: message.author.id,
        board: Array(9).fill(null)
    });

    return message.reply({
        embeds: [boardEmbed(xoGames.get(gameId))],
        components: boardButtons(gameId)
    });
}

function boardEmbed(game) {
    return new EmbedBuilder()
        .setColor("#7B2CBF")
        .setTitle("❌⭕ إكس أو")
        .setDescription(`
الدور الحالي: <@${game.turn}>

${renderBoard(game.board)}
        `);
}

function renderBoard(board) {
    return `
${board[0] || "⬜"} ${board[1] || "⬜"} ${board[2] || "⬜"}
${board[3] || "⬜"} ${board[4] || "⬜"} ${board[5] || "⬜"}
${board[6] || "⬜"} ${board[7] || "⬜"} ${board[8] || "⬜"}
`;
}

function boardButtons(gameId) {
    const game = xoGames.get(gameId);

    const rows = [];

    for (let r = 0; r < 3; r++) {
        const row = new ActionRowBuilder();

        for (let c = 0; c < 3; c++) {
            const index = r * 3 + c;

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`xo_${gameId}_${index}`)
                    .setLabel(game.board[index] || " ")
                    .setStyle(game.board[index] ? ButtonStyle.Secondary : ButtonStyle.Primary)
                    .setDisabled(Boolean(game.board[index]))
            );
        }

        rows.push(row);
    }

    return rows;
}

function checkWinner(board) {
    const wins = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const [a, b, c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(Boolean)) return "draw";

    return null;
}

async function handleXOButton(interaction) {
    if (!interaction.customId.startsWith("xo_")) return false;

    const parts = interaction.customId.split("_");
    const gameId = parts[1];
    const index = Number(parts[2]);

    const game = xoGames.get(gameId);

    if (!game) {
        await interaction.reply({
            content: "اللعبة انتهت أو غير موجودة.",
            ephemeral: true
        });
        return true;
    }

    if (!game.players.includes(interaction.user.id)) {
        await interaction.reply({
            content: "هذه اللعبة مو إلك.",
            ephemeral: true
        });
        return true;
    }

    if (interaction.user.id !== game.turn) {
        await interaction.reply({
            content: "مو دورك.",
            ephemeral: true
        });
        return true;
    }

    if (game.board[index]) {
        await interaction.reply({
            content: "هذا المكان محجوز.",
            ephemeral: true
        });
        return true;
    }

    game.board[index] = game.symbols[interaction.user.id];

    const result = checkWinner(game.board);

    if (result && result !== "draw") {
        xoGames.delete(gameId);

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor("#7B2CBF")
                    .setTitle("❌⭕ إكس أو")
                    .setDescription(`
الفائز: <@${interaction.user.id}> ${result}

${renderBoard(game.board)}
                    `)
            ],
            components: []
        });

        return true;
    }

    if (result === "draw") {
        xoGames.delete(gameId);

        await interaction.update({
            embeds: [
                new EmbedBuilder()
                    .setColor("#7B2CBF")
                    .setTitle("❌⭕ إكس أو")
                    .setDescription(`
تعادل!

${renderBoard(game.board)}
                    `)
            ],
            components: []
        });

        return true;
    }

    game.turn = game.players.find(id => id !== interaction.user.id);

    await interaction.update({
        embeds: [boardEmbed(game)],
        components: boardButtons(gameId)
    });

    return true;
}

module.exports = {
    xoMenuEmbed,
    startXO,
    handleXOButton
};
