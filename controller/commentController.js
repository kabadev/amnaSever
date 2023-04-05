import Activity from "../model/activity.js";
import Comment from "../model/comment.js";
// create
export const createItem = async (req, res) => {
  try {
    const newComment = new Comment({
      activityId: req.body.activityId,
      partner: req.body.partner,
      comment: req.body.comment,
    });

    const savedComment = await newComment.save();
    await Activity.findByIdAndUpdate(
      req.body.activityId,
      {
        $push: { comments: savedComment._id },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Comment Added",
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
    const comment = await Comment.findById(req.params.id);
    if (!comment)
      return res.status(404).json({
        message: "Comment  Not Found",
        success: false,
        statusCode: 404,
      });

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "success",
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
