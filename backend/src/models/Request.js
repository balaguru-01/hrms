const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
{
    tenantName:{
        type:String,
        required:true
    },

    employeeId:{
        type:String,
        required:true
    },

    employeeName:{
        type:String,
        required:true
    },

    departmentName:{
        type:String,
        required:true
    },

    designation:{
        type:String,
        required:true
    },

    approvedBy:{
        type:String,
        default:null
    },

    requestType:{
        type:String,
        enum:[
            "Leave",
            "Permission",
            "Work From Home",
            "On Duty",
            "Overtime"
        ],
        required:true
    },

    leaveCategory:{
        type:String,
        enum:[
            "Casual",
            "Sick",
            "Earned",
            "Maternity",
            "Paternity"
        ],
        default:null
    },

    fromDate:{
        type:Date,
        required:true
    },

    toDate:{
        type:Date,
        required:true
    },

    reason:{
        type:String,
        required:true,
        trim:true
    },

    status:{
        type:String,
        enum:["Pending","Approved","Rejected"],
        default:"Pending"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Request", requestSchema);