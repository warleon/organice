const router = require("express").Router();
const Activity = require("../models/activity");

router.post("/createActivity", async (req, res) => {
  const data = req.body;
  //console.log(data);
  if (data.important) {
    data.important = true;
  } else {
    data.important = false;
  }
  if (data.urgent) {
    data.urgent = true;
  } else {
    data.urgent = false;
  }

  const newActivity = new Activity({
    title: data.title,
    description: data.description,
    important: data.important,
    urgent: data.urgent,
  });
  //console.log(newActivity)
  await newActivity.save();
  res.json(newActivity);
});

router.post("/activities", async (req, res) => {
  const data = req.body;
  //console.log(data);
  const activities = await Activity.find({_id: data.id});
  //console.log(activities);

  res.json(activities);
});

router.get('/activities', async (req, res) =>{
  const activities = await Activity.find().sort({ date: "desc" });
  res.json(activities);
})

router.delete('/activities', async (req, res) =>{
  const data = req.body;
  //console.log(data);
  await Activity.findByIdAndDelete(data.id);
  res.json(data);
})

module.exports = router;
