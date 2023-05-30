import mongoose from 'mongoose';

const userSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    hashPassword:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'student',
        enum:['student','teacher','admin']
    },
    accessToken:{
        type:String
    }
})

const user=mongoose.model('user',userSchema);
export default user;