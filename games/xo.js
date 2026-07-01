const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { color, rewards } = require("../config.js");
const { addReward } = require("../utils/db.js");

const games = new Map();

function start(message) {
    const opponent = message.mentions.users.first();

    if (!opponent) return message.reply("منشن اللاعب هكذا: `-xo @player`");
    if (opponent.bot) return message.reply("ما تگدر تلعب ضد بوت.");
    if (opponent.id === message.author.id) return message.reply("ما تگدر تلعب ضد نفسك.");

    const gameId = `${message.channel.id}_${Date.now()}`;

    const game = {
        id: gameId,
        players: [message.author.id, opponent.id],
        symbols: { [message.author.id]: "❌", [opponent.id]: "⭕" },
        turn: message.author.id,
        board: Array(9).fill(null)
    };

    games.set(gameId, game);

    return message.reply({
        embeds: [boardEmbed(game)],
        components: boardButtons(game)
    });
}

function boardEmbed(game) {
    return new EmbedBuilder()
        .setColor(color)
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

function boardButtons(game) {
    const rows = [];
    for (let r = 0; r < 3; r++) {
        const row = new ActionRowBuilder();
        for (let c = 0; c < 3; c++) {
            const index = r * 3 + c;
            const value = game.board[index];

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`xo_${game.id}_${index}`)
                    .setLabel(value || `${index + 1}`)
                    .setStyle(value ? ButtonStyle.Secondary : ButtonStyle.Primary)
                    .setDisabled(Boolean(value))
            );
        }
        rows.push(row);
    }
    return rows;
}

function checkWinner(board) {
    const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of wins) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    if (board.every(Boolean)) return "draw";
    return null;
}

async function handleButton(interaction) {
    if (!interaction.customId.startsWith("xo_")) return false;

    const parts = interaction.customId.split("_");
    const index = Number(parts.pop());
    const gameId = parts.slice(1).join("_");
    const game = games.get(gameId);

    if (!game) return interaction.reply({ content: "اللعبة انتهت.", ephemeral: true });
    if (!game.players.includes(interaction.user.id)) return interaction.reply({ content: "هذه اللعبة مو إلك.", ephemeral: true });
    if (interaction.user.id !== game.turn) return interaction.reply({ content: "مو دورك.", ephemeral: true });
    if (game.board[index]) return interaction.reply({ content: "هذا المكان محجوز.", ephemeral: true });

    game.board[index] = game.symbols[interaction.user.id];
    const result = checkWinner(game.board);

    if (result && result !== "draw") {
        games.delete(gameId);
        addReward(interaction.user, rewards.xoWinCoins, rewards.xoWinXp, "xoWins");

        return interaction.update({
            embeds: [new EmbedBuilder().setColor(color).setTitle("❌⭕ إكس أو").setDescription(`
الفائز: <@${interaction.user.id}> ${result}

🪙 +${rewards.xoWinCoins}
⭐ +${rewards.xoWinXp}

${renderBoard(game.board)}
            `)],
            components: []
        });
    }

    if (result === "draw") {
        games.delete(gameId);
        return interaction.update({
            embeds: [new EmbedBuilder().setColor(color).setTitle("❌⭕ إكس أو").setDescription(`
تعادل!

${renderBoard(game.board)}
            `)],
            components: []
        });
    }

    game.turn = game.players.find(id => id !== interaction.user.id);

    return interaction.update({
        embeds: [boardEmbed(game)],
        components: boardButtons(game)
    });
}

module.exports = { start, handleButton };
