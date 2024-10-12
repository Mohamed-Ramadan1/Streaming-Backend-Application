# Movies-Backend-Application
Movies application


## Project Structure
├── DB/                             # Database-related files (SQL scripts, schema diagrams)
│   ├── content_ratings.sql         # SQL script for content ratings table
│   └── users.sql                   # SQL script for users table
├── diagrams/                       # Project and database schema diagrams
├── docs/                           # Project documentation
├── migrations/                     # Database migration files
├── src/                            # Main source code
│   ├── config/                     # Configuration files (e.g., database, environment)
│   ├── controllers/                # Express route controllers
│   ├── emails/                     # Email templates and services
│   ├── interfaces/                 # TypeScript interfaces for type safety
│   ├── jobs/                       # Cron jobs and scheduled tasks
│   ├── logging/                    # Logging setup and utilities
│   ├── middlewares/                # Express middlewares
│   ├── models/                     # Database models (using ORM or raw SQL)
│   ├── public/                     # Public static files (images, styles, etc.)
│   ├── routes/                     # API route definitions
│   ├── services/                   # Business logic and services
│   ├── types/                      # Additional TypeScript types
│   └── utils/                      # Utility functions and helpers
├── tests/                          # Test files (unit, integration, etc.)
├── .dockerignore                   # Docker ignore file
├── .env                            # Environment variables file (not committed to version control)
├── .gitattributes                  # Git attributes for consistent handling of files
├── .gitignore                      # Specifies files and directories to ignore in Git
├── docker-compose.yml              # Docker Compose configuration for local development
├── Dockerfile                      # Dockerfile for containerizing the app
├── package-lock.json               # Lock file for exact versions of Node.js dependencies
├── package.json                    # Node.js dependencies and scripts
├── README.md                       # Project documentation (this file)
├── TODO.ts                         # Task list and future improvements
├── tsconfig.json                   # TypeScript configuration file
└── app.ts                          # Main entry point of the application
