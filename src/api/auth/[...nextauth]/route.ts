import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { ListAuth } from '@/interface/auth.tsx'; // Using path alias

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // This is a placeholder for your actual authentication logic.
        // You'll need to replace this with a call to your backend
        // to validate credentials and get user information.

        // For the purpose of this task, we'll simulate a user object
        // that would typically include an authToken after successful login.
        // This authToken will be used to call /StreetLight/getDataUser.
        // In a real scenario, this token comes from your authentication endpoint.
        if (credentials?.username) {
          // Ensure this user object structure is compatible with what your
          // app expects and what is needed for the API call.
          return { id: "1", name: credentials.username, authToken: "simulated-auth-token-for-getDataUser" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // If user object exists (sign-in), fetch DataUser and add dashboard permission to token
      if (user && (user as any).authToken) {
        try {
          // Ensure process.env.API_URL is available here
          const apiUrl = process.env.API_URL;
          if (!apiUrl) {
            console.error("API_URL environment variable is not set.");
            token.dashboardPermission = null;
            return token;
          }

          const responseUser = await fetch(
            apiUrl + "/StreetLight/getDataUser",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + (user as any).authToken,
              },
            }
          );

          if (responseUser.ok) {
            const DataUser: ListAuth = await responseUser.json();
            if (DataUser && DataUser.dashboard && DataUser.dashboard.length > 0) {
              token.dashboardPermission = DataUser.dashboard[0];
            } else {
              token.dashboardPermission = null;
            }
          } else {
            console.error("Failed to fetch DataUser:", responseUser.status, await responseUser.text());
            token.dashboardPermission = null;
          }
        } catch (error) {
          console.error("Error fetching DataUser:", error);
          token.dashboardPermission = null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add dashboardPermission to the session object
      if (session.user) {
        (session.user as any).dashboardPermission = token.dashboardPermission;
      } else {
        session.user = { dashboardPermission: token.dashboardPermission } as any;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const locale = 'th';
      return `${baseUrl}/${locale}/dashboard`;
    }
  },
  pages: {
    signIn: '/th',
    error: '/th'
  },
  secret: "your-256-bit-secret", // Ensure this matches the secret in middleware.ts
});

export { handler as GET, handler as POST };

// const handler = NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         username: { label: 'Username', type: 'text' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         // ... authentication logic
//       }
//     })
//   ],
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // หลัง login สำเร็จให้ไป dashboard
//       const locale = 'th'; // หรือ detect จาก request
//       return `${baseUrl}/${locale}/dashboard`;
//     }
//   },
//   pages: {
//     signIn: '/th', // หน้า login คือ root path
//     error: '/th'
//   }
// });

// export { handler as GET, handler as POST };