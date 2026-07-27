const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant",
        required:true
    },

    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:true
    },

    firstName:{
        type:String,
        required:true,
        trim:true
    },

    lastName:{
        type:String,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Invalid Email"]
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String
    },

    profileImage:{
        type:String,
        default:""
    },

    isActive:{
        type:Boolean,
        default:true
    },

    isDeleted:{
        type:Boolean,
        default:false
    },

    lastLogin:{
        type:Date
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User",userSchema);