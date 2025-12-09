# cookAID

## Project Overview

cookAID is a web app that helps users plan and manage meals by providing recipes and shopping lists.

## Features

- User authentication (login, signup)
- Recipe search and management
- Meal planning and shopping list creation

## Technology Stack

- Next.js
- React
- Next-Auth for authentication
- Vercel

## Installation

1. Clone the repository: `git clone https://github.com/TheRikej/AI-cooking-utils.git`
2. Install dependencies: `npm install`
3. Run database: `turso dev --db-file dev.db`
4. Run drizzle migration: `npm run drizzle:push`
4. Seed the database : `npm run seed`
5. Run the development server: `npm run dev`


## DB Connection
If you want to run the DB locally, put the following lines into .env file in the root of this project.
   `TURSO_DATABASE_URL= http://127.0.0.1:8080` \
   `AUTH_TOKEN="randomtokens"`
If you want to run the DB from cloud, replace the values by the ones provided by Turso

## GitHub auth
This app uses github for authentication. Provide the following fields into .env file:

   `AUTH_GITHUB_ID=your_id`\
   `AUTH_GITHUB_SECRET=your_secret`

## AI features

To be able to benefit from the AI features, add
`HUGGINGFACE_API_KEY=your_key` to your .env file.
You can get your api key on https://huggingface.co/
