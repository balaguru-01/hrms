const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema(
{

    // Tenant Information

    tenant:{

        tenantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tenant",
            required:true,
            index:true
        },


        orgName:{
            type:String,
            required:true,
            trim:true
        },


        email:{
            type:String,
            required:true,
            lowercase:true,
            trim:true
        }

    },



    // Employee Information

    user:{

        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true
        },


        name:{
            type:String,
            required:true,
            trim:true
        },


        department:{
            type:String,
            default:""
        }

    },



    // Attendance Date

    date:{
        type:Date,
        required:true
    },



    // Current Session

    currentSession:{

        type:String,

        enum:[
            "Logged Out",
            "Logged In",
            "On Break"
        ],

        default:"Logged Out"

    },



    // Check In

    checkIn:{

        time:{
            type:Date,
            default:null
        },


        location:{
            type:String,
            default:""
        }

    },



    // Break Tracking

    breaks:[

        {

            breakType:{

                type:String,

                enum:[
                    "Tea Break",
                    "Lunch Break",
                    "Personal Break",
                    "Other"
                ],

                default:"Other"

            },


            startTime:{
                type:Date,
                default:null
            },


            endTime:{
                type:Date,
                default:null
            },


            duration:{
                type:Number,
                default:0
            }


        }

    ],



    // Check Out

    checkOut:{

        time:{
            type:Date,
            default:null
        },


        location:{
            type:String,
            default:""
        }

    },



    // Working Calculation

    totalLoginHours:{
        type:Number,
        default:0
    },


    totalBreakHours:{
        type:Number,
        default:0
    },


    totalWorkingHours:{
        type:Number,
        default:0
    },



    // Attendance Status

    status:{

        type:String,

        enum:[
            "Present",
            "Absent",
            "Leave",
            "Half-Day",
            "Holiday"
        ],

        default:"Present"

    },



    // Audit Information

    createdBy:{

        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
        },


        name:{
            type:String,
            default:null
        },


        role:{
            type:String,
            default:null
        }

    },



    isActive:{
        type:Boolean,
        default:true
    },


    isDeleted:{
        type:Boolean,
        default:false
    }


},
{
    timestamps:true
});



// One attendance per employee per day

attendanceSchema.index(
{

    "tenant.tenantId":1,

    "user.userId":1,

    date:1

},
{
    unique:true
});



// Employee attendance history

attendanceSchema.index({

    "user.userId":1,

    date:-1

});


module.exports = mongoose.model(
    "Attendance",
    attendanceSchema
);