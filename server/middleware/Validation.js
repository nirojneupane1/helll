import { body, validationResult } from 'express-validator';

const validationReq = [
  body('username','Please enter a valid username').isLength({ min: 3 }),
  body('email','Please enter a valid email').isEmail(),
  body('password','Password must contain at least 8 characters including uppercase, lowercase, and special characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  // Custom middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export default validationReq;
