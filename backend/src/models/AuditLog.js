const mongoose = require("mongoose");


const auditLogSchema = new mongoose.Schema(
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



    // User who performed the action

    performedBy:{

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



    // Module affected

    module:{
        type:String,
        required:true,
        trim:true
    },



    // Action performed

    action:{

        type:String,

        enum:[
            "Create",
            "Read",
            "Update",
            "Delete",
            "Login",
            "Logout",
            "Approve",
            "Reject",
            "Assign",
            "Submit",
            "Export"
        ],

        required:true

    },



    // Reference Record

    reference:{

        module:{
            type:String,
            default:null
        },


        referenceId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }

    },



    // Description

    description:{
        type:String,
        required:true,
        trim:true
    },



    // Request Details

    ipAddress:{
        type:String,
        default:""
    },


    device:{
        type:String,
        default:""
    },


    // Status

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



// Tenant activity lookup

auditLogSchema.index({
    "tenant.tenantId":1
});



// User activity history

auditLogSchema.index({
    "performedBy.userId":1
});



// Module action search

auditLogSchema.index({
    module:1,
    action:1
});


module.exports = mongoose.model(
    "AuditLog",
    auditLogSchema
);