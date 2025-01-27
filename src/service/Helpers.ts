import { Role } from "../interface/utils.types";
import { prisma } from "../server";

class Helpers {
  static getRoleIdByName = async (name: Role) => {
    const role = await prisma.role.findUnique({
      where: { name },
      select: { id: true },
    });
    return role!.id;
  };

}

export default Helpers;
