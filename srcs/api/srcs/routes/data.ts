import { Router } from "express";
// import { addData, deleteData, getAllData, getData, updateData} from "../handlers/data.ts";
import * as u from "../handlers/user.ts"
import { addfriends, getfriends, deletefriends } from "../handlers/friends.ts";
import { register, login } from "../handlers/auth.ts";
import { authMiddleware, roleMiddleware } from "../middleware/auth.ts";
import * as v from "../lib/validator-functions.ts";
const DataRouter = Router();

// DataRouter.get("/get-Data/:id", validateIdParam(), getData);
// DataRouter.get("/get-all-Datas", getAllData);
// DataRouter.post("/add-Data", validateDataBody(), validateDataTitle(), addData);
// DataRouter.put("/update-Data/:id", validateIdParam(), validateDataBody(), validateDataTitle(), updateData);
// DataRouter.delete("/delete-Data/:id", validateIdParam(), deleteData);

//auth

DataRouter.post("/register", v.validateEmail(), v.validatePassword(), register);
DataRouter.post("/login", v.validateEmail(), v.validatePassword(), login);

//users

DataRouter.get("/get-all-users", authMiddleware, u.getalluser);
DataRouter.get("/user/:id", v.validateIdParam(), authMiddleware, u.getuserid);
DataRouter.get("/admin/user/:id", v.validateIdParam(), authMiddleware, roleMiddleware("admin"), u.admingetuserid);
DataRouter.post("/admin/user", v.validateUsername(), v.validateEmail(), v.validatePassword(), authMiddleware, roleMiddleware("admin"), u.adduser);
DataRouter.patch("/admin/user/:id", ...v.validateUpdateUser(), u.updateuser);
DataRouter.put("/admin/user/:id", v.validateUsername(), v.validateEmail(), v.validatePassword(), authMiddleware, roleMiddleware("admin"), u.P_updateuser);
DataRouter.delete("/admin/user/:id", v.validateIdParam(), authMiddleware, roleMiddleware("admin"), u.deleteuser);

//fiends

DataRouter.get("/friends/:id", v.validateIdParam(), getfriends);
DataRouter.post("/friends/", ...v.validateIdFriends(), addfriends);
DataRouter.delete("/friends/", ...v.validateDeleteFriends(), deletefriends);

export default DataRouter;
