const mongoose=require("mongoose");

const notificationSchema=new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant"
    },

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    title:String,

    message:String,

    isRead:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Notification",notificationSchema);