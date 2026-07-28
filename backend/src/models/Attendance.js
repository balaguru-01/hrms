const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    date:{
        type:Date,
        required:true
    },

    checkIn:Date,

    breakIn:Date,

    breakOut:Date,

    checkOut:Date,

    breakHours:{
        type:Number,
        default:0
    },

    workingHours:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:["Present","Absent","Leave","Half-Day"],
        default:"Present"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Attendance", attendanceSchema);