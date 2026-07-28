const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema(
{
    tenantName:{
        type:String,
        required:true
    },

    employeeId:{
        type:String,
        required:true
    },

    employeeName:{
        type:String,
        required:true
    },

    action:{
        type:String,
        required:true
    },

    module:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },

    ipAddress:{
        type:String,
        default:""
    },

    device:{
        type:String,
        default:""
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("AuditLog", auditSchema);