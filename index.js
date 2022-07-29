import { Telegraf, Markup, Scenes, session } from "telegraf";
import 'dotenv/config'
import express from "express";

import { addWorkStart, insertUser } from "./shared/components/mongo/mongodb.js";
import { timer } from "./shared/components/mongo/timer.js";
import { carFuel } from './shared/components/scenes/car-fuel.js';
import { registerWorkingPlan } from './shared/components/scenes/reg-working-plan.js';
import { takeWorkingPlan } from './shared/components/scenes/take-plan-in-work.js'

const port = process.env.PORT || 3000;
const TOKEN = process.env.TELEGRAM_TOKEN;
const date = new Date().toLocaleString();
const bot = new Telegraf(TOKEN, {});
const stage = new Scenes.Stage([carFuel, registerWorkingPlan, takeWorkingPlan])
const app = express();

bot.use(session());
bot.use(stage.middleware());

bot.hears('Залить бензин в машину', ctx => ctx.scene.enter('carWizard'))
bot.hears('Задать план', ctx => ctx.scene.enter('registerWorkingPlanWizard'))
bot.hears('Приступить к выполнению плана', ctx => ctx.scene.enter('getWorkingPlanWizard'))
timer()
bot.start((ctx) => {
    console.log("Test_Bot is workings");
    let status = {
        userPersonalId: ctx.message.from.id,
        userName: `${ctx.message.from.last_name} ${ctx.message.from.first_name}`,
        nickname: ctx.message.from.username,
        date: date,
        status: "✅",
    };
    addWorkStart(status);
    console.log(status);
    ctx.reply(`Hello\nWork started ${date}`);
});

bot.command("register", (ctx) => {
    const userInfo = {
        userPersonalId: ctx.message.from.id,
        fistName: ctx.message.from.first_name,
        lastName: ctx.message.from.last_name,
        nickname: ctx.message.from.username,
        date: date,
    };
    insertUser(ctx, userInfo);
});

bot.command("work_start", async(ctx) => {
    try {
        await ctx.reply('Необходимо выбрать, что вы хотите сделать', Markup.keyboard([
            ['Залить бензин в машину'],
            ['Задать план', 'Приступить к выполнению плана']
        ]).oneTime().resize())
    } catch (e) {
        console.log(e);
    }
});

bot.command("work_end", (ctx) => {
    ctx.reply("Сохраняем отчёт");
    setTimeout(() => {
        ctx.reply("Done ✅");
        ctx.reply("До встречи");
    }, 2000);
});


bot.launch();
// app.listen(port, () => {
//     console.log("Server is working");
// });