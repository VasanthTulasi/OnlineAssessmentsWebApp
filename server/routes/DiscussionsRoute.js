const router = require("express").Router();
const DiscussionsModel = require("../models/DiscussionsModel");

router.post("/getDiscussions", async (req, res) => {
  const { assessment_id, question_index } = req.body;
  const assessment = await DiscussionsModel.findOne({
    assessment_id: assessment_id,
  });
  if (assessment) {
    if (assessment.discussions[question_index] === undefined) res.send([]);
    res.send(assessment.discussions[question_index]);
  } else {
    res.send([]);
  }
});

router.post("/saveNewDiscussion", async (req, res) => {
  const { user_name, discussion_point, responses, assessment_id, question_index } =
    req.body;

  const discussion = await DiscussionsModel.findOne({
    assessment_id: assessment_id,
  });

  if (!discussion) {
    const dis = new DiscussionsModel({
      assessment_id: assessment_id,
    });

    dis
      .save()
      .then(() => {
        DiscussionsModel.findOneAndUpdate(
          { assessment_id: assessment_id },
          {
            $addToSet: {
              [`discussions.${question_index}`]: {
                user_name: user_name,
                discussion_point: discussion_point,
                responses: [],
              },
            },
          },
          function (err) {
            if (err) res.json({ message: err });
            else res.json({ message: "success" });
          }
        );
      })
      .catch((err) => res.json({ message: err }));
  } else {
    DiscussionsModel.findOneAndUpdate(
      { assessment_id: assessment_id },
      {
        $addToSet: {
          [`discussions.${question_index}`]: {
            user_name: user_name,
            discussion_point: discussion_point,
            responses: [],
          },
        },
      },
      function (err) {
        if (err) res.json({ message: err });
        else res.json({ message: "success" });
      }
    );
  }
});

router.post("/saveNewResponse", async (req, res) => {
  const {
    user_name,
    user_response,
    assessment_id,
    question_index,
    discussion_index,
  } = req.body;
  DiscussionsModel.findOneAndUpdate(
    { assessment_id: assessment_id },
    // { $set: { [`discussions.${question_index}`]: discussion_point } },
    {
      $addToSet: {
        [`discussions.${question_index}.${discussion_index}.responses`]: {
          user_name: user_name,
          user_response: user_response,
        },
      },
    },
    function (err) {
      if (err) res.json({ message: err });
      else res.json({ message: "success" });
    }
  );
});

module.exports = router;
