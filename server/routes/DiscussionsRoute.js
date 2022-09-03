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
    // res.send([
    //   {
    //     discussion_point: "This is the first discussion",
    //     responses: [
    //       {
    //         user_name: "First_User",
    //         user_response: "This is the response of the first user",
    //       },
    //       {
    //         user_name: "Second_User",
    //         user_response: "This is the response of the second user",
    //       },
    //     ],
    //   },
    //   {
    //     discussion_point: "This is the second discussion",
    //     responses: [
    //       {
    //         user_name: "First_User",
    //         user_response: "This is the response of the first user",
    //       },
    //       {
    //         user_name: "Second_User",
    //         user_response: "This is the response of the second user",
    //       },
    //     ],
    //   },
    // ]);
  }
});

router.post("/saveNewDiscussion", async (req, res) => {
  const { discussion_point, responses, assessment_id, question_index } =
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
          // { $set: { [`discussions.${question_index}`]: discussion_point } },
          {
            $addToSet: {
              [`discussions.${question_index}`]: {
                discussion_point: discussion_point,
                responses: [],
              },
            },
          },
          function (err) {
            if (err) console.log({ message: err });
            else console.log({ message: "success" });
          }
        );
      })
      .catch((err) => res.json({ message: err }));
  } else {
    DiscussionsModel.findOneAndUpdate(
      { assessment_id: assessment_id },
      // { $set: { [`discussions.${question_index}`]: discussion_point } },
      {
        $addToSet: {
          [`discussions.${question_index}`]: {
            discussion_point: discussion_point,
            responses: [],
          },
        },
      },
      function (err) {
        if (err) console.log({ message: err });
        else console.log({ message: "success" });
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
      if (err) console.log({ message: err });
      else console.log({ message: "success" });
    }
  );
});

module.exports = router;
