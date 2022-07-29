import { Markup, Composer, Scenes } from "telegraf";
import { carList } from "../../data/car-number.js";

import { sendLitersInfo } from "../mongo/mongodb.js";

let id = 0;
let carNumber;
let fuel;
let date = new Date().toLocaleString();

const startStep = new Composer();
startStep.on("text", async(ctx) => {
    try {
        await ctx.reply("Напишите номер машины");
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }
});

const carNumStep = new Composer();
carNumStep.on("text", async(ctx) => {
    try {
        carNumber = ctx.message.text;
        // console.log(ctx.wizard.state.data);
        if (carList.find((item) => item == `${carNumber}`)) {
            await ctx.reply(
                "Напишите сколько литров залито в машину под номером " + carNumber
            );
            return ctx.wizard.next(fuelStep);
        } else {
            ctx.reply("Такой машины у нас нет в списке");
            ctx.scene.reenter();
        }
    } catch (e) {
        console.log(e);
    }
});

const fuelStep = new Composer();
fuelStep.on("text", async(ctx) => {
    try {
        fuel = Number(ctx.message.text);

        const carInfo = {
            id: id,
            userPersonalId: ctx.message.from.username,
            fistName: ctx.message.from.first_name,
            lastName: ctx.message.from.last_name,
            nickname: ctx.message.from.username,
            carNumber: carNumber,
            fuel: fuel,
            date: date,
        };
        if (fuel) {
            console.log(ctx.message.text);
            await ctx.reply("В машину: " + carNumber + " залили литров " + fuel);
            sendLitersInfo(carInfo, ctx);

            return ctx.wizard.next();
        } else {
            ctx.reply("Напишите число ");
            ctx.scene.reenter();
        }
    } catch (e) {
        console.log(e);
    }
});

const carFuel = new Scenes.WizardScene(
    "carWizard",
    startStep,
    carNumStep,
    fuelStep
);
export { carFuel };