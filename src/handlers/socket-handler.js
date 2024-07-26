import { io } from "socket.io-client";
import { userAgent } from "../constants/constants";
import config from "../app-configs";
import { randomInt } from "../helpers/random";

const promiseTimeOut = 5000;

export const joinGame = async (gameInfo, authorizeInfo) => {
    const socket = await connectSocket(gameInfo);

    const signInSuccessful = await requestSignIn(socket, authorizeInfo);
    const inGameSuccessful = await requestInGame(socket, gameInfo);

    if (signInSuccessful && inGameSuccessful) {
        return socket;
    } else {
        return false;
    }
};

export const placeBet = async (socket, betInfo, gameInfo) =>
    new Promise((resolve, reject) => {
        let isWaitForSettlement = false;

        socket.on(gameInfo.name, (data) => {
            if (data.endBet > 0) {
                isWaitForSettlement = true;
            }

            if (data.bonuses) {
                const { bonus } = data.bonuses;
                for (let index = 1; index <= bonus; index++) {
                    socket.emit("bonus", { chest: index });
                }
            }

            if (data.jackpot) {
                const index = randomInt(1, 9);
                socket.emit("jackpot", { chest: index });
            }

            if (data.finish && isWaitForSettlement) {
                resolve(data.finish);
            }

            if (data.endBet === -1) {
                console.log(data);
                resolve(-1);
            }
        });

        socket.emit("bet", betInfo);
    });

const connectSocket = async (gameInfo) =>
    new Promise((resolve, reject) => {
        const socketOptions = {
            forceNew: true,
            transports: ["websocket"],
            upgrade: false,
            path: gameInfo.proxyRoute,
            extraHeaders: {
                "user-agent": userAgent,
            },
        };

        const uri = `${config.proxy}/user/${gameInfo.name.toLowerCase()}`;

        const socket = io(uri, socketOptions);

        socket.on("connect", () => {
            resolve(socket);
        });

        socket.on("connect_error", (error) => {
            reject(error);
        });

        setTimeout(() => {
            reject("socket - time out");
        }, promiseTimeOut);
    });

const requestSignIn = async (socket, authorizeInfo) =>
    new Promise((resolve, reject) => {
        socket.emit("signin", authorizeInfo);

        socket.on("signedIn", () => {
            resolve(true);
        });

        socket.on("message", (data) => {
            if (data.unauthorized || data.notPermittedToPlay) {
                resolve(false);
            }
        });

        setTimeout(() => {
            reject("signIn - time out");
        }, promiseTimeOut);
    });

const requestInGame = async (socket, gameInfo) =>
    new Promise((resolve, reject) => {
        socket.emit("inGame");

        socket.on(gameInfo.name, (data) => {
            if (data.gameConfigs) {
                resolve(true);
            }

            setTimeout(() => {
                reject("inGame - time out");
            }, promiseTimeOut);
        });
    });
