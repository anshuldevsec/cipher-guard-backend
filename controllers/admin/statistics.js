const User = require("../../models/user.js");
const Notes = require("../../models/secureNotes.js");
const Password = require("../../models/passwordVault.js");
const nodeCache = require("../../utils/nodeCache.js");
const Response = require("../../utils/Response.js");

exports.statistics = async (req, res) => {
  try {
    let allRegisterUser;
    if (nodeCache.has("allRegisterUser")) {
      allRegisterUser = JSON.parse(nodeCache.get("allRegisterUser"));
      Response(res, true, null, 200, allRegisterUser);
      return;
    } else {
      const totalUserCount = await User.countDocuments();
      const latestUsers = await User.find().sort({ createdAt: -1 }).limit(6);
      const totalLockedUsers = await User.countDocuments({ accountLock: true });
      const totalNotes = await Notes.countDocuments();
      const totalPassword = await Password.countDocuments();
      allRegisterUser = {
        allUser: latestUsers,
        totalNotes: totalNotes,
        totalPassword: totalPassword,
        totalUser: totalUserCount,
        totalLockedUser: totalLockedUsers,
      };
      nodeCache.set("allRegisterUser", JSON.stringify(allRegisterUser));
      Response(res, true, null, 200, allRegisterUser);
      return;
    }
  } catch (error) {
    console.log(error);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
