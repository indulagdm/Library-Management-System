const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CustomError = require("../middlewares/CustomError");

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, regNumber, password, role } = req.body;

    if (!firstName || !lastName || !regNumber || !password || !role) {
      return next(new CustomError("All fields are required.", 400));
    }

    //find regNumber already registered or not

    const existUser = await User.findOne({ regNumber: regNumber });

    if (existUser) {
      return next(new CustomError("User already registered.", 400));
    }

    //hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      regNumber,
      password: hashPassword,
      role,
    });

    if (newUser) {
      res.status(201).json({ message: `new ${role} created.`, data: newUser });
    } else {
      return next(new CustomError("user not created.", 400));
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { regNumber, password } = req.body;

    if (!regNumber || !password) {
      return next(new CustomError("All fields are required."));
    }

    const existUser = await User.findOne({ regNumber: regNumber });

    if (!existUser) {
      return next(
        new CustomError("User not registered. Contact your Librarian.", 404)
      );
    }

    const isMatchPassword = await bcrypt.compare(password, existUser.password);

    if (!isMatchPassword) {
      return next(
        new CustomError(
          "Password doesn't match. Please re-enter correct password.",
          400
        )
      );
    }

    if (existUser && isMatchPassword) {
      const accessToken = jwt.sign(
        { id: existUser._id, role: existUser.role },
        process.env.SECRET_KEY,
        { expiresIn: "2h" }
      );
      res.status(200).json({
        message: "Login successful",
        data: { existUser, accessToken },
      });
      console.log(`${existUser.role} logged.`);
    } else {
      return next(
        new CustomError(
          "Login unsuccessful. Please re-enter right login credentials.",
          400
        )
      );
    }
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const existUser = await User.findById(userID);

    if (existUser) {
      res.status(200).json({ message: "Log out successful." });
    }else{
      return next(new CustomError("You are not log in. please login.",400));
    }
  } catch (error) {
    next(error);
  }
};

const getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: "student" });

    if (students) {
      res.status(200).json({ message: "Result found.", data: students });
    } else {
      return next(new CustomError("No students found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const getStudentsByID = async (req, res, next) => {
  try {
    const id = req.params.id;

    const student = await User.findById(id);

    if (student) {
      res.status(200).json({ message: "Result found.", data: student });
    } else {
      return next(new CustomError("No student found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const getTeachers = async (req, res, next) => {
  try {
    const teachers = await User.find({ role: "teacher" });

    if (teachers) {
      res.status(200).json({ message: "Record found.", data: teachers });
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const getTeacherByID = async (req, res, next) => {
  try {
    const teacher = await User.findById(id);

    if (teacher) {
      res.status(200).json({ message: "Record found.", data: teacher });
    } else {
      return next(new CustomError("No record found.", 404));
    }
  } catch (error) {
    next(error);
  }
};

const profile = async(req,res,next)=>{
  try{
    const userID = req.user.id;

    const existUser = await User.findById(userID);

    if(existUser){
      res.status(200).json({message:"Record found.",data:existUser});
    }else{
      return next(new CustomError("User not found.",404));
    }

  }catch(error){
    next(error);
  }
}

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return next(new CustomError("User not found", 404));
    }

    if (
      req.user.role !== "librarian" &&
      String(user.id) !== String(req.user.id)
    ) {
      return next(
        new CustomError("You are not allow to proceed this action.", 401)
      );
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { firstName: req.body.firstName, lastName: req.body.lastName },
      { new: true }
    );

    if (updateUser) {
      res.status(200).json({ message: "Update successful.", data: updateUser });
      console.log(`${updateUser.role} details updated.`);
    } else {
      return next(new CustomError("Update failed.", 400));
    }
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return next(new CustomError("Not found.", 404));
    }

    if (
      req.user.role !== "librarian" &&
      String(user.id) !== String(req.user.id)
    ) {
      return next(
        new CustomError("You are not allow to proceed this action.", 401)
      );
    }

    const deleteUser = await User.findByIdAndDelete(id);

    if (deleteUser) {
      res.status(200).json({ message: "Delete successful." });
      console.log(`${deleteUser.role} deleted.`);
    } else {
      return next(new CustomError("Delete failed.", 400));
    }
  } catch (error) {
    next(error);
  }
};

const noOfStudent = async(req,res,next)=>{
  try{
    const count = await User.countDocuments({role:"student"});

    if(count){
      res.status(200).json({message:"Record found.",data:count});
    }else{
      return next(new CustomError("No data found.",404));
    }

  }catch(error){
    next(error);
  }
}

const noOfTeachers = async(req,res,next)=>{
  try{
    const count = await User.countDocuments({role:"teacher"});

    if(count){
      res.status(200).json({message:"Record found.",data:count});
    }else{
      return next(new CustomError("No data found.",404));
    }

  }catch(error){
    next(error);
  }
}

module.exports = {
  registerUser,
  loginUser,
  logout,
  profile,
  updateUser,
  deleteUser,
  getStudents,
  getStudentsByID,
  getTeachers,
  getTeacherByID,
  noOfStudent,
  noOfTeachers
};
