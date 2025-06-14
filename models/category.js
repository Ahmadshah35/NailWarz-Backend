const mongoose = require("mongoose");

const categorySchema =new  mongoose.Schema({
  superAdminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "superadmin",
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

const categoryModel = mongoose.model("category", categorySchema);

module.exports = categoryModel;
