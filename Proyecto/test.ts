import "reflect-metadata";
import { AppDataSource, AuthUser, UserRole } from "./database";

async function test() {
  const db = AppDataSource;
  await db.initialize();

  const userRepo = db.getRepository(AuthUser);

  const newUser = userRepo.create({
    email: "heheheha@putamierda.xd",
    passwordHash: "hashedpassword123",
    name: "Test User",
    role: UserRole.ADMIN,
    isActive: true
  });

  await userRepo.save(newUser);

  console.log("Tome su usuario de porqueria", newUser);

  const all = await userRepo.find();
  console.log("ESTOS SON LOS USUARIOS QUE EXISTNEN", all);
}

test()
  .then(() => console.log("Heheheha"))
  .catch((err) => console.error("No sirve inservinle", err))
  .finally(() => process.exit());
