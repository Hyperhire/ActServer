import schedule from "node-schedule";

const rule = new schedule.RecurrenceRule();
rule.second = 0;
rule.tz = "Etc/UTC";

const scheduleTest = schedule.scheduleJob(rule, function() {
  console.log("hello world", new Date());
});

export { scheduleTest };
