const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  updateUser,
  deleteUser,
  getStudents,
  getStudentsByID,
  getTeachers,
  getTeacherByID,
  profile,
  noOfStudent,
  noOfTeachers,
} = require("../controllers/userController");
const validateToken = require("../middlewares/validateToken");

const authorizedRole = require("../middlewares/authorizedRoles");

const router = express.Router();

router.post(
  "/register",
  validateToken,
  authorizedRole("librarian"),
  registerUser
);
router.post("/login", loginUser);
router.post("/logout", validateToken, logout);
router.put(
  "/update/:id",
  validateToken,
  authorizedRole("librarian", "teacher"),
  updateUser
);
router.delete(
  "/delete/:id",
  validateToken,
  authorizedRole("librarian"),
  deleteUser
);
router.get(
  "/students",
  validateToken,
  authorizedRole("librarian", "teacher"),
  getStudents
);
router.get(
  "/student/:id",
  validateToken,
  authorizedRole("librarian", "teacher"),
  getStudentsByID
);
router.get(
  "/teachers",
  validateToken,
  authorizedRole("librarian"),
  getTeachers
);
router.get(
  "/teacher/:id",
  validateToken,
  authorizedRole("librarian"),
  getTeacherByID
);
router.post("/profile", validateToken, profile);

router.post(
  "/noOfStudents",
  validateToken,
  authorizedRole("librarian", "teacher"),
  noOfStudent
);

router.post(
  "/noOfTeachers",
  validateToken,
  authorizedRole("librarian"),
  noOfTeachers
);

module.exports = router;
