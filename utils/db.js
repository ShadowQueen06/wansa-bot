const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/players.json");

function readData() {
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}", "utf8");

    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
    } catch {
        return {};
    }
}

function writeData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function defaultPlayer(user) {
    return {
        id: user.id,
        name: user.username,
        coins: 0,
        xp: 0,
        level: 1,
        stats: {
            kat: 0,
            quizCorrect: 0,
            quizWrong: 0,
            xoWins: 0,
            soloWins: 0
        }
    };
}

function getPlayer(user) {
    const data = readData();

    if (!data[user.id]) {
        data[user.id] = defaultPlayer(user);
        writeData(data);
    }

    data[user.id].name = user.username;
    return data[user.id];
}

function savePlayer(player) {
    const data = readData();
    data[player.id] = player;
    writeData(data);
}

function xpNeeded(level) {
    return level * 100;
}

function addReward(user, coins, xp, statName = null) {
    const player = getPlayer(user);

    player.coins += coins;
    player.xp += xp;

    if (statName && player.stats[statName] !== undefined) {
        player.stats[statName] += 1;
    }

    while (player.xp >= xpNeeded(player.level)) {
        player.xp -= xpNeeded(player.level);
        player.level += 1;
    }

    savePlayer(player);
    return player;
}

function getTopPlayers(limit = 10) {
    const data = readData();

    return Object.values(data)
        .sort((a, b) => {
            if (b.level !== a.level) return b.level - a.level;
            if (b.xp !== a.xp) return b.xp - a.xp;
            return b.coins - a.coins;
        })
        .slice(0, limit);
}

module.exports = {
    getPlayer,
    savePlayer,
    addReward,
    getTopPlayers,
    xpNeeded
};
