# 🚀 CodeWithMonk — Frontend

**Your Personal DSA Practice & Coding Platform**

CodeWithMonk is a full-stack coding platform that helps developers practice Data Structures and Algorithms (DSA), write and execute code, track submissions, get AI-powered assistance, and connect with fellow coders.

The frontend is built with **React 19 and Vite**, providing an interactive coding workspace, Monaco Editor integration, an AI DSA tutor, community features, and an admin interface for managing coding problems.

> 🚧 **Project Status:** Core feature implementation is complete. Final admin dashboard debugging, validation, and deployment are pending.

---

## ✨ Features

### 🔐 1. Authentication & User Management

- 📝 User registration and login interfaces.
- 🚪 Logout integration with the backend.
- 🔄 Global user state management using Redux Toolkit.
- 🛡️ Role-aware navigation with admin-only interface elements.
- 👤 Profile page for authenticated users.
- 🔒 Protected operations enforced by backend authentication and authorization.

**Security Note:** Token validation, Redis-based token blacklisting, and access control are handled by the backend. Frontend visibility checks are for the user interface and do not replace backend authorization.

### 💻 2. Interactive DSA Coding Workspace

- 📚 View coding problem descriptions, examples, and requirements.
- ⌨️ Write and edit solutions using Monaco Editor.
- ▶️ Run code and view execution results.
- 🚀 Submit solutions for evaluation against configured test cases.
- 📜 View submission history for individual problems.
- 📊 Display execution status, submission feedback, and API responses.
- 🔧 Support for programming languages configured by the backend.

Code execution and evaluation are handled by the backend through its Judge0 integration.

### 🤖 3. AI-Powered DSA Tutor

- 💬 Ask questions related to coding problems.
- 🧠 Get DSA-focused hints and conceptual explanations.
- 📝 Receive code guidance and discuss time and space complexity.
- 🔗 Provide current problem context to the backend AI integration.

The Gemini integration runs on the backend, keeping provider credentials out of the frontend bundle.

> 💡 AI-generated answers may contain mistakes. Always verify suggestions against the problem requirements and test cases.

### 🌐 4. Community Feed & Connection Requests

- 👥 Discover other developers through the community feed.
- 📈 View coder profiles and problem-solving counts on feed cards.
- 🤝 Send connection requests to other users.
- ⏭️ Ignore profiles you don't want to connect with.
- 📥 View incoming pending connection requests.
- ✅ Accept or ❌ reject received requests.
- 🔗 View accepted connections.
- 🗑️ Remove actioned cards from the relevant lists.
- ⏳ Display loading indicators, empty states, and API error messages.

The feed follows backend filtering rules to exclude the signed-in user and users already associated with existing connection requests in either direction.

### 🛠️ 5. Admin Dashboard

Authorized administrators can manage coding problems through the frontend interface.

- ➕ Create new DSA problems.
- ✏️ Update existing problems.
- 🗑️ Delete coding problems.
- 📋 Manage problem content used by the coding workspace.

> ⚠️ Final admin workflow testing and validation are pending before deployment.

---

## 🧰 Tech Stack

| Category | Technologies |
|---|---|
| ⚛️ UI Library | React 19 |
| ⚡ Build Tool | Vite |
| 🧭 Routing | React Router |
| 🗃️ State Management | Redux Toolkit, React Redux |
| 🌐 HTTP Client | Axios |
| ⌨️ Code Editor | Monaco Editor, `@monaco-editor/react` |
| 🎨 Styling | Tailwind CSS, daisyUI |
| 🎯 Icons | Lucide React |
| 📝 Form Management | React Hook Form |
| ✅ Form Validation | Zod, Yup, Hook Form Resolvers |
| 🧹 Code Quality | ESLint, React Hooks and React Refresh plugins |

### 🔌 Companion Backend

The frontend communicates with a backend powered by:

- 🟢 **Node.js & Express.js** — API and server-side logic
- 🍃 **MongoDB** — Data persistence
- ⚡ **Redis** — Token blacklisting and supporting backend functionality
- 🧑‍⚖️ **Judge0** — Code execution and evaluation
- 🤖 **Google Gemini** — AI-powered DSA assistance

---

## 🔄 How It Works

1. 🖥️ React components render the coding workspace, community feed, profile, and admin interfaces.
2. 🗃️ Redux Toolkit manages shared user and application state.
3. 🌐 A shared Axios client sends API requests to the backend.
4. ⚙️ The backend handles authentication, authorization, database operations, code execution, and AI requests.
5. 📩 The frontend processes API responses and displays data, loading indicators, execution results, and errors.

---

## ⚙️ Getting Started

Follow these steps to run the frontend locally.

### 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — compatible with the project's Vite version
- npm
- Git
- The [CodeWithMonk backend](https://github.com/Manish-dev3490) or an accessible running backend instance

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Manish-dev3490/code-with-monk-web.git
cd code-with-monk-web
```

### 2️⃣ Install Dependencies

```bash
npm install
```

If the repository contains a committed `package-lock.json`, you can use `npm ci` for a clean installation with locked dependency versions.

### 3️⃣ Configure the Backend URL

Open the shared Axios client, typically located at:

```text
src/utils/axiosClient.js
```

Configure its `baseURL` to point to your running backend.

If the client uses a Vite environment variable, create a local `.env` file using the **exact variable name expected by the source code**.

Example only:

```env
VITE_API_BASE_URL=http://localhost:3000
```

> ⚠️ Replace the example URL and variable name with the values required by your actual Axios client configuration.

For cookie-based authentication, ensure that Axios credentials, backend CORS settings, cookie attributes, and the frontend origin are configured consistently.

**Security:** Never expose Gemini API keys, database credentials, Redis credentials, Judge0 secrets, or token-signing secrets through frontend environment variables.

### 4️⃣ Start the Development Server

```bash
npm run dev
```

Open the local URL printed in your terminal by Vite.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | ⚡ Start the Vite development server |
| `npm run build` | 📦 Build the production frontend into `dist/` |
| `npm run preview` | 🔍 Preview the production build locally |
| `npm run lint` | 🧹 Run ESLint checks |

> 🧪 An automated test script is not currently declared in the supplied `package.json`.

---

## 🧭 Main User Flows

1. 🔐 Register or log in to your account.
2. 📚 Browse DSA problems and review their descriptions.
3. ⌨️ Write your solution using the Monaco Editor.
4. ▶️ Run your code and inspect execution results.
5. 🚀 Submit your solution and review the submission history.
6. 🤖 Ask the AI tutor for problem-related assistance.
7. 🌐 Explore the community feed and send connection requests.
8. 📥 Accept or reject incoming requests.
9. 🔗 Open the connections page to view accepted connections.
10. 🛠️ As an authorized administrator, create, update, or delete coding problems.

---

## 🚀 Deployment

The frontend can be deployed to a static hosting provider such as [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/).

### Deployment Steps

1. 🌐 Configure the Axios client to use the deployed backend URL.
2. 🔐 Set the required frontend environment variables in the hosting dashboard.
3. 📦 Generate the production build:

   ```bash
   npm run build
   ```

4. 🚀 Deploy the generated `dist/` directory.
5. 🧭 Configure SPA fallback or rewrite rules so direct visits to routes such as `/feed` and `/connections` serve `index.html`.
6. 🔒 Allow the deployed frontend origin in the backend CORS configuration.
7. 🍪 Verify cookie-based authentication and protected routes in the deployed environment.
8. ✅ Test the main user flows against the deployed frontend and backend.

---

## ✅ Pre-Release Checklist

Before declaring the frontend production-ready, verify the following:

- [ ] 🛠️ Complete admin dashboard debugging.
- [ ] ➕ Test problem creation, updates, and deletion.
- [ ] 🔒 Verify that regular users cannot directly invoke admin operations.
- [ ] 🧹 Run `npm run lint` and resolve failures.
- [ ] 📦 Run `npm run build` and resolve build errors.
- [ ] 🔐 Test login, registration, logout, refresh, and protected-page behavior.
- [ ] 💻 Verify code execution and submission results.
- [ ] 📜 Verify problem-specific submission history.
- [ ] 🤖 Test AI chatbot loading, successful responses, and API failures.
- [ ] 👥 Test feed and connection workflows using two separate accounts.
- [ ] 📭 Verify empty states and failed API requests.
- [ ] ⏳ Check button behavior during pending requests.
- [ ] 📱 Test responsive layouts on mobile and desktop.
- [ ] 🌐 Repeat the main workflows against the deployed environment.

---

## 🎯 Project Goals

CodeWithMonk brings several important developer workflows into one platform:

- 📚 Practice Data Structures and Algorithms.
- 💻 Write, run, and submit code.
- 🤖 Get AI-assisted problem-solving guidance.
- 👥 Build connections with other developers.
- 🛠️ Manage coding problems through an administrative interface.

The project demonstrates practical frontend development with React, state management, API integration, interactive code editing, authentication flows, and integration with backend-powered services.

---

## 👨‍💻 Author

**Manish Kumar**

- 🐙 GitHub: [Manish-dev3490](https://github.com/Manish-dev3490)

---

⭐ **If you find CodeWithMonk useful, consider giving the repository a star!**

*Built to make DSA practice more interactive, accessible, and community-driven.* 🚀