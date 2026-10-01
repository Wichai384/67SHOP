import NextAuth from "next-auth";
import google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  providers: [google],

  callbacks: {
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;

      const isProductManagementPage =
        /^\/products\/[^/]+\/(edit|delete)$/.test(pathname);

      if (isProductManagementPage) {
        return Boolean(auth?.user);
      }

      return true;
    },
  },
});