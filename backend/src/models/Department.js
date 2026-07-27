const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant",
        required:true
    },

    departmentName:{
        type:String,
        required:true,
        trim:true
    },

    departmentCode:{
        type:String,
        required:true,
        uppercase:true
    },

    description:{
        type:String,
        default:""
    },

    manager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Department",departmentSchema);