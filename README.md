# Local Library Project

This project is aimed at building a simple library management system using Node.js, Express, and MongoDB.

## Features

- Allows users to view, add, update, and delete books, authors, genres and copies of books.
- User authentication for all operations related to creation, updation and deletion.
- Session management.

## Getting Started

### Method 1: Using git

1. Clone the repository.
   ```bash
   git clone https://github.com/anakinsonone/local-library.git
   ```
2. Install dependencies with `npm install`.
3. Set up a MongoDB database and update the configuration in `.env`.
4. You can also specify a port in the same `.env`.
5. Specify your mongodb url against the `DATABASE_URL` env variable.
6. Create a session secret. You can use `openssl rand -base64 32`
7. Run the application with `npm start`.
8. Access the application at `http://localhost:<port_number>` (default: 3000).

### Method 2: Using docker

1. Pull the docker image using

   ```bash
   docker pull anakinsonone/locallibrary:latest
   ```

2. Run the image using

   ```bash
   docker run --name local_library -d -p 8080:3000 anakinsonone/locallibrary:latest
   ```

   This command will do the following things:

   - `--name` - This assigns the name "local_library" to the container.
   - `-d` - This runs the container in detached mode (as a background process).
   - `-p 8080:3000` - This maps port 3000 from inside the container to port 8080 on the host machine.
     This means you can access the application by going to `localhost:8080` in your web browser.

## Dependencies

- [Node.js](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Express](https://expressjs.com/en/starter/installing.html)
- [MongoDB](https://www.mongodb.com/)
- [Pug (a template engine)](https://pugjs.org/api/getting-started.html)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [express-session](https://www.npmjs.com/package/express-session)

## Live Deployment

The project has been deployed on [Render.com](https://render.com/).
Click [here](https://mdn-local-libraryl.onrender.com) to view the project live.
