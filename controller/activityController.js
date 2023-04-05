import Activity from "../model/activity.js";
import Comment from "../model/comment.js";
import Participant from "../model/participant.js";
// create
export const createItem = async (req, res) => {
  try {
    const newActivity = new Activity({
      activityName: req.body.activityName,
      activityType: req.body.activityType,
      partner: req.body.partner,
      county: req.body.county,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description,
    });

    await newActivity.save();
    res.status(200).json({
      message: "Activity created",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Somethings Went Wrong Please Try Again ",
      error: error,
      success: false,
      statusCode: 500,
    });
  }
};
// update
export const updateItem = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res.status(404).json({
        message: "Activity Not Found",
        success: false,
        statusCode: 404,
      });

    const data = {
      activityName: req.body.activityName,
      activityType: req.body.activityType,
      partner: req.body.partner,
      location: req.body.location,
      date: req.body.date,
      description: req.body.description,
    };

    await News.findByIdAndUpdate(
      req.params.id,
      {
        $set: data,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Updated Successfully",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Somethings Went Wrong Please Try Again  ",
      error: error,
      success: false,
      statusCode: 500,
    });
  }
};

// delete
export const deleteItem = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res.status(404).json({
        message: "Activity Not Found",
        success: false,
        statusCode: 404,
      });

    await Activity.findByIdAndDelete(req.params.id);
    res.status(200).json({
      data: null,
      message: "success",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Somethings Went Wrong Please Try Again ",
      error: error,
      success: false,
      statusCode: 500,
    });
  }
};

// get one item function
export const getItem = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity)
      return res.status(404).json({
        message: "Activity Not Found",
        success: false,
        statusCode: 404,
      });
    const activityComment = await Promise.all(
      activity.comments.map((comment) => {
        return Comment.find({ activityId: comment }).populate("partner").exec();
      })
    );
    const activityPaticipants = await Promise.all(
      activity.participants.map((participant) => {
        return Participant.find({ _id: participant });
      })
    );
    const empty = [];
    const paticipants = empty.concat(...activityPaticipants);
    const comments = empty.concat(...activityComment);
    res.status(200).json({
      message: "success",
      success: true,
      statusCode: 200,
      data: {
        activity: activity,
        paticipants: paticipants,
        comments: comments,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Somethings Went Wrong Please Try Again ",
      error: error,
      success: false,
      statusCode: 500,
    });
  }
};
// get Itemsfunction
export const getAllItems = async (req, res) => {
  const query = req.query ? req.query : [];
  var filter = {};
  for (const q in query) {
    if (query.hasOwnProperty(q)) {
      const value = query[q].split(",");
      filter[q] = { $in: value };
    }
  }

  try {
    const activities = await Activity.find(filter).populate(
      "partner",
      "country fullName avatar"
    );

    res.status(200).json({
      message: "success",
      success: true,
      statusCode: 200,
      data: activities,
    });
  } catch (err) {
    res.status(500).json({
      message: "Somethings Went Wrong Please Try Again ",
      error: err,
      success: false,
      statusCode: 500,
    });
  }
};
export const activitySearch = async (req, res) => {
  let search = req.query.search;

  // Create expression
  var re = new RegExp(search, "i");
  let find = {};
  if (search != undefined && search != "") {
    find = {
      $or: [{ activityName: { $regex: re } }, { activityType: { $regex: re } }],
    };
  }
  let dataSearched = await Activity.find(find).populate(
    "partner",
    "country fullName avatar"
  );
  res.status(200).json({
    message: "success",
    success: true,
    statusCode: 200,
    data: dataSearched,
  });
};
