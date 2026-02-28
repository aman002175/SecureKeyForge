# Hardcore Password Generator

A modern web-based password generator built by Aman Bishnoi that creates secure, memorable passwords using word-based algorithms with comprehensive storage and management capabilities.

## Features

- **Word-Based Password Generation**: Uses phonetic alphabet words combined with numbers and special characters
- **Secure Authentication**: Replit OAuth integration for user login
- **Master Password Protection**: Additional security layer for accessing saved passwords
- **Password Storage**: Securely store and manage generated passwords
- **Password History**: View, copy, and delete previously generated passwords
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Password Strength**: Visual feedback on password security

## Technologies Used

### Frontend
- **TypeScript** - Type-safe development
- **React** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **TanStack Query** - Data fetching and state management
- **React Hook Form** - Form handling with validation
- **Wouter** - Lightweight routing
- **Zod** - Schema validation

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe server development
- **Passport.js** - Authentication middleware
- **OpenID Connect** - Authentication protocol
- **bcrypt** - Password hashing
- **Express Session** - Session management

### Database
- **PostgreSQL** - Primary database
- **Drizzle ORM** - Type-safe database operations
- **Neon Database** - Serverless PostgreSQL hosting

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hardcore-password-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   REPL_ID=your_replit_app_id
   REPLIT_DOMAINS=your_replit_domains
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Usage

1. **Sign In**: Use the Replit authentication system to log in
2. **Set Master Password**: Create a master password to protect your saved passwords
3. **Generate Passwords**: 
   - Enter service details (app/website, username, email)
   - Configure password options (length, special characters, numbers)
   - Generate secure passwords
4. **Save & Manage**: Store passwords securely and manage your password history

## Security Features

- **Master Password Protection**: All saved passwords require master password verification
- **User Isolation**: Each user's data is completely isolated
- **Password Hashing**: Master passwords are hashed using bcrypt
- **Session Management**: Secure session handling with PostgreSQL storage
- **Authentication**: OAuth-based login with Replit

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout user
- `POST /api/auth/master-password/setup` - Setup master password
- `POST /api/auth/master-password/verify` - Verify master password
- `GET /api/auth/master-password/status` - Check master password status

### Password Management
- `GET /api/password-entries` - Get user's password entries
- `POST /api/password-entries` - Create new password entry
- `DELETE /api/password-entries/:id` - Delete password entry
- `DELETE /api/password-entries` - Clear all password entries

## Database Schema

### Users Table
- `id` - Unique user identifier
- `email` - User email
- `firstName` - User's first name
- `lastName` - User's last name
- `profileImageUrl` - Profile image URL
- `masterPassword` - Hashed master password
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Password Entries Table
- `id` - Entry identifier
- `userId` - Reference to user
- `service` - Service/website name
- `username` - Username for the service
- `email` - Email for the service
- `password` - Generated password
- `createdAt` - Entry creation timestamp

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Page components
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── replitAuth.ts     # Authentication logic
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Database operations
│   └── types.ts          # Type definitions
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── package.json          # Dependencies and scripts
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created by Aman Bishnoi.

## Support

For support or questions, please contact the developer.