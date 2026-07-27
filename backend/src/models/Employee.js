const mongoose=require("mongoose");

const employeeSchema=new mongoose.Schema(
{
    tenant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tenant",
        required:true
    },

    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Department"
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    employeeId:{
        type:String,
        required:true,
        unique:true
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
        enum:["Full-Time","Part-Time","Intern","Contract"],
        default:"Full-Time"
    },

    reportingManager:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },

    status:{
        type:String,
        enum:["Active","Inactive","Resigned"],
        default:"Active"
    }

},
{
    timestamps:true
});

module.exports=mongoose.model("Employee",employeeSchema);