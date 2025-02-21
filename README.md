# TaskFlow [Live Link](https://taskflow-tms.web.app)

## Description
This is a Task Management Application that allows users to manage their tasks with features like adding, editing, deleting, and reordering tasks through a drag-and-drop interface. Tasks are categorized into "To-Do", "In Progress", and "Done". Changes are saved instantly to the database for persistence. The application is designed to be clean, minimalistic, and fully responsive, ensuring a seamless experience on both desktop and mobile devices.

## Features

- **Authentication:** 
  - Google sign-in via Firebase Authentication.
  - User details are saved to the database on the first login.

- **Task Management:**
  - Add, edit, delete, and reorder tasks.
  - Categorize tasks into "To-Do", "In Progress", and "Done".
  - Drag and drop tasks between categories and reorder them within a category.
  - Tasks have a title, description (optional), timestamp (auto-generated), and category.

- **Database & Persistence:**
  - MongoDB used for storing tasks.
  - Real-time task updates using WebSockets or MongoDB Change Streams.
  - Task deletions are permanently removed from the database.

- **Frontend UI:**
  - Built with React and Vite.js.
  - Drag-and-drop functionality powered by `react-beautiful-dnd` or similar libraries.
  - Modern, clean, and responsive UI with a maximum of four colors.

- **Backend API:**
  - CRUD operations for tasks via an Express.js API.
  - Endpoints include:
    - `POST /tasks` – Add a new task
    - `GET /tasks` – Retrieve all tasks for the logged-in user
    - `PUT /tasks/:id` – Update task details (title, description, category)
    - `DELETE /tasks/:id` – Delete a task

- **Responsiveness:**
  - Mobile-friendly drag-and-drop experience.
  - Fully responsive UI for both desktop and mobile devices.

## Technologies Used
- **Frontend:**
  - React.js
  - Vite.js
  - react-beautiful-dnd (or similar library)
  - Firebase Authentication
  - Tailwind CSS (or custom styling)

- **Backend:**
  - Express.js
  - MongoDB
  - WebSockets / MongoDB Change Streams

- **Additional Libraries/Tools:**
  - dotenv (for managing environment variables)
  - Axios (for API requests)

## Setup Instructions

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)
- Firebase project with Authentication set up

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/shafriki/TaskFlow-client-side.git
