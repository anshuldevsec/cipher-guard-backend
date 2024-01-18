const User = require("../../models/user.js");
const Notes = require("../../models/secureNotes.js");
const Password = require("../../models/passwordVault.js");
const nodeCache = require("../../utils/nodeCache.js");
const Response = require("../../utils/Response.js");

exports.statistics = async (req, res) => {
  try {
    const getAllRegisterUser = await User.find()
      .sort({ createdAt: -1 })
      .limit(6);
    const totalNotes = await Notes.countDocuments();
    const totalPassword = await Password.countDocuments();
    let allRegisterUser;
    if (nodeCache.has("allRegisterUser")) {
      allRegisterUser = nodeCache.get(JSON.parse("allRegisterUser"));
      Response(res, true, null, 200, allRegisterUser);
      return;
    } else {
      allRegisterUser = {
        allUser: getAllRegisterUser,
        totalNotes: totalNotes,
        totalPassword: totalPassword,
      };
      nodeCache.set("allRegisterUser", JSON.stringify(allRegisterUser));
      Response(res, true, null, 200, allRegisterUser);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
