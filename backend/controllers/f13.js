const jobs = require("../data/jobs.json");

exports.getJobs = (req, res) => {
  res.json(jobs);
};