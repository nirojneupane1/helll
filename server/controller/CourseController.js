import Course from '../models/CourseSchema.js';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
//Route 1 Displaying all course
export const displayAllCourse=async(req,res)=>{
    try{
        const course= await Course.find({});
        res.status(200).json(course);
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}

//Route 2 Display single course
export const singleCourseDisplay=async(req,res)=>{
    const {id}=req.params;
    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json({error:"No such course exists"});
        }
        const course=await Course.findById(id);
        if(!course){
            return res.status(404).json({error:"No such course exists"})
        }
        res.status(200).json(course);
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

//Route 3 Adding a course
export const addCourse=async(req,res)=>{
    const{name,description,price}=req.body;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
    }
    try{
        const course=await Course.create({name,description,price});
        res.status(200).json(course)
    }
    catch(error){
        res.status(400).json({error: error.message});
    }
}
//Route 4 Deleting a course
 export const deleteCourse=async(req,res)=>{
    const{id}=req.params;
    const course=await Course.findOneAndDelete({_id:id})
    res.status(200).json(course);
}

// Route 5 Update a course
export const updateCourse=async(req,res)=>{
    const {id}=req.params;
    const course=await Course.findOneAndUpdate({_id:id},{...req.body});
    res.status(200).json(course);
}