import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Cấu hình các nhà cung cấp xác thực (Providers)
  providers: [
    // 1. Đăng nhập bằng Tài khoản & Mật khẩu tĩnh (Credentials Provider)
    CredentialsProvider({
      name: "Tài khoản Quản trị",
      credentials: {
        username: {
          label: "Tên đăng nhập",
          type: "text",
          placeholder: "admin",
        },
        password: {
          label: "Mật khẩu",
          type: "password",
        },
      },
      async authorize(credentials) {
        // Lấy thông tin tài khoản admin từ biến môi trường .env.local
        const adminUser = process.env.ADMIN_USERNAME || "admin";
        const adminPass = process.env.ADMIN_PASSWORD || "admin123";

        if (!credentials?.username || !credentials?.password) {
          throw new Error("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
        }

        // Kiểm tra tài khoản và mật khẩu
        if (
          credentials.username === adminUser &&
          credentials.password === adminPass
        ) {
          // Trả về đối tượng người dùng nếu đăng nhập đúng
          return {
            id: "admin-1",
            name: "Admin MLBB STORE",
            email: "admin@mlbbstore.vn",
            role: "admin",
          };
        }

        // Trả về null nếu sai thông tin
        throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
      },
    }),

    // 2. Đăng nhập bằng Google (Google Provider)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  // Cấu hình trang đăng nhập tùy biến
  pages: {
    signIn: "/auth/login", // Chuyển hướng người dùng đến trang login tự tạo
    error: "/auth/login",  // Chuyển hướng về trang login nếu gặp lỗi
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
