import { Router } from "express";
// import { addData, deleteData, getAllData, getData, updateData} from "../handlers/data.ts";
import { adduser, getalluser, getuserid, deleteuser, updateuser, P_updateuser } from "../handlers/user.ts";
import { addfriends, getfriends, deletefriends } from "../handlers/friends.ts";
import { register } from "../handlers/auth.ts";
import { GelDateDurationBuilder } from "drizzle-orm/gel-core";
import * as v from "../lib/validator-functions.ts";
const DataRouter = Router();

// DataRouter.get("/get-Data/:id", validateIdParam(), getData);
// DataRouter.get("/get-all-Datas", getAllData);
// DataRouter.post("/add-Data", validateDataBody(), validateDataTitle(), addData);
// DataRouter.put("/update-Data/:id", validateIdParam(), validateDataBody(), validateDataTitle(), updateData);
// DataRouter.delete("/delete-Data/:id", validateIdParam(), deleteData);

//auth

DataRouter.post("/register", v.validateUsername(), v.validateEmail(), v.validatePassword(), register)

//users

DataRouter.get("/get-all-users", getalluser);
DataRouter.get("/user/:id", v.validateIdParam(), getuserid);
DataRouter.post("/user", v.validateUsername(), v.validateEmail(), v.validatePassword(), adduser);
DataRouter.patch("/user/:id", v.validateUpdateUser(), updateuser);
DataRouter.put("/user/:id", v.validateUsername(), v.validateEmail(), v.validatePassword(), P_updateuser);
DataRouter.delete("/user/:id", v.validateIdParam(), deleteuser);

//fiends

DataRouter.get("/friends/:id", v.validateIdParam(), getfriends);
DataRouter.post("/friends/", v.validateIdFriends(), addfriends);
DataRouter.delete("/friends/", v.validateDeleteFriends(), deletefriends);

export default DataRouter;
