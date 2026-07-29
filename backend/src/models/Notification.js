const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema(
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



    // Notification Sender

    sender:{

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



    // Notification Receiver

    recipient:{

        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true
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



    // Notification Content

    title:{
        type:String,
        required:true,
        trim:true
    },


    message:{
        type:String,
        required:true,
        trim:true
    },



    type:{

        type:String,

        enum:[
            "Task",
            "Request",
            "Attendance",
            "Department",
            "User",
            "Role",
            "System",
            "Announcement"
        ],

        required:true

    },



    // Related Record

    reference:{

        module:{
            type:String,
            required:true
        },


        referenceId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }

    },



    // Read Status

    isRead:{
        type:Boolean,
        default:false
    },



    timeline:{

        sentAt:{
            type:Date,
            default:Date.now
        },


        readAt:{
            type:Date,
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



// Tenant notifications

notificationSchema.index({
    "tenant.tenantId":1
});



// User inbox optimization

notificationSchema.index({

    "recipient.userId":1,

    isRead:1

});



// Recent notifications

notificationSchema.index({

    createdAt:-1

});


module.exports = mongoose.model(
    "Notification",
    notificationSchema
);