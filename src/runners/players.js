export const findPlayer = (currency, system) => {
    return players.find((player) => player.currency === currency && player.system === system);
};

export const playersStartWithFilter = (system) => {
    return players.filter((player) => player.system === system);
};

export const players = [
    {
        id: "999888777",
        nickname: "autobot999",
        currency: "UUS",
        system: "SC1",
    },
    {
        id: "999888778",
        nickname: "autobot998",
        currency: "US$",
        system: "SC1",
    },
    {
        id: "999888779",
        nickname: "autobot997",
        currency: "UT",
        system: "SC1",
    },
    {
        id: "999888791",
        nickname: "autobot985",
        currency: "YEN",
        system: "SC1",
    },
    {
        id: "999888793",
        nickname: "autobot983",
        currency: "$US",
        system: "SC1",
    },
    {
        id: "999888780",
        nickname: "autobot996",
        currency: "INH",
        system: "VG2",
    },
    {
        id: "999888781",
        nickname: "autobot995",
        currency: "TB",
        system: "VG2",
    },
    {
        id: "999888782",
        nickname: "autobot994",
        currency: "WON",
        system: "VG2",
    },
    {
        id: "999888783",
        nickname: "autobot993",
        currency: "AUD",
        system: "VG2",
    },
    {
        id: "999888784",
        nickname: "autobot992",
        currency: "IN",
        system: "VG2",
    },
    {
        id: "999888785",
        nickname: "autobot991",
        currency: "HK$",
        system: "VG2",
    },
    {
        id: "999888786",
        nickname: "autobot990",
        currency: "JPY",
        system: "VG2",
    },
    {
        id: "999888787",
        nickname: "autobot989",
        currency: "NOK",
        system: "VG2",
    },
    {
        id: "999888788",
        nickname: "autobot988",
        currency: "RON",
        system: "VG2",
    },
    {
        id: "999888789",
        nickname: "autobot987",
        currency: "CHF",
        system: "VG2",
    },
    {
        id: "999888790",
        nickname: "autobot986",
        currency: "VND",
        system: "VG2",
    },
];
