const mongoose=require("mongoose");

const auditSchema=new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant"
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    action:String,

    module:String,

    description:String,

    ipAddress:String,

    device:String

},
{
    timestamps:true
});

module.exports=mongoose.model("AuditLog",auditSchema);