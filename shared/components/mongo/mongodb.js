import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoUrl = process.env.MONGO_URL;

const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

function test() {
    console.log(mongoUrl);
}

function addWorkStart(data) {
    client.connect((err, client) => {
        client
            .db("TELEGRAM_BOT")
            .collection("TG_USERS")
            .insertOne(data, (err, res) => {
                if (err) {
                    return console.log(err);
                }
            });
    });
}

function insertUser(bot, userData) {
    client.connect((err, client) => {
        let date = new Date();

        if (err) {
            return console.log(err);
        }
        client
            .db("TELEGRAM_BOT")
            .collection("TG_REGISTERED_USERS")
            .findOne({ userPersonalId: userData.userPersonalId }, (err, doc) => {
                if (doc == null) {
                    client
                        .db("TELEGRAM_BOT")
                        .collection("TG_REGISTERED_USERS")
                        .insertOne(userData, (err, res) => {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    bot.telegram.sendMessage(
                        userData.userPersonalId,
                        "Регистрация успешна ✅"
                    );
                } else if (doc !== null) {
                    bot.telegram.sendMessage(
                        userData.userPersonalId,
                        "Вы уже зарегистрированны"
                    );
                }
            });
    });
}

function sendWorkingPlanInfo(data, ctx) {
    client.connect((err, client) => {
        client
            .db("TELEGRAM_BOT")
            .collection("WORKING_PLAN")
            .findOne({ id: data.id }, (err, res) => {
                console.log(res);
                if (res == null) {
                    client
                        .db("TELEGRAM_BOT")
                        .collection("WORKING_PLAN")
                        .insertOne(data, (err, res) => {
                            if (err) {
                                return console.log(err);
                            }
                        });
                } else {
                    client
                        .db("TELEGRAM_BOT")
                        .collection("WORKING_PLAN")
                        .find()
                        .sort({ id: -1 })
                        .limit(1)
                        .toArray((err, response) => {
                            console.log(response[0].id);
                            let id = response[0].id;
                            data.id = id + 1;
                            client
                                .db("TELEGRAM_BOT")
                                .collection("WORKING_PLAN")
                                .insertOne(data, (err, res) => {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });
                        });
                }
            });
        ctx.reply(`Данные отправлены ✅`);
    });
}

function sendLitersInfo(data, ctx) {
    client.connect((err, client) => {
        if (err) {
            return console.log(err);
        }
        client
            .db("TELEGRAM_BOT")
            .collection("TG_CAR_FUEL")
            .findOne({ id: data.id }, (err, res) => {
                console.log(res);
                if (res == null) {
                    client
                        .db("TELEGRAM_BOT")
                        .collection("TG_CAR_FUEL")
                        .insertOne(data, (err, res) => {
                            if (err) {
                                return console.log(err);
                            }
                        });
                } else {
                    client
                        .db("TELEGRAM_BOT")
                        .collection("TG_CAR_FUEL")
                        .find()
                        .sort({ id: -1 })
                        .limit(1)
                        .toArray((err, response) => {
                            console.log(response[0].id);
                            let id = response[0].id;
                            data.id = id + 1;
                            client
                                .db("TELEGRAM_BOT")
                                .collection("TG_CAR_FUEL")
                                .insertOne(data, (err, res) => {
                                    if (err) {
                                        return console.log(err);
                                    }
                                });
                        });
                }
            });
        ctx.reply(`Данные отправлены ✅`);
    });
}

function getWorkingPlan(ctx) {
    client.connect((err, client) => {
        client
            .db("TELEGRAM_BOT")
            .collection("WORKING_PLAN")
            .find()
            .toArray((err, response) => {
                let todo = response
                    .map((response) => `${response.id}. ${response.planDesc}`)
                    .join("\n");
                console.log(todo);
                ctx.reply(todo);
            });
    });
}

function takeInWorkPlan(changedId, ctx) {
    client.connect((err, client) => {
        client
            .db("TELEGRAM_BOT")
            .collection("WORKING_PLAN")
            .findOneAndUpdate({ id: changedId }, { $set: { status: "В работе" } },
                (err, res) => {
                    console.log(res);
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        client
            .db("TELEGRAM_BOT")
            .collection("WORKING_PLAN")
            .findOneAndUpdate({ id: changedId }, { $push: { worker: [`${ctx.from.last_name} ${ctx.from.first_name}`] } },
                (err, res) => {
                    console.log(res);
                    if (err) {
                        return console.log(err);
                    }
                }
            );
        ctx.reply(`Данные отправлены ✅`);
    });
}

export {
    addWorkStart,
    insertUser,
    sendWorkingPlanInfo,
    sendLitersInfo,
    takeInWorkPlan,
    getWorkingPlan,
};