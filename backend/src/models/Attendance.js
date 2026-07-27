const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    date:{
        type:Date,
        required:true
    },

    checkIn:Date,

    checkOut:Date,

    status:{
        type:String,
        enum:["Present","Absent","Leave","Half-Day"],
        default:"Present"
    },

    workingHours:{
        type:Number,
        default:0
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Attendance",attendanceSchema);