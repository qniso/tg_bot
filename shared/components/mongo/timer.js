import { MongoClient } from "mongodb";
import "dotenv/config";

const mongoUrl = process.env.MONGO_URL;

const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

function timer() {
    setInterval(() => {
        client.connect((err, client) => {
            client
                .db("TELEGRAM_BOT")
                .collection("TG_USERS")
                .find()
                .toArray((err, resp) => {
                    console.log(resp);
                })
        });
    }, 300000)
}
export {
    timer
}