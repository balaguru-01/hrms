const mongoose=require("mongoose");

const leaveSchema=new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant",
        required:true
    },

    employee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
        required:true
    },

    leaveType:{
        type:String,
        enum:["Casual","Sick","Paid","Maternity","Paternity"],
        default:"Casual"
    },

    fromDate:Date,

    toDate:Date,

    reason:String,

    status:{
        type:String,
        enum:["Pending","Approved","Rejected"],
        default:"Pending"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("LeaveRequest",leaveSchema);