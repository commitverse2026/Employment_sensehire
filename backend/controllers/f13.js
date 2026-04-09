const jobs = require("../data/jobs.json");

function calculateScore(task) {
  const total =
    task.visualMonitoring +
    task.phoneCalls +
    task.fineMotorInput +
    task.sustainedFocus +
    task.verbalCommunication;

  const max = 25;
  return Math.round((1 - total / max) * 100);
}

exports.getJobs = (req, res) => {
  const updatedJobs = jobs.map((job) => ({
    ...job,
    accessibilityScore: calculateScore(job.taskRequirements),
  }));

  res.json(updatedJobs);
};
