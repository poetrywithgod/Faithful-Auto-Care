# Faithful Auto Care - Car Wash Booking System

A full-stack web application for booking professional car wash and detailing services. Built with React, TypeScript, Vite, and Supabase.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [Backend Integration](#backend-integration)
- [Frontend Pages & Components](#frontend-pages--components)
- [Data Flow](#data-flow)
- [Setup & Installation](#setup--installation)

---

## Overview

Faithful Auto Care is a modern car wash booking platform that allows customers to:
- Book car wash appointments online
- Select service types (Basic, Standard, Premium)
- Choose time slots based on availability
- Receive email confirmations
- View booking history

The application also includes an admin dashboard for managing bookings, services, teams, and time slots.

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Edge Functions (Deno runtime)
- **Resend API** - Email delivery service

---

## Architecture

The application follows a modern JAMstack architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │   Booking    │  │    Admin     │      │
│  │     Page     │  │     Flow     │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Client SDK                        │
│              (@supabase/supabase-js)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
┌──────────────────────────┐  ┌───────────────────────┐
│  Supabase PostgreSQL     │  │  Supabase Edge        │
│      Database            │  │    Functions          │
│  ┌──────────────────┐    │  │  ┌────────────────┐   │
│  │   bookings       │    │  │  │ send-booking-  │   │
│  │   services       │    │  │  │     email      │   │
│  │   reviews        │    │  │  └────────────────┘   │
│  │   team_members   │    │  │         │             │
│  │   time_slots     │    │  │         ▼             │
│  │   blocked_times  │    │  │   Resend API          │
│  └──────────────────┘    │  └───────────────────────┘
└──────────────────────────┘
```

---

## Database Schema

### Tables Overview

The database consists of 6 main tables, all protected by Row Level Security (RLS):

#### 1. `bookings`
Stores all customer booking information.

**Columns:**
- `id` (uuid, PK) - Unique booking identifier
- `booking_code` (text, unique) - 8-digit customer-facing booking code
- `booking_date` (date) - Appointment date
- `booking_time` (text) - Appointment time slot
- `service_type` (text) - Service name (Basic/Standard/Premium Wash)
- `service_price` (integer) - Price in pounds
- `vehicle_type` (text) - Vehicle category (Sedan, SUV, Truck, Van)
- `customer_name` (text) - Customer full name
- `customer_email` (text) - Customer email address
- `customer_phone` (text) - Customer phone number
- `status` (text) - Booking status (confirmed, cancelled, completed)
- `created_at` (timestamptz) - Creation timestamp
- `updated_at` (timestamptz) - Last update timestamp

**Indexes:**
- `idx_bookings_email` on `customer_email`
- `idx_bookings_date` on `booking_date`
- `idx_bookings_code` on `booking_code`

**RLS Policies:**
- Public can create bookings (INSERT)
- Public can view all bookings (SELECT)

**Migration:** `20260225225859_create_bookings_table.sql` & `20260226014336_add_booking_code_column.sql`

---

#### 2. `services`
Stores available service packages and pricing.

**Columns:**
- `id` (uuid, PK) - Service identifier
- `name` (text) - Service name
- `description` (text) - Service description
- `price` (integer) - Base price
- `duration` (integer) - Duration in minutes
- `features` (jsonb) - Array of service features
- `is_active` (boolean) - Availability status
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Public can view active services (SELECT WHERE is_active = true)

**Migration:** `20260226205911_create_admin_tables.sql`

---

#### 3. `reviews`
Stores customer reviews and ratings.

**Columns:**
- `id` (uuid, PK) - Review identifier
- `booking_id` (uuid, FK → bookings.id) - Associated booking
- `customer_name` (text)
- `service_type` (text)
- `rating` (integer) - 1-5 stars (CHECK constraint)
- `comment` (text) - Review text
- `status` (text) - pending, approved, rejected
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Public can view approved reviews (SELECT WHERE status = 'approved')

**Migration:** `20260226205911_create_admin_tables.sql`

---

#### 4. `team_members`
Stores staff information.

**Columns:**
- `id` (uuid, PK)
- `name` (text)
- `email` (text, unique)
- `phone` (text)
- `role` (text) - Manager, Technician, Booking Officer
- `date_joined` (date)
- `services_completed` (integer)
- `rating` (decimal(2,1))
- `status` (text) - active, inactive
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**RLS Policies:**
- Public can view active team members (SELECT WHERE status = 'active')

**Migration:** `20260226211606_create_teams_and_timeslots.sql`

---

#### 5. `time_slots`
Defines operating hours for each day of the week.

**Columns:**
- `id` (uuid, PK)
- `day_of_week` (text) - Monday-Sunday
- `start_time` (time) - Opening time
- `end_time` (time) - Closing time
- `capacity` (integer) - Max bookings per day
- `is_active` (boolean) - Whether day is operational
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Constraints:**
- UNIQUE constraint on `day_of_week`

**RLS Policies:**
- Public can view active time slots (SELECT WHERE is_active = true)

**Migration:** `20260226211606_create_teams_and_timeslots.sql`

---

#### 6. `blocked_times`
Stores blocked time slots (already booked or unavailable).

**Columns:**
- `id` (uuid, PK)
- `day_of_week` (text)
- `blocked_time` (text) - Time range (e.g., "12:30 - 13:30")
- `reason` (text) - Reason for blocking
- `created_at` (timestamptz)

**RLS Policies:**
- Public can view all blocked times (SELECT)

**Migration:** `20260226211606_create_teams_and_timeslots.sql`

---

## Backend Integration

### Supabase Client Setup

**File:** `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**Why it's configured this way:**
- The singleton pattern ensures only one Supabase client instance exists
- Environment variables keep sensitive credentials out of source code
- The anon key provides public access protected by RLS policies

---

### Edge Functions

#### 1. `send-booking-email`

**Purpose:** Sends booking confirmation emails to customers after successful booking.

**Location:** `supabase/functions/send-booking-email/index.ts`

**Endpoint:** `POST /functions/v1/send-booking-email`

**Request Body:**
```typescript
{
  booking_id: string;        // Booking code
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_date: string;      // ISO date string
  booking_time: string;
  service_type: string;
  service_price: number;
  vehicle_type: string;
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
  emailId?: string;
}
```

**Frontend Integration:**

**File:** `src/components/booking/DetailsStep.tsx` (Lines 92-109)

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

await fetch(`${supabaseUrl}/functions/v1/send-booking-email`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    booking_id: bookingCode,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    booking_date: bookingData.date,
    booking_time: bookingData.time,
    service_type: bookingData.serviceType,
    service_price: bookingData.servicePrice,
    vehicle_type: bookingData.vehicleType,
  }),
});
```

**Why this integration pattern:**
- Called AFTER booking is created in the database
- Uses Resend API to send professional HTML emails
- Non-blocking: Email failure doesn't cancel the booking
- CORS headers enabled for frontend communication
- Authenticates using the Supabase anon key

**External Dependency:**
- **Resend API** - Requires `RESEND_API_KEY` environment variable
- Used for reliable email delivery with tracking

---

## Frontend Pages & Components

### Main Pages

#### 1. Landing Page (Home)
**File:** `src/App.tsx` (HomePage component)

**Route:** `/`

**Sections:**
- HeroSection - Navigation + hero banner
- FeaturesSection - Service highlights
- AboutSection - Company information
- ServicesSection - Service offerings
- HowItWorksSection - Booking process
- WhyChooseUsSection - Value propositions
- StatisticsSection - Business metrics
- PricingSection - Pricing tiers
- ReviewsSection - Customer testimonials
- FAQSection - Common questions
- FooterSection - Contact & links

**Database Connections:**
- None (static content)

---

#### 2. Booking Page
**File:** `src/pages/BookingPage.tsx`

**Route:** `/book-now`

**Purpose:** Multi-step booking flow for customers

**State Management:**
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [bookingData, setBookingData] = useState<Partial<BookingData>>({});
const [bookingId, setBookingId] = useState<string>('');
```

**Steps:**

##### Step 1: Date Selection
**Component:** `src/components/booking/DateStep.tsx`

**Functionality:**
- Custom calendar UI
- Disables past dates
- Highlights selected date
- No database calls

---

##### Step 2: Time Selection
**Component:** `src/components/booking/TimeStep.tsx`

**Database Query (Lines 34-37):**
```typescript
const { data } = await supabase
  .from('bookings')
  .select('booking_time')
  .eq('booking_date', selectedDate);
```

**Why:**
- Fetches already-booked times for the selected date
- Prevents double-booking by disabling occupied slots
- Real-time availability checking

**UI Behavior:**
- Booked slots are grayed out and disabled
- Available slots are clickable
- Selected slot is highlighted in blue

---

##### Step 3: Service Selection
**Component:** `src/components/booking/ServiceStep.tsx`

**Functionality:**
- Service type selection (Basic/Standard/Premium)
- Vehicle type selection (Sedan/SUV/Truck/Van)
- Displays pricing
- No database calls (uses hardcoded service data)

---

##### Step 4: Customer Details & Booking Creation
**Component:** `src/components/booking/DetailsStep.tsx`

**Database Operations (Lines 46-63):**
```typescript
const { data, error } = await supabase
  .from('bookings')
  .insert([{
    booking_code: bookingCode,
    booking_date: bookingData.date,
    booking_time: bookingData.time,
    service_type: bookingData.serviceType,
    service_price: bookingData.servicePrice,
    vehicle_type: bookingData.vehicleType,
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    status: 'confirmed'
  }])
  .select()
  .single();
```

**Why:**
- Creates the booking record in the database
- Generates unique 8-digit booking code (Lines 38-75)
- Retries up to 5 times if code collision occurs
- Returns booking data immediately

**Edge Function Call (Lines 92-109):**
- Sends confirmation email via `send-booking-email` function
- Happens AFTER database insert succeeds
- Non-blocking: booking succeeds even if email fails

---

##### Step 5: Confirmation
**Component:** `src/components/booking/ConfirmationStep.tsx`

**Functionality:**
- Displays booking summary
- Shows booking code for future reference
- Provides navigation back to home
- No database calls

---

#### 3. View Bookings Page
**File:** `src/pages/ViewBookingsPage.tsx`

**Route:** `/view-bookings`

**Purpose:** Allow customers to view their booking history

**Database Query (Lines 43-47):**
```typescript
const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('customer_email', email)
  .order('created_at', { ascending: false });
```

**Why:**
- Retrieves all bookings for a given email address
- Orders by creation date (newest first)
- No authentication required (email-based lookup)
- Protected by RLS policy allowing public SELECT

**UI Flow:**
1. User enters email address
2. Clicks "Search Bookings"
3. System queries database
4. Displays booking cards with:
   - Booking code
   - Date & time
   - Service type
   - Vehicle type
   - Status
   - Price

**Navigation:**
- Linked from navbar "My Bookings" menu item (Lines 75-80 in HeroSection.tsx)

---

#### 4. Admin Dashboard
**Files:** `src/pages/admin/AdminDashboard.tsx` and related admin pages

**Routes:**
- `/admin` - Dashboard overview
- `/admin/bookings` - Manage all bookings
- `/admin/customers` - Customer management
- `/admin/services` - Service management
- `/admin/reviews` - Review moderation
- `/admin/teams` - Team member management
- `/admin/timeslot` - Time slot configuration

**Note:** Admin pages are currently accessible without authentication (future enhancement needed)

---

### Component Structure

```
src/
├── pages/
│   ├── BookingPage.tsx          # Main booking flow orchestrator
│   ├── ViewBookingsPage.tsx     # Booking history lookup
│   └── admin/
│       ├── AdminDashboard.tsx   # Admin overview
│       ├── AdminBookings.tsx    # Booking management
│       ├── AdminCustomers.tsx   # Customer management
│       ├── AdminServices.tsx    # Service management
│       ├── AdminReviews.tsx     # Review management
│       ├── AdminTeams.tsx       # Team management
│       └── AdminTimeSlot.tsx    # Schedule management
│
├── components/
│   ├── booking/
│   │   ├── DateStep.tsx         # Date picker component
│   │   ├── TimeStep.tsx         # Time slot selector (DB: reads bookings)
│   │   ├── ServiceStep.tsx      # Service/vehicle selector
│   │   ├── DetailsStep.tsx      # Customer form (DB: inserts booking, calls Edge Function)
│   │   └── ConfirmationStep.tsx # Success message
│   │
│   ├── admin/
│   │   └── AdminLayout.tsx      # Admin sidebar layout
│   │
│   └── ui/
│       ├── button.tsx           # Reusable button
│       ├── card.tsx             # Card container
│       ├── input.tsx            # Form input
│       ├── separator.tsx        # Visual divider
│       └── accordion.tsx        # Collapsible content
│
├── sections/
│   ├── HeroSection.tsx          # Navbar + Hero (navigation to /view-bookings)
│   ├── FeaturesSection.tsx      # Service highlights
│   ├── AboutSection.tsx         # About content
│   ├── ServicesSection.tsx      # Service cards
│   ├── HowItWorksSection.tsx    # Process steps
│   ├── WhyChooseUsSection.tsx   # Benefits
│   ├── StatisticsSection.tsx    # Metrics
│   ├── PricingSection.tsx       # Pricing tiers
│   ├── ReviewsSection.tsx       # Testimonials
│   ├── FAQSection.tsx           # Q&A accordion
│   └── FooterSection.tsx        # Footer links
│
└── lib/
    ├── supabase.ts              # Supabase client singleton
    └── utils.ts                 # Utility functions (cn for classnames)
```

---

## Data Flow

### Booking Creation Flow

```
1. User navigates to /book-now
   │
   ├─► DateStep: User selects date
   │   └─► State updated: bookingData.date
   │
   ├─► TimeStep: Component fetches booked times
   │   │
   │   ├─► Database Query:
   │   │   SELECT booking_time FROM bookings
   │   │   WHERE booking_date = selectedDate
   │   │
   │   └─► UI disables booked slots
   │   └─► User selects available time
   │   └─► State updated: bookingData.time
   │
   ├─► ServiceStep: User selects service & vehicle
   │   └─► State updated: bookingData.serviceType, servicePrice, vehicleType
   │
   ├─► DetailsStep: User enters contact info
   │   │
   │   ├─► Generate random 8-digit booking code
   │   │
   │   ├─► Database Insert:
   │   │   INSERT INTO bookings (
   │   │     booking_code, booking_date, booking_time,
   │   │     service_type, service_price, vehicle_type,
   │   │     customer_name, customer_email, customer_phone
   │   │   )
   │   │
   │   ├─► If code collision (unique constraint violation):
   │   │   └─► Retry with new code (up to 5 attempts)
   │   │
   │   ├─► On success:
   │   │   │
   │   │   ├─► Edge Function Call:
   │   │   │   POST /functions/v1/send-booking-email
   │   │   │   │
   │   │   │   ├─► Edge Function receives booking data
   │   │   │   │
   │   │   │   ├─► Calls Resend API:
   │   │   │   │   POST https://api.resend.com/emails
   │   │   │   │   Authorization: Bearer RESEND_API_KEY
   │   │   │   │
   │   │   │   └─► Sends HTML confirmation email to customer
   │   │   │
   │   │   └─► Move to ConfirmationStep
   │   │       └─► Display booking code
   │   │
   │   └─► On error:
   │       └─► Show error message
   │       └─► Allow retry
```

### Booking Lookup Flow

```
1. User navigates to /view-bookings
   │
   ├─► User enters email address
   │
   ├─► User clicks "Search Bookings"
   │
   ├─► Database Query:
   │   SELECT * FROM bookings
   │   WHERE customer_email = enteredEmail
   │   ORDER BY created_at DESC
   │
   ├─► Results returned
   │
   ├─► If no bookings found:
   │   └─► Show "No bookings found" message
   │   └─► Show "Make Your First Booking" button
   │
   └─► If bookings found:
       └─► Display booking cards with all details
       └─► Show booking_code, date, time, service, status
```

### Time Slot Availability Check

```
User selects date
   │
   ├─► TimeStep component mounts
   │
   ├─► useEffect hook triggers
   │
   ├─► Database Query:
   │   SELECT booking_time FROM bookings
   │   WHERE booking_date = selectedDate
   │
   ├─► Response: Array of booked time strings
   │   Example: ['05:00 AM', '10:00 AM', '02:00 PM']
   │
   ├─► Component state updated: setBookedTimes(data)
   │
   └─► UI renders:
       ├─► Available slots: clickable, white background
       └─► Booked slots: disabled, grayed out, blurred
```

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Edge Function environment variables (configured in Supabase):
```env
RESEND_API_KEY=your_resend_api_key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd faithful-auto-care
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a new Supabase project
   - Run the migration files in order:
     1. `20260225225859_create_bookings_table.sql`
     2. `20260226014336_add_booking_code_column.sql`
     3. `20260226205911_create_admin_tables.sql`
     4. `20260226211606_create_teams_and_timeslots.sql`

4. **Deploy Edge Function**
   - Deploy `send-booking-email` function to Supabase
   - Set `RESEND_API_KEY` secret in Supabase dashboard

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

---

## Key Integration Points

### Frontend ↔ Database

| Component | Database Table | Operation | Lines | Purpose |
|-----------|---------------|-----------|-------|---------|
| TimeStep.tsx | bookings | SELECT | 34-37 | Fetch booked times for date |
| DetailsStep.tsx | bookings | INSERT | 46-63 | Create new booking |
| ViewBookingsPage.tsx | bookings | SELECT | 43-47 | Retrieve user bookings |

### Frontend ↔ Edge Functions

| Component | Edge Function | Method | Lines | Purpose |
|-----------|--------------|--------|-------|---------|
| DetailsStep.tsx | send-booking-email | POST | 92-109 | Send confirmation email |

### Edge Functions ↔ External APIs

| Edge Function | External API | Purpose |
|--------------|-------------|---------|
| send-booking-email | Resend API | Email delivery service |

---

## Security Features

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Public can only perform specific allowed operations
   - No authentication required for basic booking (frictionless UX)

2. **Unique Booking Codes**
   - 8-digit codes prevent enumeration attacks
   - Collision detection with retry logic
   - Indexed for fast lookups

3. **Environment Variables**
   - Sensitive credentials stored in `.env`
   - Not committed to version control
   - Edge function secrets managed by Supabase

4. **CORS Configuration**
   - Edge functions configured with proper CORS headers
   - Allows frontend to communicate securely

---

## Future Enhancements

1. **Authentication**
   - Add Supabase Auth for admin panel
   - Secure admin routes with authentication guards

2. **Payment Integration**
   - Add Stripe for online payments
   - Store payment status in bookings table

3. **Real-time Updates**
   - Use Supabase Realtime for live availability updates
   - Push notifications for booking status changes

4. **SMS Notifications**
   - Add Twilio integration for SMS reminders
   - Send appointment reminders 24 hours before

5. **Capacity Management**
   - Implement `time_slots.capacity` checking
   - Prevent overbooking based on team availability

---

## License

MIT

---

## Contact

For questions or support, contact: info@faithfulautocare.com
