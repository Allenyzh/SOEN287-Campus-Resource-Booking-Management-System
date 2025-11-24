# Frontend-Backend Integration Guide

## Overview

The frontend has been successfully connected to the backend API. This document outlines the integration points and how data flows between the frontend and backend.

## Authentication Flow

### 1. AuthStore (`src/stores/authStore.ts`)

The authentication store manages user state and authentication operations:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
}

// Methods:
- login(email, password): Authenticates user via POST /api/auth/login
- register(name, email, password): Creates account via POST /api/auth/register
- logout(): Clears user state and redirects to home
```

### 2. Updated Components

#### LoginForm (`src/components/auth/LoginForm.tsx`)
- Uses `useAuthStore` hook
- Calls `login()` method on form submission
- Redirects to `/dashboard` on success
- Displays error messages from API

#### RegisterForm (`src/components/auth/RegisterForm.tsx`)
- Uses `useAuthStore` hook
- Calls `register()` method on form submission
- Validates password strength (min 8 characters)
- Redirects to `/dashboard` on success

## Resource Management

### 1. BookingStore (`src/stores/bookingStore.ts`)

The booking store manages resources and bookings:

```typescript
// Data Models:
interface Resource {
  id: number;
  name: string;
  description: string;
  category: string;
  categoryId?: number;
  capacity: number;
  location: string;
  available: boolean;
  status?: "available" | "unavailable";
  imageUrl?: string;
  requiresApproval?: boolean;
}

interface Booking {
  id: number;
  resourceId: number;
  resourceName: string;
  userId: number;
  userName?: string;
  startTime: string; // ISO format
  endTime: string;   // ISO format
  purpose?: string;
  status: "pending" | "confirmed" | "cancelled" | "rejected";
  createdAt?: string;
}

// User Methods:
- fetchResources(): GET /api/resources
- fetchBookings(userId): GET /api/bookings?userId=X
- createBooking(booking): POST /api/bookings
- updateBooking(id, updates): PUT /api/bookings/:id
- cancelBooking(id): DELETE /api/bookings/:id

// Admin Methods:
- createResource(resource): POST /api/resources
- updateResource(id, updates): PUT /api/resources/:id
- deleteResource(id): DELETE /api/resources/:id
- approveBooking(id): POST /api/bookings/:id/approve
- rejectBooking(id, reason): POST /api/bookings/:id/reject
```

### 2. Updated Pages

#### Browse Page (`src/app/browse/page.tsx`)
- Calls `fetchResources()` on component mount
- Displays loading state while fetching
- Checks authentication before allowing bookings
- Creates bookings via `createBooking()` method
- Converts date/time to ISO format for API
- Shows error messages if booking fails

**Key Changes:**
```typescript
// Fetch resources on mount
useEffect(() => {
  fetchResources();
}, [fetchResources]);

// Check auth before booking
const handleBookResource = (resource: Resource) => {
  if (!user) {
    router.push("/sign-in");
    return;
  }
  setSelectedResource(resource);
  setIsDialogOpen(true);
};

// Create booking with proper format
await createBooking({
  userId: user.id,
  resourceId: selectedResource.id,
  startTime: startTime.toISOString(),
  endTime: endTime.toISOString(),
  purpose: `Booking for ${selectedResource.name}`,
});
```

#### Dashboard Page (`src/app/dashboard/page.tsx`)
- Checks authentication on mount (redirects to login if not authenticated)
- Fetches user's bookings via `fetchBookings(user.id)`
- Displays loading state while fetching
- Updates bookings via `updateBooking()` and `cancelBooking()`
- Shows user name from auth state
- Formats dates properly from ISO strings

**Key Changes:**
```typescript
// Auth check and fetch bookings
useEffect(() => {
  if (!user) {
    router.push("/sign-in");
  } else {
    fetchBookings(user.id);
  }
}, [user, router, fetchBookings]);

// Filter bookings for current user
const userBookings = useMemo(() => {
  if (!user) return [];
  return bookings.filter((b) => b.userId === user.id);
}, [bookings, user]);

// Format dates from ISO strings
const startDate = new Date(booking.startTime);
const date = startDate.toLocaleDateString();
const time = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
```

## API Integration Points

### Authentication APIs
- **POST /api/auth/login**: Login with email and password
- **POST /api/auth/register**: Create new user account

### Resource APIs
- **GET /api/resources**: Fetch all available resources
- **GET /api/resources/:id**: Fetch specific resource
- **POST /api/resources**: Create new resource (admin)
- **PUT /api/resources/:id**: Update resource (admin)
- **DELETE /api/resources/:id**: Delete resource (admin)

### Booking APIs
- **GET /api/bookings**: Fetch all bookings (admin) or user bookings (with userId param)
- **POST /api/bookings**: Create new booking (checks conflicts)
- **PUT /api/bookings/:id**: Update booking
- **DELETE /api/bookings/:id**: Cancel booking
- **POST /api/bookings/:id/approve**: Approve booking (admin)
- **POST /api/bookings/:id/reject**: Reject booking (admin)

### Category APIs
- **GET /api/categories**: Fetch all resource categories

## Data Flow

### 1. User Registration/Login
```
User fills form → RegisterForm/LoginForm
  → authStore.register()/login()
  → POST /api/auth/register or /api/auth/login
  → Backend validates & creates session
  → Returns user object
  → authStore updates state
  → Persists to localStorage
  → Redirects to /dashboard
```

### 2. Browsing Resources
```
Browse page loads → useEffect calls fetchResources()
  → GET /api/resources
  → Backend queries database
  → Returns resources with category info
  → bookingStore updates state
  → UI re-renders with resources
```

### 3. Creating a Booking
```
User selects resource → BookingDialog opens
  → User picks date/time
  → handleConfirmBooking converts to ISO format
  → Calls createBooking()
  → POST /api/bookings
  → Backend checks conflicts & availability
  → Creates booking record
  → Returns success/error
  → Refreshes bookings list
  → Shows confirmation
```

### 4. Viewing Bookings
```
Dashboard loads → useEffect calls fetchBookings(user.id)
  → GET /api/bookings?userId=X
  → Backend queries user's bookings
  → Returns bookings with resource names
  → bookingStore updates state
  → UI displays in table format
```

## State Persistence

### Authentication State
- Stored in localStorage via Zustand persist middleware
- Key: `auth-storage`
- Auto-loads on page refresh
- Cleared on logout

### Booking State
- Not persisted (fresh data on each page load)
- Fetched from API on component mount
- Updated after mutations (create/update/delete)

## Error Handling

### API Errors
All API calls include try-catch blocks:

```typescript
try {
  await createBooking(data);
  // Success handling
} catch (error) {
  setError(error instanceof Error ? error.message : "Operation failed");
}
```

### Display Errors
- Login/Register: Red error message above submit button
- Booking creation: Error toast in bottom-right corner
- Dashboard operations: Alert dialogs with error details

## Testing

### Test Accounts (from seed data)
```
Admin:
- Email: admin@concordia.ca
- Password: admin123
- Role: admin

Student 1:
- Email: john.smith@concordia.ca
- Password: password123
- Role: student

Student 2:
- Email: jane.doe@concordia.ca
- Password: password123
- Role: student
```

### Testing Checklist
- [x] Register new user
- [x] Login with existing user
- [x] Browse resources
- [x] Create booking (authenticated)
- [x] View bookings in dashboard
- [x] Edit booking
- [x] Cancel booking
- [x] Logout
- [x] Redirect to login when not authenticated

## Next Steps

1. **Admin Features**: Implement admin dashboard with resource management
2. **Real-time Updates**: Add WebSocket support for live booking updates
3. **Notifications**: Display notifications from `/api/notifications`
4. **Availability Rules**: Implement working hours and exceptions UI
5. **Search/Filter**: Add advanced search with date range and availability
6. **Reports**: Show booking analytics and resource usage stats
7. **Email Notifications**: Send booking confirmations via email
8. **Profile Management**: Allow users to update their profile
9. **Password Reset**: Implement forgot password flow
10. **File Uploads**: Add resource image upload functionality

## Files Modified

### New Files Created
- `src/stores/authStore.ts` - Authentication state management
- `src/components/common/UserNav.tsx` - User navigation component
- `FRONTEND_BACKEND_INTEGRATION.md` - This document

### Files Updated
- `src/stores/bookingStore.ts` - Complete rewrite with API integration
- `src/components/auth/LoginForm.tsx` - Connected to authStore
- `src/components/auth/RegisterForm.tsx` - Connected to authStore
- `src/app/browse/page.tsx` - Fetch resources from API, create bookings
- `src/app/dashboard/page.tsx` - Fetch user bookings, auth check

## API Response Format

All API endpoints follow this format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

### Example: GET /api/resources
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Conference Room A",
      "description": "Large conference room...",
      "categoryId": 1,
      "capacity": 20,
      "location": "Building H, Room 801",
      "status": "available",
      "requiresApproval": false,
      "imageUrl": null,
      "category": {
        "id": 1,
        "name": "Conference Rooms",
        "description": "Professional meeting spaces"
      }
    }
  ]
}
```

## Environment Variables

Make sure these are set in `.env.local`:

```env
# Database (for local development with better-sqlite3)
DATABASE_URL=./local.db

# Cloudflare D1 (for production)
# Configured via wrangler.jsonc
```

## Running the Application

### Development Mode
```bash
# Start dev server
pnpm dev

# In another terminal, seed database (if needed)
pnpm db:seed

# View database
pnpm db:studio
```

### Production Mode
```bash
# Build application
pnpm build

# Deploy to Cloudflare Pages
pnpm deploy
```

## Troubleshooting

### Issue: Resources not loading
- Check browser console for API errors
- Verify database has been seeded: `pnpm db:seed`
- Check API endpoint: http://localhost:3000/api/resources

### Issue: Login not working
- Verify user exists in database
- Check password matches (case-sensitive)
- Clear browser localStorage and try again

### Issue: Bookings not showing
- Ensure user is authenticated
- Check userId matches between auth and bookings
- Verify bookings exist in database

### Issue: TypeScript errors
- Run `pnpm type-check` to see all errors
- Ensure all dependencies are installed: `pnpm install`
- Restart TypeScript server in VS Code

## Conclusion

The frontend is now fully integrated with the backend API. All main features (authentication, resource browsing, booking management) are working with real data from the database. The application follows best practices for state management, error handling, and user experience.
