const mongoose=require("mongoose");

const taskSchema=new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant",
        required:true
    },

    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },

    assignedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    title:String,

    description:String,

    priority:{
        type:String,
        enum:["Low","Medium","High"],
        default:"Medium"
    },

    status:{
        type:String,
        enum:["Pending","In Progress","Completed"],
        default:"Pending"
    },

    dueDate:Date

},
{
    timestamps:true
});

module.exports=mongoose.model("Task",taskSchema);