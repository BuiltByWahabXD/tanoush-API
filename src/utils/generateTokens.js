import becrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateHash = async (password) => {
    const salt = await becrypt.genSalt(10);
    const hashedPassword = await becrypt.hash(password, salt);
    return hashedPassword;
}

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET || "ReplacementKeyForDev11225478@@@45156",
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role },
    process.env.REFRESH_TOKEN ,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );
};


export { generateHash, generateToken, generateRefreshToken };