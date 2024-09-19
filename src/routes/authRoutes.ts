// routes/authRoutes.ts
import { Router, Request, Response } from "express";
import Users from "../models/UserModel";
import bcrypt from "bcrypt";
import session from "express-session";
import { addUser, removeUser, getLoggedInUsers } from "./userTracker";
import { Server } from "socket.io";

const router = Router();
router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

router.post("/login", async (req: Request, res: Response) => {
  console.log(req.body);
  const { Email, PasswordHash } = req.body;

  try {
    const user = await Users.findOne({ where: { Email, PasswordHash } });
    console.log(user?.dataValues.UserID);
    addUser(user?.dataValues.UserID);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // const validPassword = await bcrypt.compare(PasswordHash, user.PasswordHash);

    // if (!validPassword) {
    //   return res.status(401).json({ message: "Invalid credentials2" });
    // }

    // Here you can generate a JWT token or session
    return res
      .status(200)
      .json({ userDetails: user.dataValues, message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", (req: Request, res: Response) => {
  // if (req.session) {
  //   req.session.destroy((err) => {
  //     if (err) {
  //       return res.status(500).json({ message: "Failed to log out" });
  //     }
  //     res.status(200).json({ message: "Logout successful" });
  //   });
  // } else {
  //   res.status(200).json({ message: "Logout successful" });
  // }
  try {
    // console.log("",req.body.UserID)
    const userId = req.body.userId; // Assume userId is sent in the request body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Remove user from logged-in users
    removeUser(userId);

    // Notify other clients about the status change
    // notifyUserStatusChange(io);

    res.status(200).json({ message: "User logged out successfully" });
  } catch (err: any) {
    console.error("Error logging out user:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/loggedInUsers", (req: Request, res: Response) => {
  try {
    const users = getLoggedInUsers();
    console.log("Loggedin", users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching logged-in users" });
  }
});

export default router;
