import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import { generateHash, generateToken, generateRefreshToken } from '../utils/generateTokens.js';
import bcrypt from 'bcryptjs';


const signup = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await generateHash(password);

    const newUser = new User({ 
      email, 
      name, 
      password: hashedPassword
    });
    await newUser.save();

    const refreshtoken = generateRefreshToken(newUser);
    newUser.refreshTokens = [refreshtoken];
    await newUser.save();
  
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        email,
        name
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    
    const user = await User.findOne({ email });
    
    if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      
      return res.status(400).json({
        success: false,
        message: "Invalid credentials, Try Again",
      });

    }

    const accesstoken = generateToken(user);
    
    console.log("Generated token for user:", email, accesstoken);


    //Just Incase there is no Refresh Token , i am creating new
    const refreshtoken = user.refreshTokens[0] || generateRefreshToken(user);
    
    if (!user.refreshTokens.length) {
      user.refreshTokens = [refreshtoken];
      await user.save();
    }

    res.cookie("accessToken", accesstoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("Login successful -> Cookies set");
    
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        accesstoken: accesstoken,
        refreshtoken: refreshtoken
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};


const logout = async (req, res) => {
  try {
    console.log('logout called');
    
    // Clear cookies with same options as when they were set
    res.clearCookie("accessToken", { 
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
    
    res.clearCookie("refreshToken", { 
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.json({ 
      success: true, 
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error('logout error', error);
    return res.status(500).json({ 
      success: false, 
      message: "Logout failed", 
      error: error.message 
    });
  }
};


const getCurrentUser = async (req, res) => {
  try {
    //Protected Route sets the user 
    const user = await User.findById(req.user._id).select("-password -refreshTokens");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: user._id.toString(),
        name: user.name,
        email: user.email
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user",
      error: error.message,
    });
  }
};


const refresh = async (req, res) => {
  try {

    const RefreshToken = req.cookies?.refreshToken;
    if (!RefreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    let payload;
    try {
      payload = jwt.verify(RefreshToken, process.env.REFRESH_TOKEN);
    } catch (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const tokenIndex = user.refreshTokens.findIndex(t => t === RefreshToken);

    if (tokenIndex === -1) {
      return res.status(403).json({ success: false, message: "Invalid refresh token. Please login again." });
    }

    //
    const newAccessToken = generateToken(user);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 1 * 60 * 1000, // 1 minute
    });

    return res.status(200).json({ success: true, message: "Token refreshed" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Refresh failed", error: error.message });
  }
};




export default {
  signup,
  login,
  refresh,
  logout,
  getCurrentUser
}