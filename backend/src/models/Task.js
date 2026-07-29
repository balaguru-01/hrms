const mongoose = require("mongoose");


const taskSchema = new mongoose.Schema(
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


    // Task Information

    title:{
        type:String,
        required:true,
        trim:true
    },


    description:{
        type:String,
        default:""
    },


    // Task Creator

    assignedBy:{

        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },


        name:{
            type:String,
            required:true,
            trim:true
        },


        role:{
            type:String,
            required:true
        }
    },



    // Task Receiver

    assignedTo:{

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


        role:{
            type:String,
            required:true
        }

    },



    // Task Timeline

    timeline:{

        assignedAt:{
            type:Date,
            default:Date.now
        },


        dueDate:{
            type:Date,
            required:true
        },


        submittedAt:{
            type:Date,
            default:null
        },


        completedAt:{
            type:Date,
            default:null
        }

    },



    priority:{
        type:String,

        enum:[
            "Low",
            "Medium",
            "High",
            "Urgent"
        ],

        default:"Medium"
    },



    status:{
        type:String,

        enum:[
            "Pending",
            "In Progress",
            "Completed",
            "Cancelled"
        ],

        default:"Pending"
    },



    // Completion Details

    completedBy:{

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



    // Soft Delete

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



// Tenant task lookup

taskSchema.index({
    "tenant.tenantId":1
});



// Employee dashboard optimization

taskSchema.index({
    "assignedTo.userId":1,
    status:1
});



// Manager task optimization

taskSchema.index({
    "assignedBy.userId":1,
    status:1
});


module.exports = mongoose.model(
    "Task",
    taskSchema
);