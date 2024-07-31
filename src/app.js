import Fastify from "fastify";
import { initPlayer } from "./runners/player-initializer";
import { playersStartWithFilter, findPlayer } from "./runners/players";
import { bet } from "./handlers/bet-handler";
import { post, init } from "./auths/authentication-helpers";
import config from "./app-configs";
import { convertBetChoice } from "./helpers/convert-bet-choice";

const fastify = Fastify({
    logger: true,
    ignoreDuplicateSlashes: true,
    requestTimeout: 60,
});

fastify.get("/", async (request, reply) => {
    reply.code(200).send("Hello, I'm AutoBot");
});

fastify.post("/set-result", async (request, reply) => {
    const { gameName, board, currency } = request.body;
    const player = findPlayer(currency, config.system);
    const setBoardParams = { name: player.nickname, result: board.split(",").map((x) => parseInt(x)) };
    await post(`${config.proxy}/${gameName.toLocaleLowerCase()}/api/set-board`, setBoardParams);

    reply.code(200).send(`Receives a result cheating call for ${player.nickname} with the board as ${board}.`);
});

fastify.post("/bet", async (request, reply) => {
    const { gameName, amount, betChoice, freeSpin, board, currency } = request.body;
    const proxyRoute = `/${gameName.toLocaleLowerCase()}/socket.io`;

    const player = findPlayer(currency, config.system);
    const setBoardParams = { name: player.nickname, result: board.split(",").map((x) => parseInt(x)) };

    await post(`${config.proxy}/${gameName.toLocaleLowerCase()}/api/set-board`, setBoardParams);
    const convertChoices = convertBetChoice(betChoice);
    const settlement = await bet(player, { name: gameName, proxyRoute }, { amount, betChoice: convertChoices, freeSpin });

    reply.code(200).send({ settlement, playerId: player.id, playerName: player.nickname });
});

fastify.post("/bet-by-batch", async (request, reply) => {
    const { game } = request.query;
    const bets = request.body;

    const proxyRoute = `/${game.toLocaleLowerCase()}/socket.io`;

    const testCases = Object.keys(bets);
    const result = {};

    for await (const testId of testCases) {
        const { amount, betChoice, board, freeSpin, currency } = bets[testId];

        const player = findPlayer(currency, config.system);
        const setBoardParams = { name: player.nickname, result: board.split(",").map((x) => parseInt(x)) };

        await post(`${config.proxy}/${game.toLocaleLowerCase()}/api/set-board`, setBoardParams);

        const convertChoices = convertBetChoice(betChoice);
        const settlement = await bet(player, { name: game, proxyRoute }, { amount, betChoice: convertChoices, freeSpin });

        result[testId] = { roundId: settlement.roundId, playerId: player.id, playerName: player.nickname };
    }

    reply.code(200).send({ result });
});

fastify.post("/create-player", async (request, reply) => {
    const { currency } = request.body;
    const player = findPlayer(currency, config.system);
    await initPlayer(player.id, player.nickname, player.currency);
});

// Run the server!
const start = async () => {
    try {
        await init(config.authenticateSettings);

        const playersStart = playersStartWithFilter(config.system);

        for await (const player of playersStart) {
            await initPlayer(player.id, player.nickname, player.currency);
        }

        await fastify.listen({ port: 5000, host: "0.0.0.0" });

        console.log(`AutoBot started at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    } catch (err) {
        fastify.log.error(err);
        console.log(err);
        process.exit(1);
    }
};

start();
