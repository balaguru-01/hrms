const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
{
    tenantName:{
        type:String,
        required:true
    },

    assignedToEmployeeId:{
        type:String,
        required:true
    },

    assignedToName:{
        type:String,
        required:true
    },

    assignedBy:{
        type:String,
        required:true
    },

    title:{
        type:String,
        required:true,
        trim:true
    },

    description:{
        type:String,
        default:""
    },

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

    dueDate:{
        type:Date,
        required:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Task", taskSchema);