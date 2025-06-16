// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

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