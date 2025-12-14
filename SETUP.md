# Session Hijacking Project - Setup Guide

This guide will help you set up the project locally to run perfectly.

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (or any PostgreSQL database)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL=your_neon_database_connection_string

# JWT Secret Key (generate a random secure string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Example DATABASE_URL format:
# postgresql://username:password@hostname:port/database?sslmode=require
```

### Getting a Neon Database:

1. Go to [Neon](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it as `DATABASE_URL` in your `.env.local` file

### Generating JWT Secret:

You can generate a random secret using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use any secure random string generator.

## Step 3: Database Schema

The database schema will be automatically created when you first run the application. The `lib/db.ts` file will create two tables:

1. **users** - Stores user information (id, name, email, password, created_at)
2. **sessionkeys** - Stores session information with fingerprinting (id, user_id, authToken_hash, fingerprint, created_at)

## Step 4: Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 5: Test the Application

1. **Sign Up**: Go to `/signup` and create a new account
2. **Login**: Go to `/login` and sign in with your credentials
3. **Dashboard**: After login, you'll be redirected to `/dashboard` where you can see:
   - Your email
   - Your user ID
   - Session hijacking protection information

## Features

### Session Hijacking Protection

This project demonstrates session hijacking protection using:

1. **Browser Fingerprinting**: Uses FingerprintJS to create a unique browser fingerprint
2. **Session Verification**: Each session is tied to a specific browser fingerprint
3. **Hijacking Detection**: If a session is accessed from a different browser/device, it's detected and the user is logged out

### How It Works

1. When a user logs in, their browser fingerprint is captured and stored with their session
2. On each request, the current browser fingerprint is compared with the stored fingerprint
3. If they don't match, session hijacking is detected and the user is logged out

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts      # Login endpoint
│   │   │   ├── logout/route.ts     # Logout endpoint
│   │   │   └── signup/route.ts     # Signup endpoint
│   │   └── verify-session/route.ts # Session verification
│   ├── dashboard/page.tsx           # Protected dashboard
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── page.tsx                    # Landing page
├── components/
│   ├── ui/
│   │   ├── GlassSurface.tsx        # Glass morphism component
│   │   └── Squares.tsx             # Animated background
│   └── ErrorAlert.tsx              # Error alert component
├── lib/
│   ├── db.ts                       # Database connection & schema
│   └── utils.ts                     # Utility functions
└── middleware.ts                    # Auth middleware

```

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Neon Database** - Serverless PostgreSQL
- **FingerprintJS** - Browser fingerprinting
- **Jose** - JWT token handling
- **bcryptjs** - Password hashing
- **Tailwind CSS** - Styling
- **Radix UI** - UI components

## Troubleshooting

### Database Connection Issues

- Make sure your `DATABASE_URL` is correct
- Ensure your database allows connections from your IP
- Check if SSL mode is required (add `?sslmode=require` to connection string)

### JWT Secret Issues

- Make sure `JWT_SECRET` is set in `.env.local`
- Use a long, random string for security

### Build Errors

- Delete `node_modules` and `.next` folder
- Run `npm install` again
- Run `npm run dev`

## Security Notes

- Never commit your `.env.local` file
- Use strong, unique JWT secrets in production
- Keep your database credentials secure
- The fingerprinting helps prevent session hijacking but isn't foolproof

## Dashboard Information

The dashboard shows:
- User email address
- User ID
- Session status
- Logout functionality

The dashboard is protected and requires a valid session with matching browser fingerprint.

