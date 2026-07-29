const mongoose = require("mongoose");


const requestSchema = new mongoose.Schema(
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


    // Requested By

    requestedBy:{

        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        name:{
            type:String,
            required:true
        },

        role:{
            type:String,
            required:true
        }
    },



    // Request Type

    requestType:{
        type:String,

        enum:[
            "Leave",
            "Permission",
            "Work From Home",
            "On Duty",
            "Overtime",
            "Attendance Correction"
        ],

        required:true
    },



    // Leave Information

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



    // Request Details

    reason:{
        type:String,
        required:true,
        trim:true
    },



    // Approval Workflow

    approvalFlow:[

        {

            level:{
                type:Number,
                required:true
            },


            approver:{

                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required:true
                },


                name:{
                    type:String,
                    required:true
                },


                role:{
                    type:String,
                    required:true
                }

            },


            status:{

                type:String,

                enum:[
                    "Waiting",
                    "Pending",
                    "Approved",
                    "Rejected"
                ],

                default:"Waiting"
            },


            actionAt:{
                type:Date,
                default:null
            },


            comment:{
                type:String,
                default:""
            }


        }

    ],



    // Request Timeline

    timeline:{

        fromDate:{
            type:Date,
            required:true
        },


        toDate:{
            type:Date,
            required:true
        },


        requestedAt:{
            type:Date,
            default:Date.now
        },


        completedAt:{
            type:Date,
            default:null
        }

    },



    // Final Approval Information

    processedBy:{

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



    // Overall Status

    status:{

        type:String,

        enum:[
            "Pending",
            "Approved",
            "Rejected",
            "Cancelled"
        ],

        default:"Pending"
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



// Tenant request lookup

requestSchema.index({
    "tenant.tenantId":1
});



// Employee request history

requestSchema.index({

    "requestedBy.userId":1,

    status:1

});



// Approval dashboard optimization

requestSchema.index({

    "approvalFlow.approver.userId":1,

    status:1

});


module.exports = mongoose.model(
    "Request",
    requestSchema
);