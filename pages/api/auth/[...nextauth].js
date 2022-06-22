import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    // ...add more providers here
  ],
  pages: {
    signIn: "/",
  },
  jwt: {
    encryption: true,
  },
  secret: process.env.secret,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      return token;
    },
  },
  redirect: async (url, _baseUrl) => {
    if (url === "/signin") {
      return Promise.resolve("/");
    }
    return Promise.resolve("/");
  },
});
