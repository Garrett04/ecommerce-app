# E-Commerce API

> The backend API for an E-Commerce Web App built using Node.js, Express and Postgres.

## Table of contents
* [General Information](#general-information)

* [Features](#features)

* [Technologies Used](#technologies-used)

* [Setup](#setup)

* [Usage](#usage)

* [Project Status](#project-status)

* [Room for Improvement](#room-for-improvement)


## ERD Diagram:


## General Information:
- Build a functioning e-commerce REST API using Express, Node.js, and Postgres
- Allow users to register and log in via the API
- Allow CRUD operations on products
- Allow CRUD operations on user accounts
- Allow CRUD operations on user carts
- Allow a user to place an order
- Allow CRUD operations on orders
- Use Git version control
- Use command line
- Develop locally on your computer
- Document the API using Swagger

## Features
Coming soon…

## Technologies Used:
### Server
- `node.js` 
- `npm`
- `express`
- `express-session`
- `jsonwebtoken`
- `nodemon`
- `cors`
- `passport-jwt`

### Database
- `psql` (PostgreSQL CLI)
- `connect-pg-simple`
- `pg` (node-postgres)

### Documentation
- `swagger-jsdoc`
- `swagger-ui-express`

## Setup
To set up locally, begin by installing node_modules:

```
npm install
```

This command will also execute the `install` script from `package.json`.

Open a PostgreSQL database of your choice. Schema with tables is located in `db/init.sql`. E.g., generate tables by running:

```
cd db
cat init.sql | psql -h [PGHOST] -U [PGUSER] -d [PGDATABASE] -w [PGPASSWORD]
```

Replace 'PGHOST', 'PGUSER', 'PGDATABASE', and 'PGPASSWORD' with your PostgreSQL host, user, database, and password values, respectively.

Add the following fields with respective values to the `.env` file:
  
```
# Postgres Database
PGHOST=
PGUSER=
PGDATABASE=
PGPASSWORD=
PGPORT=
  
# Express server
SECRET=

# Node.js
NODE_ENV=
```

Then run the app which is located in `app/` directory:

```
node app.js
```

## Usage
This project serves as a backend for an e-commerce website.
It manages multiple endpoints crucial for online shopping, such as:
- creating user accounts
- users can save addresses to account
- displaying products and allowing query by parameter
- creating carts, and consolidating carts when a user logs in

## Project Status
In Progress: 
- Engaged in testing procedures.
- Integration of Stripe payment functionality.

## Room for Improvement
Room for improvement:
- Enhance JWT Authentication Configuration
- Strengthen Database Table Constraints
- Better API documentation

To-Do:
- Incorporate a new payments table for managing payment method of the user.

## Project Takeaways
- To learn JWT Authentication
- To learn more on API documentation
- Better ways of error handling
