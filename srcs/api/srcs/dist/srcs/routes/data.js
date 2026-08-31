import { Router } from "express";
// import { addData, deleteData, getAllData, getData, updateData} from "../handlers/data.ts";
import * as u from "../handlers/user.js";
import { addfriends, getfriends, deletefriends } from "../handlers/friends.js";
import { register, login, deleteapiuser } from "../handlers/auth.js";
import { authMiddleware, roleMiddleware } from "../middleware/auth.js";
import * as v from "../lib/validator-functions.js";
const DataRouter = Router();
// DataRouter.get("/get-Data/:id", validateIdParam(), getData);
// DataRouter.get("/get-all-Datas", getAllData);
// DataRouter.post("/add-Data", validateDataBody(), validateDataTitle(), addData);
// DataRouter.put("/update-Data/:id", validateIdParam(), validateDataBody(), validateDataTitle(), updateData);
// DataRouter.delete("/delete-Data/:id", validateIdParam(), deleteData);
//auth
DataRouter.post("/register", v.validateEmail(), v.validatePassword(), register);
DataRouter.post("/login", v.validateEmail(), v.validatePassword(), login);
DataRouter.delete("/quit", v.validateEmail(), v.validatePassword(), deleteapiuser);
//users
DataRouter.get("/get-all-users", authMiddleware, u.getalluser);
DataRouter.get("/user", v.validateUsername(), authMiddleware, u.getuserid);
DataRouter.get("/admin/user", v.validateUsername(), authMiddleware, roleMiddleware("admin"), u.admingetuserid);
DataRouter.post("/user", v.validateUsername(), v.validateEmail(), v.validatePassword(), authMiddleware, roleMiddleware("admin"), u.adduser);
DataRouter.patch("/user/:id", ...v.validateUpdateUser(), authMiddleware, roleMiddleware("admin"), u.updateuser);
DataRouter.put("/user/:id", v.validateUsername(), v.validateEmail(), v.validatePassword(), authMiddleware, roleMiddleware("admin"), u.P_updateuser);
DataRouter.delete("/user/:id", v.validateIdParam(), authMiddleware, roleMiddleware("admin"), u.deleteuser);
//fiends
DataRouter.get("/friends/:id", v.validateIdParam(), authMiddleware, roleMiddleware("admin"), getfriends);
DataRouter.post("/friends/", ...v.validateIdFriends(), authMiddleware, roleMiddleware("admin"), addfriends);
DataRouter.delete("/friends/", ...v.validateDeleteFriends(), authMiddleware, roleMiddleware("admin"), deletefriends);
export default DataRouter;
//# sourceMappingURL=data.js.map