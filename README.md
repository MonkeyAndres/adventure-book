# AdventureBook

Diary-like app that allows you to document your adventures and search between them.

This repo contains 2 components:
- [Frontend](./frontend/): ReactJS application that represents the view of our app
- [Backend](./backend/): ExpressJS API which allows the frontend to access and mutate data from the database

Apart from that you'll need to have a Postgres DB running in your machine.

## Requirements

- PostgresDB running on your machine
- NodeJS >= v16.7.0
- Yarn

## Setup

```bash
# Install dependencies
yarn install

# Set up backend's .env variables
cp ./backend/.env.example ./backend/.env
# After this you'll have to edit the DATABASE_URL variable to match your config

# Run database migrations (inside `backend` folder)
yarn prisma migrate dev

# Start backend (inside project root directory)
yarn backend

# Start frontend (inside project root directory)
yarn frontend

# Now you must have access to the website at http://localhost:3000

```

## Available commands

Root directory
- `yarn backend`: Starts the backend
- `yarn frontend`: Starts the frontend
- `yarn format`: Formats every file using prettier

Backend directory
- `yarn dev`: Starts backend in dev mode (restarts every time a file changes)
- `yarn start`: Starts backend in normal mode

Frontend directory
- `yarn start`: Starts frontend app
- `yarn build`: Builds React application
