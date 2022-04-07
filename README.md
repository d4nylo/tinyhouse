# TinyHouse 🏠

A Full-stack Typescript React & GraphQL application.

This app was made by following the [TinyHouse: A Fullstack React Masterclass with TypeScript and GraphQL](https://www.newline.co/tinyhouse).

You can check the app here: https://tinyhouse-dk.herokuapp.com

![App Screenshot](https://res.cloudinary.com/d4nylo/image/upload/v1647276795/tinyhouse/tinyhouse-app_tpmapb.png)

---

## Features

Here is a summary of all the main features of the TinyHouse application. A user will be able to:

- Sign-in with their Google account information.
- Search for listings in various different locations in the world.
- See specific details about listings.
- Book listings for a period of time.
- Connect their Stripe account to be allowed to create listings (i.e. be a host in TinyHouse) and receive payments from other users.
- Create (i.e. host) listings of their own.
- See a history of the listings they've created, the bookings they've made, and the bookings made to their own listings.
- See a history of listings created by other users.

---

## Run Locally

Clone the project

```bash
  git clone https://github.com/d4nylo/tinyhouse.git
```

Go to the project directory

```bash
  cd tinyhouse
```

## Client

### Environment Variables

To run the client, you will need to add the following environment variables to your `.env` file at the root of the `/client` directory.

```
# Stripe
REACT_APP_S_CLIENT_ID
REACT_APP_S_PUBLISHABLE_KEY
```

Go to the client directory

```bash
  cd client
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

---

## Server

### Environment Variables

To run the server, you will need to add the following environment variables to your `.env` file at the root of the `/server` directory.

```
# General
PORT
SECRET
PUBLIC_URL
NODE_END

# MongoDB
DB_USER
DB_USER_PASSWORD
DB_CLUSTER

# Google
G_CLIENT_ID
G_CLIENT_SECRET
G_GEOCODE_KEY

# Stripe
S_CLIENT_ID
S_SECRET_KEY

# Cloudinary
CLOUDINARY_NAME
CLOUDINARY_KEY
CLOUDINARY_SECRET
```

Go to the server directory

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

---

## This file is under construction 👷‍♂️ 🏗 🚜 🚧

![Under Construction](https://c.tenor.com/FtGd7MNyIqkAAAAd/construction-crane.gif)
