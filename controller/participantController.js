import Activity from "../model/activity.js";
import Participant from "../model/participant.js";
// create
export const createItem = async (req, res) => {
  try {
    if (req.body.uniqueId) {
      const participant = await Participant.findOne({
        uniqueId: req.body.uniqueId,
      });
      await Activity.findByIdAndUpdate(
        req.body.activityId,
        {
          $push: { participants: participant._id },
        },
        { new: true }
      );
      res.status(200).json({
        message: "success",
        success: true,
        statusCode: 200,
      });
    } else {
      const uniqueId = () => {
        const randomInt = Math.floor(Math.random() * 900000) + 100000;
        const randomString = randomInt.toString();
        return randomString;
      };
      const newParticipant = new Participant({
        uniqueId: uniqueId(),
        gender: req.body.gender,
        age: req.body.age,
        nationality: req.body.nationality,
        role: req.body.role,
        isParent: req.body.isParent,
      });
      const savedParticipant = await newParticipant.save();
      await Activity.findByIdAndUpdate(
        req.body.activityId,
        {
          $push: { participants: savedParticipant._id },
        },
        { new: true }
      );
      res.status(200).json({
        message: "success",
        success: true,
        statusCode: 200,
        data: savedParticipant,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "Somethings went wrong please try again ",
      success: false,
      statusCode: 500,
    });
  }
};
// delete
export const deleteItem = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant)
      return res.status(404).json({
        message: "Participant Not Found",
        success: false,
        statusCode: 404,
      });

    res.status(200).json({
      message: "success",
      success: true,
      statusCode: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error " + err, success: false, statusCode: 500 });
  }
};
// get one item function
export const getItem = async (req, res) => {
  try {
    const participant = await Participant.findById(req.query);
    if (!participant)
      return res.status(404).json({
        message: "Participant Not Found",
        success: false,
        statusCode: 404,
      });
    res.status(200).json({
      message: "success",
      success: true,
      statusCode: 200,
      data: participant,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error " + err, success: false, statusCode: 500 });
  }
};
// get Itemsfunction
export const getAllItems = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json({
      message: "success",
      success: true,
      statusCode: 200,
      data: participants,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "error " + err, success: false, statusCode: 500 });
  }
};
export const getChat = async (req, res) => {
  try {
    const nominees = await Nominee.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "numId",
          as: "Votes",
        },
      },
    ]).exec();

    const votes = [];
    nominees.map((vote) => {
      const votess = vote.Votes.reduce(
        (acc, current) => acc + current.votePoint,
        0
      );
      const amount = vote.Votes.reduce(
        (acc, current) => acc + current.voteAmount,
        0
      );
      votes.push({ fullname: vote.fullname, votes: votess, amount: amount });
    });

    res.status(200).json(votes);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getCount = async (req, res) => {
  const startDate = new Date("2023-04-04" + "T00:00:00.0Z");
  const endDate = new Date("2023-04-05" + "T23:59:59.999Z");
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };
  // res.send(query);
  try {
    const activities = await Activity.find();
    const data = await Participant.find();
    // Initialize empty arrays to store unique countries and parents
    let countries = [];
    let parents = [];
    let males = 0;
    let females = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i].gender === "Male") {
        males++;
      }
      if (data[i].gender === "Female") {
        females++;
      }
      if (!countries.includes(data[i].nationality)) {
        countries.push(data[i].nationality);
      }
      if (data[i].isParent) {
        parents.push(data[i]);
      }
    }

    res.status(200).json({
      males: males,
      females: females,
      countries: countries.length,
      parents: parents.length,
      participant: data.length,
      activities: activities.length,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getCountChart = async (req, res) => {
  const startDate = new Date("2023-04-04" + "T00:00:00.0Z");
  const endDate = new Date("2023-04-05" + "T23:59:59.999Z");
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };
  // res.send(query);
  try {
    const data = await Participant.find();

    const countryTotals = {};

    for (let i = 0; i < data.length; i++) {
      const { gender, nationality } = data[i];

      // check if this nationality has been encountered before
      if (!countryTotals.hasOwnProperty(nationality)) {
        countryTotals[nationality] = { male: 0, female: 0 };
      }

      // update the gender count for this nationality
      if (gender === "Male") {
        countryTotals[nationality].male++;
      } else if (gender === "Female") {
        countryTotals[nationality].female++;
      }
    }

    const result = [];
    for (const [country, genderCounts] of Object.entries(countryTotals)) {
      result.push({ country, ...genderCounts });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
export const getCountAge = async (req, res) => {
  const startDate = new Date("2023-04-04" + "T00:00:00.0Z");
  const endDate = new Date("2023-04-05" + "T23:59:59.999Z");
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    },
  };
  // res.send(query);
  try {
    const data = await Participant.find();

    // Initialize count variables for each age group
    let count10to20 = 0;
    let count21to31 = 0;
    let count32to42 = 0;
    let count43to53 = 0;
    let count54to64 = 0;
    let count65to75 = 0;

    // Loop through the data and increment the count for the corresponding age group
    for (let i = 0; i < data.length; i++) {
      const age = parseInt(data[i].age);
      if (age >= 10 && age <= 20) {
        count10to20++;
      } else if (age >= 21 && age <= 31) {
        count21to31++;
      } else if (age >= 32 && age <= 42) {
        count32to42++;
      } else if (age >= 43 && age <= 53) {
        count43to53++;
      } else if (age >= 54 && age <= 64) {
        count54to64++;
      } else if (age >= 65 && age <= 75) {
        count65to75++;
      }
    }
    const ages = [
      {
        range: "10-20",
        count: count10to20,
      },
      {
        range: "21-31",
        count: count21to31,
      },
      {
        range: "32-42",
        count: count32to42,
      },
      {
        range: "43-53",
        count: count43to53,
      },
      {
        range: "54-64",
        count: count54to64,
      },
      {
        range: "65-75",
        count: count65to75,
      },
    ];

    res.status(200).json(ages);
  } catch (err) {
    res.status(500).json(err);
  }
};
