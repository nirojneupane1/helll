import mongoose from "mongoose";

const courseSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }
})

const course=mongoose.model('course',courseSchema);
export default course;