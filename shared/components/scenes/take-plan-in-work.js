import { Markup, Composer, Scenes } from "telegraf";

import { getWorkingPlan, takeInWorkPlan } from "../mongo/mongodb.js";

let id = 1;
let workingPlanNum;
let workingPlanDescription;
let date = new Date().toLocaleString();


const startStep = new Composer();
startStep.on('text', async ctx => {
    try {
        getWorkingPlan(ctx)
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }

})

const checkWorkingPlanNum = new Composer()
checkWorkingPlanNum.on('text', async ctx => {
    try {
        workingPlanNum = Number(ctx.message.text);
        await ctx.reply(
            "Напишите число задания в списке, которое хотите взять в работу" +
            workingPlanNum

        );
        const workingPlanInfo = {
            id: id,
            userName: `${ctx.from.last_name} ${ctx.from.first_name}`,
            planNumber: workingPlanNum,
            planDesc: workingPlanDescription,
            status: 'Нужно сделать',
            worker: [],
            date: date
        }
        await ctx.reply(`План №${workingPlanNum}\nОписание плана:\n${workingPlanDescription}`)
        takeInWorkPlan(workingPlanNum, ctx)
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }
})

const inputWorkingPlanDesc = new Composer()
inputWorkingPlanDesc.on('text', async ctx => {
    try {

        return ctx.wizard.next();

    } catch (e) {
        console.log(e);
    }
})

const takeWorkingPlan = new Scenes.WizardScene(
    "getWorkingPlanWizard",
    startStep,
    checkWorkingPlanNum,
    inputWorkingPlanDesc
);
export { takeWorkingPlan }