const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
{
    // Tenant Information
    tenant:{
        tenantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tenant",
            // required:true,      //enterpriseAdmin
            index:true
        },

        orgName:{
            type:String,
            // required:true,    //enterpriseAdmin
            trim:true
        },

        email:{
            type:String,
            // required:true,         //enterpriseAdmin
            lowercase:true,
            trim:true
        }
    },


    // Basic User Information
    firstName:{
        type:String,
        required:true,
        trim:true
    },

    lastName:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,

        validate:[
            validator.isEmail,
            "Invalid Email"
        ]
    },


    password:{
        type:String,
        required:true,
        select:false
    },


    phone:{
        type:String,
        required:true,
        trim:true
    },


    // Authorization
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:true
    },


    // Job Information
    designation:{
        type:String,
        required:true,
        trim:true
    },


    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department",
        default:null
    },


    joiningDate:{
        type:Date,
        required:true
    },


    employmentType:{
        type:String,
        enum:[
            "Full-Time",
            "Part-Time",
            "Intern",
            "Contract"
        ],
        default:"Full-Time"
    },


    salary:{
        type:Number,
        default:0
    },


    // Reporting Hierarchy
    reportingTo:{
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


    // Audit Information
    createdBy:{
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
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


    // Account Management

    status:{
        type:String,

        enum:[
            "Active",
            "Inactive",
            "Resigned",
            "Suspended"
        ],

        default:"Active"
    },


    isActive:{
        type:Boolean,
        default:true
    },


    isDeleted:{
        type:Boolean,
        default:false
    },


    // Authentication Tracking

    lastLogin:{
        type:Date,
        default:null
    },


    passwordChangedAt:{
        type:Date,
        default:null
    },


    // Session Security
    tokenVersion:{
        type:Number,
        default:0
    }

},
{
    timestamps:true
});


// Tenant isolation optimization

userSchema.index({
    "tenant.tenantId":1
});


// Unique email inside tenant

userSchema.index(
{
    "tenant.tenantId":1,
    email:1
},
{
    unique:true
});


module.exports = mongoose.model(
    "User",
    userSchema
);