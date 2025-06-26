# Next.js Light Street Control Panel

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It serves as a control panel for managing street lights, built with modern web technologies.

## Project Overview

The Light Street Control Panel is a web application designed to monitor and control street lighting systems. It provides administrators with a user-friendly interface to:

* View the status of individual lights and groups of lights.
* Control light operations (turn on/off, dim).
* Manage user accounts and permissions.
* (Potentially) Schedule light operations and view energy consumption data.

This project aims to provide a robust and scalable solution for smart city lighting management.

## Target Audience

This project is intended for:

* **Developers:** Who will maintain and extend the functionality of the control panel.
* **System Administrators:** Who will deploy and manage the application.
* **Control Room Operators:** Who will use the application for daily monitoring and control tasks.

## Architecture and Technologies

This project is built upon the Next.js framework, leveraging its capabilities for server-side rendering (SSR) and static site generation (SSG) where applicable. Key technologies include:

* **Framework:** [Next.js](https://nextjs.org/) (using the App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Authentication:** [NextAuth.js](https://next-auth.js.org/) for handling user sessions and authentication.
* **Internationalization (i18n):** [next-intl](https://next-intl-docs.vercel.app/) for supporting multiple languages (English and Thai).
* **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (likely, based on common Next.js project structures and the presence of `components.json`) and potentially custom components.
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS.
* **Linting/Formatting:** ESLint (likely, based on `eslint.config.mjs`).
* **Package Manager:** npm (based on `package-lock.json`).

The application likely interacts with a backend API (specified by `process.env.API_URL` in `src/middleware.ts`) to fetch data and send commands to the street light system.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (version 20.x or later recommended)
* [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the necessary environment variables. At a minimum, you will likely need `API_URL` for the backend API and `NEXTAUTH_SECRET` for NextAuth.js.
    ```env
    # Example .env.local
    API_URL=http://your-backend-api-url/api
    NEXTAUTH_SECRET=your-secure-nextauth-secret # Generate a strong secret
    NEXTAUTH_URL=http://localhost:3000 # For development
    ```
    Refer to `src/middleware.ts` and potentially other API interaction points to identify all required environment variables.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying files in the `src/app` directory. The page auto-updates as you edit the files.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

The project follows a structure typical of Next.js applications using the App Router:

```
.
├── public/                   # Static assets (images, fonts, etc.)
├── src/
│   ├── app/                  # Main application code (App Router)
│   │   ├── [locale]/         # Internationalization (i18n) routes
│   │   │   ├── (dashboard)/  # Route group for authenticated dashboard pages
│   │   │   ├── layout.tsx    # Root layout for localized pages
│   │   │   ├── not-auth/     # Pages for unauthenticated users (e.g., login)
│   │   │   └── page.tsx      # Main entry page for each locale
│   │   ├── api/              # API routes (Next.js Route Handlers)
│   │   │   ├── auth/         # Authentication related API endpoints
│   │   │   └── ...           # Other API endpoints
│   │   ├── favicon.ico
│   │   ├── globals.css       # Global styles
│   │   ├── loading.module.css # Styles for loading components
│   │   └── loading.tsx       # Root loading component
│   ├── components/           # Reusable UI components
│   │   ├── ui/               # UI primitives (often from Shadcn/ui)
│   │   └── ...               # Custom application components
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization configuration and utilities
│   ├── interface/            # TypeScript interfaces and type definitions
│   ├── lib/                  # Utility functions and libraries
│   ├── messages/             # Translation files (e.g., en.json, th.json)
│   ├── middleware.ts         # Next.js middleware for auth and i18n
│   └── model/                # Data models or structures
├── .env.local                # Local environment variables (ignored by Git)
├── .eslintrc.mjs             # ESLint configuration
├── .gitignore
├── components.json           # Shadcn/ui configuration
├── next.config.ts            # Next.js configuration
├── package-lock.json
├── package.json
├── postcss.config.mjs        # PostCSS configuration (for Tailwind CSS)
├── README.md                 # This file
└── tsconfig.json             # TypeScript configuration
```

## Key Components and Features

*   **Authentication (`src/middleware.ts`, `src/app/api/auth/`):** Uses NextAuth.js to protect routes and manage user sessions.
*   **Internationalization (`src/i18n/`, `src/messages/`, `src/middleware.ts`):** Supports English and Thai languages using `next-intl`.
*   **UI (`src/components/`):** A collection of reusable React components, likely built with Shadcn/ui and Tailwind CSS.
*   **Dashboard (`src/app/[locale]/(dashboard)/`):** The main area for authenticated users to interact with the street light system.
*   **API Routes (`src/app/api/`):** Backend endpoints for handling client requests, such as login, logout, and data fetching.

## Customization and Extension

*   **Adding New Languages:**
    1.  Add the new locale to the `locales` array in `src/middleware.ts` and `src/i18n/routing.ts`.
    2.  Create a new translation file in `src/messages/` (e.g., `fr.json`).
    3.  Update language switching components if necessary.
*   **Adding New Dashboard Pages:**
    1.  Create new route segments under `src/app/[locale]/(dashboard)/`.
    2.  Ensure new routes are protected by the authentication middleware.
*   **Modifying UI Components:**
    -   Components in `src/components/ui/` are likely from Shadcn/ui. Refer to their documentation for customization.
    -   Custom application components are in `src/components/`.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Ensure your production environment has all the necessary environment variables set (similar to `.env.local` but with production values).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Troubleshooting

*   **Authentication Issues:**
    *   Verify `NEXTAUTH_SECRET` is set and is a strong, unique string.
    *   Ensure `NEXTAUTH_URL` is correctly set for your environment (e.g., `http://localhost:3000` for development).
    *   Check the backend API (`API_URL`) to ensure it's running and accessible.
*   **Language/Routing Issues:**
    *   Ensure locales are correctly defined in `src/middleware.ts` and `src/i18n/routing.ts`.
    *   Verify that translation files exist in `src/messages/` for all configured locales.
*   **Build Errors:**
    *   Check for TypeScript errors in your components and pages.
    *   Ensure all dependencies are correctly installed.

## Contributing

We welcome contributions to the Light Street Control Panel! Please follow these guidelines:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `bugfix/your-bug-fix-name`.
3.  **Make your changes.** Ensure your code follows the project's coding style and conventions.
4.  **Write tests** for your changes if applicable.
5.  **Commit your changes** with clear and descriptive commit messages.
6.  **Push your branch** to your fork: `git push origin feature/your-feature-name`.
7.  **Open a pull request** to the main repository.

(A more detailed `CONTRIBUTING.md` will be added to outline coding conventions and testing procedures.)

## License

This project is currently proprietary. Please contact the project maintainers for licensing information. (You can update this section if you choose to use an open-source license like MIT, Apache 2.0, etc.)

---

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
