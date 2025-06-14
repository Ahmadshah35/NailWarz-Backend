const mongoose=require("mongoose")

const superAdminSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},
{
  timestamps: true,
})

const superAdminModel=mongoose.model("superadmin", superAdminSchema)

module.exports=superAdminModel
