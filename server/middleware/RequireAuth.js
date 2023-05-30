import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/UserSchema.js';

dotenv.config();

export const requireAuth = (role) => {
  return async (req, res, next) => { // Use async function here
    const token = req.header('auth-token');
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Please enter a valid token" });
    }
    try {
      const data = jwt.verify(token, process.env.SECRET);
      console.log(data)
      const user = await User.findById(data.userId);
      if (!user) {
        return res.status(401).json({ error: "Not authorized" });
      }
      console.log(user.role,user.email);
      if (!role.includes(user.role)) {
        return res.status(401).json({ error: "Access denied" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ error: "Please enter a valid token" });
    }
  };
};

