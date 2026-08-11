import { connectMongo, disconnectMongo } from "../database/mongo.js";
import { AdminModel } from "../models/index.js";
import { hashPassword } from "../utils/password.js";

const run = async () => {
  const name = process.env.FIRST_ADMIN_NAME || "Urban Layers Owner";
  const email = (process.env.FIRST_ADMIN_EMAIL || "").trim().toLowerCase();
  const password = process.env.FIRST_ADMIN_PASSWORD || "";

  if (!email || !password) {
    throw new Error("FIRST_ADMIN_EMAIL and FIRST_ADMIN_PASSWORD are required.");
  }

  await connectMongo();

  const existing = await AdminModel.findOne({ email });

  if (existing) {
    console.log(`Admin already exists for ${email}`);
    await disconnectMongo();
    return;
  }

  const passwordHash = await hashPassword(password);

  await AdminModel.create({
    name,
    email,
    passwordHash,
    role: "SuperAdmin",
    isActive: true
  });

  console.log(`Created first admin user: ${email}`);

  await disconnectMongo();
};

void run().catch(async (error) => {
  console.error(error.message);
  try {
    await disconnectMongo();
  } catch {
    // ignore disconnect errors during script shutdown
  }
  process.exit(1);
});
