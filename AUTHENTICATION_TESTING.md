# Authentication Implementation - Testing Instructions

## Overview

Authentication has been successfully implemented for the Phase II Todo App. The app now requires users to sign up or log in before accessing the todo functionality.

## What Was Implemented

### Backend Changes

1. **User Model** (`backend/src/models/user.py`)
   - User entity with email, hashed_password, and created_at fields
   - UserCreate, UserLogin, and UserRead schemas

2. **Password Hashing** (`backend/src/utils/password.py`)
   - Secure password hashing using passlib with bcrypt
   - Password verification functions

3. **Auth Service** (`backend/src/services/auth_service.py`)
   - `signup()` - Create new user accounts
   - `login()` - Authenticate existing users
   - Email uniqueness validation
   - Password verification

4. **Auth API Endpoints** (`backend/src/api/auth.py`)
   - `POST /api/v1/auth/signup` - User registration
   - `POST /api/v1/auth/login` - User authentication

5. **Database Migration**
   - Users table with email (unique), hashed_password, and timestamps
   - Index on email for fast lookups

### Frontend Changes

1. **User Types** (`frontend/src/types/user.ts`)
   - User, UserCreate, UserLogin interfaces

2. **Auth API Client** (`frontend/src/services/authApi.ts`)
   - signup() and login() functions
   - localStorage management for user session
   - isAuthenticated() helper

3. **Auth Page Component** (`frontend/src/components/AuthPage.tsx`)
   - Signup/Login form with toggle
   - Email and password validation
   - Error and success states
   - Responsive design

4. **Route Protection**
   - Root route (`/`) shows auth page
   - Todos route (`/todos`) requires authentication
   - Auto-redirect based on auth status
   - Logout functionality

## How to Test

### 1. Start the Backend Server

```bash
cd backend
python -m uvicorn src.main:app --reload --port 8000
```

The backend should start on `http://localhost:8000`

### 2. Start the Frontend Server

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:3000`

### 3. Test Signup Flow

1. Open `http://localhost:3000` in your browser
2. You should see the **Sign Up / Log In** page (not the todo list)
3. Click "Don't have an account? Sign up" if not already on signup
4. Enter:
   - Email: `test@example.com`
   - Password: `password123` (at least 6 characters)
   - Confirm Password: `password123`
5. Click "Sign Up"
6. You should see "Account created successfully! Redirecting..."
7. You should be automatically redirected to `/todos`
8. You should see your email in the top right with a "Logout" button

### 4. Test Todo Functionality

1. After logging in, you should see the full todo app interface
2. Create, edit, delete, and toggle todos as before
3. All existing todo functionality should work normally

### 5. Test Logout

1. Click the "Logout" button in the top right
2. You should be redirected back to the auth page (`/`)
3. You should no longer be able to access `/todos` directly

### 6. Test Login Flow

1. On the auth page, click "Already have an account? Log in"
2. Enter the same credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Log In"
4. You should see "Login successful! Redirecting..."
5. You should be redirected to `/todos` with your todos intact

### 7. Test Validation

**Email Validation:**
- Try invalid email formats (e.g., `notanemail`)
- Should show "Please enter a valid email address"

**Password Length:**
- Try password less than 6 characters
- Should show "Password must be at least 6 characters long"

**Password Confirmation:**
- On signup, enter different passwords
- Should show "Passwords do not match"

**Duplicate Email:**
- Try signing up with an email that already exists
- Should show "Email already registered"

**Invalid Credentials:**
- Try logging in with wrong password
- Should show "Invalid email or password"

### 8. Test Route Protection

1. Log out if logged in
2. Try to access `http://localhost:3000/todos` directly
3. You should be automatically redirected to `/` (auth page)
4. Log in
5. Try to access `http://localhost:3000/` (root)
6. You should be automatically redirected to `/todos`

## API Endpoints

### Auth Endpoints

**Signup:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

## Technical Notes

- **Session Management**: Uses localStorage (simple approach for Phase II)
- **Password Security**: Passwords are hashed with bcrypt before storage
- **No JWT**: Simple success/failure responses (hackathon-safe)
- **Single User Per Browser**: localStorage-based auth
- **Database**: Users table created via SQLModel (SQLite for local dev)

## Known Limitations (By Design)

- No JWT tokens or refresh tokens
- No password reset functionality
- No email verification
- No OAuth or social login
- No role-based access control
- Session persists in localStorage only (cleared on logout or browser data clear)

## Troubleshooting

**Backend won't start:**
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check that port 8000 is not in use

**Frontend won't start:**
- Ensure dependencies are installed: `npm install`
- Check that port 3000 is not in use

**Can't sign up:**
- Check backend console for errors
- Verify backend is running on port 8000
- Check browser console for network errors

**Can't log in:**
- Verify you signed up first
- Check that email and password match exactly
- Passwords are case-sensitive

**Redirects not working:**
- Clear browser localStorage: `localStorage.clear()` in browser console
- Refresh the page

## Success Criteria

✅ App opens on Signup/Login page (not todo list)
✅ Users can sign up with email and password
✅ Users can log in with existing credentials
✅ Unauthenticated users cannot access /todos
✅ Authenticated users are redirected from / to /todos
✅ Logout clears session and redirects to auth page
✅ All existing todo functionality works after authentication
✅ Email uniqueness is enforced
✅ Passwords are securely hashed
✅ Client-side validation provides immediate feedback

## Next Steps (Optional Enhancements)

- Add JWT tokens for stateless authentication
- Implement password reset via email
- Add "Remember Me" functionality
- Add session expiration
- Implement refresh tokens
- Add user profile management
- Add multi-device session management
