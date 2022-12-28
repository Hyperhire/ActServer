import schedule from "node-schedule";
import subscriptionService from "../api/v1/subscription/subscription.service";
import { SubscriptionDate } from "../common/constants";

const subscriptionRule0 = new schedule.RecurrenceRule();
subscriptionRule0.second = 0;
subscriptionRule0.tz = "Etc/GMT+9";

const subscriptionRule1 = new schedule.RecurrenceRule();
subscriptionRule1.date = SubscriptionDate.FIRST;
subscriptionRule1.tz = "Etc/GMT+9";

const subscriptionRule10 = new schedule.RecurrenceRule();
subscriptionRule10.date = SubscriptionDate.TENTH;
subscriptionRule10.tz = "Etc/GMT+9";

const subscriptionRule20 = new schedule.RecurrenceRule();
subscriptionRule20.date = SubscriptionDate.TWENTIETH;
subscriptionRule20.tz = "Etc/GMT+9";

// const subscriptionTest = schedule.scheduleJob(
//   subscriptionRule0,
//   async function() {
//     console.log("subscription started", new Date());
//     await subscriptionService.doPaymentAll();
//     console.log("subscription ended", new Date());
//   }
// );

const subscriptionFirst = schedule.scheduleJob(
  subscriptionRule1,
  async function() {
    console.log("subscription started", new Date());
    await subscriptionService.doPaymentAllOnDate(SubscriptionDate.FIRST);
    console.log("subscription ended", new Date());
  }
);
const subscriptionTenth = schedule.scheduleJob(
  subscriptionRule10,
  async function() {
    console.log("subscription started", new Date());
    await subscriptionService.doPaymentAllOnDate(SubscriptionDate.TENTH);
    console.log("subscription ended", new Date());
  }
);
const subscriptionTwenteith = schedule.scheduleJob(
  subscriptionRule20,
  async function() {
    console.log("subscription started", new Date());
    await subscriptionService.doPaymentAllOnDate(SubscriptionDate.TWENTIETH);
    console.log("subscription ended", new Date());
  }
);

export {
  subscriptionFirst,
  subscriptionTenth,
  subscriptionTwenteith
};
