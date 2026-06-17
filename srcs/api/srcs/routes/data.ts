import { Router } from "express";
// import { addData, deleteData, getAllData, getData, updateData} from "../handlers/data.ts";
import { validateIdParam, validateDataBody, validateDataTitle} from "../lib/validator-functions.ts";
import { adduser, getalluser, getuserid, deleteuser, updateuser, P_updateuser } from "../handlers/user.ts";
import { addfriends, getfriends } from "../handlers/friends.ts";
import * as v from "../lib/validator-functions.ts";
import { GelDateDurationBuilder } from "drizzle-orm/gel-core";

const DataRouter = Router();

// DataRouter.get("/get-Data/:id", validateIdParam(), getData);
// DataRouter.get("/get-all-Datas", getAllData);
// DataRouter.post("/add-Data", validateDataBody(), validateDataTitle(), addData);
// DataRouter.put("/update-Data/:id", validateIdParam(), validateDataBody(), validateDataTitle(), updateData);
// DataRouter.delete("/delete-Data/:id", validateIdParam(), deleteData);

DataRouter.get("/get-all-users", getalluser);
DataRouter.get("/user/:id", validateIdParam(), getuserid);
DataRouter.post("/user", v.validateUsername(), v.validateEmail(), v.validatePassword(), adduser);
DataRouter.patch("/user/:id", v.validateUpdateUser(), updateuser);
DataRouter.put("/user/:id", v.validateUsername(), v.validateEmail(), v.validatePassword(), P_updateuser);
DataRouter.delete("/user/:id", v.validateIdParam(), deleteuser);

DataRouter.get("/friends/:id", validateIdParam(), getfriends);
DataRouter.post("/friends/", v.validateIdFriends(), addfriends);

export default DataRouter;
