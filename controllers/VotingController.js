const PostModel = require("../models/PostModal");

async function VotePost(req, res) {
  try {
    const {userId, post_id, vote } = req.body;

    if (!post_id) {
      return res
        .status(200)
        .json({ success: false, message: "Post ID is required" });
    }

    if (!["Yes", "No"].includes(vote)) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid vote value" });
    }

    const post = await PostModel.findById(post_id);

    if (post.Post_Type == "Poll") {
      const alreadyVoted = post.Voting.some(
        (votes) => votes.voter_id.toString() === userId.toString()
      );

      let updatedPost;
      let message;

      if (alreadyVoted) {
        updatedPost = await PostModel.findOneAndUpdate(
          { _id: post_id, "Voting.voter_id": userId },
          { $set: { "Voting.$.vote": vote } },
          { new: true }
        );
        message = "Vote updated successfully";
      } else {
        const newVote = { voter_id: userId, vote };
        updatedPost = await PostModel.findByIdAndUpdate(
          post_id,
          { $addToSet: { Voting: newVote } },
          { new: true }
        );
        message = "Successfully voted";
      }
   
      return res.status(200).json({ success: true, message, data: updatedPost });
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Post_Type must be Poll" });
    }
  } catch (error) {
    console.error("Voting error:", error);
    res
      .status(400)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

async function getPollPosts(req, res) {
  try {
    const posts = await PostModel.find({ Post_Type: "Poll" }).populate("userId", "-password");

    if (!posts || posts.length === 0) {
      return res.status(200).json({ success: false, message: "Poll post not found" });  
    }

    const votes = posts.map(({ userId, Voting }) => {
      const yesVoteCount = Voting.filter((vote) => vote.vote === "Yes").length;
            const NoVoteCount = Voting.filter((vote) => vote.vote === "No").length;
      return { userId, yesVoteCount ,NoVoteCount };
    });

    // console.log("Votes:", votes); 

    res.status(200).json({ success: true, message: "Poll posts", data: votes });
  } catch (error) {
    console.error("Voting error:", error);
    res.status(400).json({ success: false, message: "Server error", error: error.message });
  }
}

module.exports = {
  VotePost,
  getPollPosts,
};
