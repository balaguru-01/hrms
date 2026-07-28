const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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

    roleName:{
        type:String,
        required:true,
        trim:true
    },

    reportsTo:{
        type:String,
        default:null,
        trim:true
    },

    employeeId:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true
    },

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
        unique:true,
        lowercase:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    designation:{
        type:String,
        required:true
    },

    joiningDate:{
        type:Date,
        required:true
    },

    salary:{
        type:Number,
        default:0
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

    status:{
        type:String,
        enum:[
            "Active",
            "Inactive",
            "Resigned"
        ],
        default:"Active"
    },

    isActive:{
        type:Boolean,
        default:true
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("User", userSchema);