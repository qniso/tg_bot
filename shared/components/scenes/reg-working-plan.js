import { Markup, Composer, Scenes } from 'telegraf';
import { sendWorkingPlanInfo } from '../mongo/mongodb.js';

let id = 1;
let workingPlanNum;
let workingPlanDescription;
let date = new Date().toLocaleString();

const startStep = new Composer();
startStep.on('text', async ctx => {
    try {
        await ctx.reply('Напишите номер плана')
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }

})

const inputWorkingPlanNum = new Composer()
inputWorkingPlanNum.on('text', async ctx => {
    try {
        workingPlanNum = Number(ctx.message.text);
        await ctx.reply(
            "Напишите что нужно выполнить по плану с номером:  " +
            workingPlanNum
        );
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }
})

const inputWorkingPlanDesc = new Composer()
inputWorkingPlanDesc.on('text', async ctx => {
    try {
        workingPlanDescription = ctx.message.text;
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
        sendWorkingPlanInfo(workingPlanInfo, ctx)
        return ctx.wizard.next();
    } catch (e) {
        console.log(e);
    }
})

const registerWorkingPlan = new Scenes.WizardScene(
    "registerWorkingPlanWizard",
    startStep,
    inputWorkingPlanNum,
    inputWorkingPlanDesc
);
export { registerWorkingPlan }