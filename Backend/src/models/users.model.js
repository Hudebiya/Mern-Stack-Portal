import mongoose from "mongoose"

const userSchema= new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required:true
    },
    email:  {
        type: String,
        unique: true,
        required:true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; }
    },
    role:{
        type: String,
        default: "patient",
        enum:["user","admin","doctor","patient"]
    },
    specialization: { type: String },
    experience: { type: Number },
    isActive: { type: Boolean, default: true },
    cart:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product",
            required:true
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
            default:1
        }
    }]
})
const userModel = mongoose.model("user",userSchema)
export default userModel