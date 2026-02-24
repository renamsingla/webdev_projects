import mongoose from "mongoose";

const StatusSchema= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"hey! I am using ChatOn",
        maxlength: 250
    }
})


const Status = mongoose.model("Status",StatusSchema);
export default Status;