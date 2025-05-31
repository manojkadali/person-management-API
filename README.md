# Node + MongoDB Backend API – People Management System

This is a backend API built using **Node.js**, **Express.js**, and **MongoDB** that allows users to perform CRUD (Create, Read, Update, Delete) operations on a "People" collection. The application is structured with modular routing, Mongoose for data modeling, and environment-based configuration.

---

## Features

- **Create** a new person (name, email, profession, etc.)
- **Read** all people or a specific person by ID
- **Update** an existing person’s details
- **Delete** a person by ID
- RESTful API design
- MongoDB as the database with Mongoose ODM
- CORS and JSON body parsing middleware
- Supports future frontend integration (e.g., Angular or React)

---

## 📁 Project Structure
```
project-root/
├── routes/
│ └── personRoutes.js # API route handlers
│
├── models/
│ └── personModel.js # Mongoose schema for Person
│
├── public/
│ └── index.html # Placeholder for frontend (optional)
│
├── .env # Environment variables (port, DB URI)
├── server.js # Main server file
├── package.json # Project metadata and scripts
```


## Architecture Overview

- **Express.js** handles routing and middleware
- **Mongoose** models define data structure and interact with MongoDB
- **Dotenv** manages sensitive configs via `.env` file
- **CORS** enables cross-origin API access
- **Public folder** serves static files and the index page
- Modular architecture for easy scaling and maintenance

---

## Getting Started (Local Setup)

### Clone the Repository or download the zip file
```
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```
### Install dependencies and create .env to configure MongoDB database in compass
```
npm install

Create a .env file in the root directory:- Make sure MongoDB is running locally and the Node_MongoDB database exists or will be created.

PORT=3000
MONGODB_URI=mongodb://localhost:27017/Node_MongoDB
```

### start the server
```
npx nodemon server.js

You should see:
Connected to MongoDB
Server running on port 3000
```

## API Endpoints => Base URL: http://localhost:3000/api/person
```
Method	 Endpoint  Description
GET	   /	    Get all people
GET      /:id	  Get a person by ID
POST	   /	    Add a new person
PUT	   /:id	  Update person by ID
DELETE	 /:id	  Delete person by ID
```
