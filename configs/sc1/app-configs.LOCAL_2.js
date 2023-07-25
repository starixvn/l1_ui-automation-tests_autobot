export default {
    system: "SC1",
    owUrl: "https://l1-ows2.lumigame.com/SabaClub",
    simulatorUrl: "https://l1-glbs2.lumigame.com",
    proxy: "https://l1-proxy2.lumigame.com",
    authenticateSettings: {
        url: "https://l1-auth2.lumigame.com/",
        id: "autobot",
        secret: "autobot@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["admin-api", "game-services"],
    },
    testConfig: {
        totalUsers: 800,
        userBetEvent: 10,
        betAmount: 10,
    },
};
