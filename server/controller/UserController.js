import User from '../models/UserSchema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Route 1 send signUp data to database
export const userSignUp = async(req, res)=>{
    const{username,email,password,role}= req.body; 
    try{
        const saltRound=10;
        const salt=await bcrypt.genSalt(saltRound);
        const hashPassword=await bcrypt.hash(password,salt);
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"Email already exists"})
        }
        const accessToken=jwt.sign({userId:User._id},process.env.SECRET,{expiresIn:"1d"})
        const userData=await User.create({username, email, hashPassword,role,accessToken});
        res.status(200).json({data:userData,accessToken});
    }
    catch(error){
        res.status(400).json({error:error.message})
    }
}
//Route 2 Login system
export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      // Compare the provided password
      const passwordValid = await bcrypt.compare(password, user.hashPassword);
      if (!passwordValid) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
      // Create and return JWT token
      const accessToken = jwt.sign({ userId: user._id }, process.env.SECRET,{expiresIn:"1d"});
      await User.findByIdAndUpdate(user._id,{accessToken})
      res.status(200).json({ 
        data:{email:user.email, role:user.role},
        accessToken
       });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  