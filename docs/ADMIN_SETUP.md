# Admin Panel Setup Guide

## Environment Variables

Add these to your `.env` file:

```bash
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password-here"
ADMIN_SESSION_SECRET="random-32-char-secret-key"
```

## Generate Session Secret

```bash
openssl rand -hex 32
```

## Access Admin Panel

1. Navigate to `https://audit.alirezasafaeisystems.ir/admin/login`
2. Enter username and password
3. Access dashboard at `/admin`

## Features

- View total audits, orders, and pending orders
- See recent audit runs
- Session-based authentication
- Automatic redirect if not authenticated

## Security Notes

- Sessions expire after 24 hours
- Cookies are httpOnly and secure in production
- Password must be set in environment variables
- No default password for security

## API Endpoints

- `POST /api/admin/auth/login` - Login with credentials
- `POST /api/admin/auth/logout` - Clear session
- `GET /api/admin/stats` - Get dashboard stats (requires auth)
