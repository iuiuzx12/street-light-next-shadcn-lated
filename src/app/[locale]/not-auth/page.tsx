// src/app/[locale]/not-auth/page.tsx
import React from 'react';

export default function NotAuthPage() {
  return (
    <div>
      <h1>Authentication Required</h1>
      <p>You need to be logged in to access this page.</p>
      {/* You might want to add a link to the login page here,
          considering the new login URLs like /en or /th */}
    </div>
  );
}
