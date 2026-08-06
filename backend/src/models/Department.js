const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
{
    tenant:{
        tenantId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tenant",
            required:true,
            // index:true
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


    name:{
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


    managedBy:{
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


// departmentSchema.index({
//     "tenant.tenantId":1
// });


departmentSchema.index(
{
    "tenant.tenantId":1,
    name:1
},
{
    unique:true
});


departmentSchema.index(
{
    "tenant.tenantId":1,
    departmentCode:1
},
{
    unique:true
});


module.exports = mongoose.model(
    "Department",
    departmentSchema
);