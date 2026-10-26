import CredentialsProvider from "next-auth/providers/credentials";

// Đảm bảo NEXTAUTH_SECRET luôn có giá trị để NextAuth không bị lỗi trên Vercel
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "mlbb_store_super_secret_jwt_key_2026_xyz";
}

// Tự động nhận diện URL production nếu triển khai trên Vercel
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const authOptions = {
  // Cấu hình nhà cung cấp xác thực tài khoản Quản trị
  providers: [
    CredentialsProvider({
      name: "Tài khoản Quản trị",
      credentials: {
        username: {
          label: "Tên đăng nhập",
          type: "text",
          placeholder: "tqha2812",
        },
        password: {
          label: "Mật khẩu",
          type: "password",
        },
      },
      async authorize(credentials) {
        const inputUser = (credentials?.username || "").trim();
        const inputPass = (credentials?.password || "").trim();

        if (!inputUser || !inputPass) {
          return null;
        }

        const envUser = (process.env.ADMIN_USERNAME || "tqha2812").trim();
        const envPass = (process.env.ADMIN_PASSWORD || "toilaquocanh5").trim();

        // Xác thực thông tin đăng nhập theo cấu hình môi trường
        const isUserValid = inputUser.toLowerCase() === envUser.toLowerCase();
        const isPassValid = inputPass === envPass;

        if (isUserValid && isPassValid) {
          return {
            id: "admin-1",
            name: "Admin MLBB STORE",
            email: "admin@mlbbstore.vn",
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],

  // Cấu hình trang đăng nhập tùy biến
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  // Cấu hình Session bằng JWT (JSON Web Token)
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Token có hiệu lực 30 ngày
  },

  callbacks: {
    // Lưu role vào JWT Token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "user";
      }
      return token;
    },
    // Truyền role từ Token vào Session của Client
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET || "mlbb_store_super_secret_jwt_key_2026_xyz",
};
