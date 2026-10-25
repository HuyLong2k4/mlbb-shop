import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "mlbb_store_super_secret_jwt_key_2026_xyz";
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
