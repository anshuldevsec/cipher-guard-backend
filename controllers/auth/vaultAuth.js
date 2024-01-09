import { user as User } from "../../models/user.js";
import bcrypt from "bcrypt";
import Response from "../../utils/Response.js";

export const vaultAuth = async (req, res) => {
  try {
    const { vaultPin } = await req.json();
    const verifyUser = req.user;
    const user = await User.findById(verifyUser.id);
    if (!vaultPin || vaultPin.toString().length !== 6) {
      Response(res, false, "Enter a 6-digit number vault pin", 422);
      return;
    } else if (!user.vaultPin) {
      Response(res, false, "create 6 digit vault pin", 422);
      return;
    } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
      Response(res, false, "Vault pin is incorrect", 402);
      return;
    }
    Response(res, true, "Successfull", 200);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};