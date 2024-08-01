
# CodeCrafter: Where Collaboration, Coding, and Creativity Converge

CodeCrafter is an innovative platform designed to bring together real-time collaboration, coding, and creativity. Users can **chat in real time, write code in their favorite language, and sketch ideas using multiple tools.** This app is perfect for teams and individuals looking to enhance their interactive experience while working on projects together.

## Features

- **Real-Time Collaboration on Code Editing**: Users can edit code together in real time, making it easy to collaborate on coding projects.
- **Download Codebase as ZIP**: Users can download the entire codebase as a zip file for easy sharing and backup.
- **Unique Room Generation**: Each collaboration session generates a unique room, ensuring privacy and organization.
- **Auto-Language Detection**: The app automatically detects the programming language being used, streamlining the coding process.
- **Execute Code Directly**: Users can execute the code directly within the collaboration environment, testing and debugging on the fly.
- **User Notifications**: Notifications are sent for user join and leave events, keeping everyone informed of changes in the collaboration environment.
- **Real-Time Communication**: Users can chat in real time while working on code, facilitating easy communication and collaboration.
- **Collaborative Drawing and Sketching**: Draw and sketch collaboratively in real time, enhancing the interactive experience of your project.

## Deployment

- **Backend**: Hosted on Render.
- **Frontend**: Hosted on Vercel.
- **Scalability**: The backend can be moved to Amazon Web Services (AWS), Google Cloud Platform (GCP), or Cloudflare for better scalability. However, the current setup is suitable for smaller sets of users.

## Setup Instructions

### Clone the Repository

```sh
git clone https://github.com/tejanshsachdeva/CodeCrafter.git
```

### Setting Up the Backend

1. Navigate to the server directory:
   ```sh
   cd CodeCrafter/server
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Setting Up the Frontend

1. Navigate to the client directory:
   ```sh
   cd ../client
   ```
2. Install the dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

### Accessing the App

- **Frontend**: The frontend will be running on `http://localhost:5173`.
- **Backend**: The backend will be running on `http://localhost:3000`.

### External Resources Used

* **tldraw** : A powerful tool for collaborative drawing and sketching, enhancing the interactive experience of your projects.
* **socket.io-client** : Enables real-time, bidirectional communication between web clients and servers, essential for the app’s real-time collaboration features.
* **codemirror** : A versatile code editor implemented in JavaScript for the browser, supporting various programming languages and editing features.
* **jszip** : A JavaScript library for creating, reading, and editing .zip files, used for downloading the codebase as a zip file.
* **file-saver** : A library used to save files on the client-side, making it easy to download the entire codebase.

---
