const mongoose = require("mongoose");


const roleSchema = new mongoose.Schema(
{
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


    name:{
        type:String,
        required:true,
        trim:true
    },


    description:{
        type:String,
        default:""
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


    isSystemRole:{
        type:Boolean,
        default:false
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


roleSchema.index({
    "tenant.tenantId":1
});


roleSchema.index(
{
    "tenant.tenantId":1,
    name:1
},
{
    unique:true
});


module.exports = mongoose.model(
    "Role",
    roleSchema
);