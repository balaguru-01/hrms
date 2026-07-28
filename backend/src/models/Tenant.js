const mongoose = require("mongoose");
const validator = require("validator");

const tenantSchema = new mongoose.Schema(
{
    tenantName:{
        type:String,
        required:true,
        trim:true
    },

    companyCode:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,"Invalid Email"]
    },

    phone:{
        type:String,
        required:true
    },

    website:{
        type:String,
        default:""
    },

    logo:{
        type:String,
        default:""
    },

    industry:{
        type:String,
        required:true
    },

    address:{
        doorNumber:String,
        street:String,
        city:String,
        state:String,
        country:String,
        postalCode:String
    },

    subscription:{
        plan:{
            type:String,
            enum:["Free","Basic","Premium","Enterprise"],
            default:"Free"
        },

        status:{
            type:String,
            enum:["Trial","Active","Expired","Suspended"],
            default:"Trial"
        },

        startDate:Date,

        endDate:Date
    },

    employeeLimit:{
        type:Number,
        default:10
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

module.exports=mongoose.model("Tenant",tenantSchema);