import bcryptjs from "bcryptjs";

function isBun(): boolean {
  return typeof Bun !== "undefined" && typeof Bun.password !== "undefined";
}

export async function hashPassword(password: string): Promise<string> {
  if (isBun()) {
    return await Bun.password.hash(password);
  }
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (isBun()) {
    return await Bun.password.verify(password, hash);
  }
  return await bcryptjs.compare(password, hash);
}
