# TabT REST API

A modern REST API service built with NestJS that provides a clean interface to interact with the TabT (Table Tennis Belgium) SOAP services.

## Features

- **Divisions**: Access and manage division information
- **Tournaments**: Retrieve tournament data and registrations
- **Members**: Member management and Head2Head statistics
- **Matches**: Match information and ranking systems
- **Club Categories**: Club-related data management

## Tech Stack

- NestJS - Progressive Node.js framework
- Prisma - Database ORM
- Supabase - Database and authentication
- TypeScript - Type-safe development
- SOAP Client Integration - For TabT services

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Database (configured with Supabase)

### Installation

1. Clone the repository
```bash
git clone [repository-url]
cd tabt-rest
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration settings.

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Documentation

The API endpoints are organized into the following categories:

- `/api/divisions` - Division management
- `/api/tournaments` - Tournament operations
- `/api/members` - Member information and statistics
- `/api/matches` - Match data and rankings

Detailed API documentation is available at `/api-docs` when running the server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

