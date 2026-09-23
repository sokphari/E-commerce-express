const pool = require("../src/config/database");
const userRepository = require("../src/repositories/user.repository");
const { hashPassword } = require("../src/utils/password");

function getArg(name) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : undefined;
}

function getAdminInput() {
  return {
    firstName: getArg("firstName") || process.env.ADMIN_FIRST_NAME || "PhoneHub",
    lastName: getArg("lastName") || process.env.ADMIN_LAST_NAME || "Admin",
    email: (getArg("email") || process.env.ADMIN_EMAIL || "").toLowerCase(),
    password: getArg("password") || process.env.ADMIN_PASSWORD || "",
    phone: getArg("phone") || process.env.ADMIN_PHONE,
  };
}

async function run() {
  const input = getAdminInput();

  if (!input.email || !input.password) {
    throw new Error(
      "Admin email and password are required. Use ADMIN_EMAIL and ADMIN_PASSWORD or --email and --password."
    );
  }

  if (input.password.length < 8) {
    throw new Error("Admin password must be at least 8 characters.");
  }

  const existingUser = await userRepository.findByEmail(input.email);

  if (existingUser) {
    if (existingUser.role === "ADMIN") {
      console.log(`Admin already exists: ${input.email}`);
      return;
    }

    const result = await pool.query(
      `
        UPDATE users
        SET role = 'ADMIN', status = 'ACTIVE', updated_at = NOW()
        WHERE email = $1
        RETURNING id, email, role, status
      `,
      [input.email]
    );

    console.log(`Existing user promoted to admin: ${result.rows[0].email}`);
    return;
  }

  const passwordHash = await hashPassword(input.password);

  const admin = await userRepository.createUser({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    passwordHash,
    role: "ADMIN",
  });

  console.log(`Admin created: ${admin.email}`);
}

run()
  .catch((error) => {
    console.error("Create admin failed");
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
