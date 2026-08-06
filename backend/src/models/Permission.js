const mongoose = require("mongoose");


const permissionSchema = new mongoose.Schema(
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


    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:true
    },


    module:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },


    actions:[
    {
        type:String,
        enum:[
            "create",
            "read",
            "update",
            "delete",
            "approve",
            "reject",
            "export",
            "manage"
        ]
    }
    ],


    description:{
        type:String,
        default:""
    },


    createdBy:{
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


// permissionSchema.index({
//     "tenant.tenantId":1
// });


permissionSchema.index(
{
    "tenant.tenantId":1,
    role:1,
    module:1
},
{
    unique:true
});


module.exports = mongoose.model(
    "Permission",
    permissionSchema
);