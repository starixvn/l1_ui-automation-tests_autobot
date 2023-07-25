export default {
    system: "VG2",
    owUrl: "https://l2-ows1.lumigame.com/SabaClub",
    simulatorUrl: "https://l2-glbs1.lumigame.com",
    proxy: "https://l2-proxy1.lumigame.com",
    authenticateSettings: {
        url: "https://l2-auth1.lumigame.com/",
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
