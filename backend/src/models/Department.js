const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
{
    tenantName:{
        type:String,
        required:true,
        trim:true
    },

    departmentName:{
        type:String,
        required:true,
        trim:true
    },

    departmentCode:{
        type:String,
        required:true,
        uppercase:true,
        trim:true
    },

    description:{
        type:String,
        default:""
    },

    managerEmployeeId:{
        type:String,
        default:null
    },

    managerName:{
        type:String,
        default:null
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Department", departmentSchema);