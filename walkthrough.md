# Student Assignment Tracker - Walkthrough

The Full Stack MERN application for the Student Assignment Tracker has been successfully implemented based on your PRD and the provided UI designs.

## Accomplished Modules

### 1. Backend API (`/server`)
- **Node.js & Express API:** Established a clean MVC structure with `models`, `routes`, `controllers`, and `middleware`.
- **Authentication:** Built Registration and Login using JWT and bcrypt password hashing.
- **Assignment Logic:** Full CRUD APIs for managing assignments, including the business logic for automatically flagging tasks as `Overdue` when their due date passes.
- **Dashboard Aggregation:** Wrote aggregation logic to serve statistics such as `Total`, `Pending`, `Completed`, `Overdue`, and completion progress percentage.

### 2. Frontend React Application (`/client`)
- **Tailwind Integration:** Configured Tailwind CSS using the exact design system values found in your HTML files (colors, typography, grid).
- **Authentication Flow:** Implemented an `AuthContext` to manage the user's login state seamlessly across the app using `localStorage`.
- **UI Translation:** 
  - Converted the `login` and `register` HTML screens into robust React components.
  - Translated the `dashboard` UI, binding it dynamically to the backend API stats endpoint.
  - Translated the `assignments` page, including functional table rendering, a search bar, status filtering, and a modal for creating new tasks.

---

> [!IMPORTANT]
> ## How to Setup & Run the Application

You requested the steps to set up the MongoDB database manually and run the project at the end. Please follow these exact steps:

### Step 1: Set up MongoDB
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (with a username and password) and allow access from all IP addresses (`0.0.0.0/0`).
3. Click "Connect", select "Drivers", and copy your connection string (it looks like `mongodb+srv://<username>:<password>@cluster0...`).

### Step 2: Configure the Backend
1. Open the `.env` file located in your `server/` folder (`c:\Users\Hemanth\Downloads\Student_Assignment_Tracker\server\.env`).
2. Replace the `MONGO_URI` value with your actual MongoDB connection string:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=supersecretjwtkey_for_student_tracker
```

### Step 3: Start the Backend Server
Open a terminal in the root workspace and run:
```bash
cd server
npm install # Just in case anything was missed
npm start # or 'node index.js'
```
You should see `Server is running on port 5000` and `MongoDB Connected` in the terminal.

### Step 4: Start the Frontend Client
Open a second terminal window in the root workspace and run:
```bash
cd client
npm install
npm run dev
```
This will start the Vite dev server (usually on `http://localhost:5173`). Open that URL in your browser to view the application!
