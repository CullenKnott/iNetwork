const { User, Thought } = require("../models");

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // get a single thought
  async getOneThought(req, res) {
    try {
      const thoughts = await Thought.findOne({
        _id: req.params.id,
      }).select("-__v");

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a thought
  async createThought(req, res) {
    try {
      const thoughts = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thoughts } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "Thought has been created but no user matched that id",
        });
      }

      res.json("Thought as been created and added to user!!!");
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // update a thought
  async updateThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thought with that ID found" });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete thought
  async deleteThought(req, res) {
    try {
      const thoughts = await Thought.findOneAndDelete({
        _id: req.params.id,
      });

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thought with that id found" });
      }

      await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { runValidators: true, new: true }
      );

      res.json({ message: "Thought has been successfully deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add reaction to thought
  async addReaction(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID" });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // remove a reaction
  async removeReaction(req, res) {
    try {
      const thoughts = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: "No thought found with this ID" });
      }

      res.json({ message: "reaction has been deleted" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
