# Senior-Wellness-Slot-Booking
KineticAge provides services for senior citizens, such as:  Senior Physiotherapy Yoga Sessions Mobility Assessment Balance Training Fall Prevention Program  Instead of calling to book an appointment, users can use the application.

# KineticAge Slot Booking Application

## Project Overview

The KineticAge Slot Booking Application is a full-stack MERN application that enables users to book wellness and mobility service appointments. Users can browse services, view available slots for the next three days, authenticate, complete bookings using Prepaid or Cash on Delivery (COD), and manage their booking history through a personalized dashboard.

---

## Features

### User Features

* User Registration
* User Login
* JWT Authentication
* Browse Services
* View Available Slots
* Book Appointment
* Prepaid and COD Payment Options
* View Upcoming Bookings
* View Booking History
* Cancel Booking
* User Profile

### Admin Features

* Manage Services
* Manage Booking Slots
* View Users
* View All Bookings
* View Payment Records
* Dashboard Analytics

---

## Technology Stack

### Frontend

* React.js
* React Router
* Axios
* Bootstrap/Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

---

## Project Structure

```text
kineticage-slot-booking-app/
│
├── frontend/
├── backend/
├── README.md
└── DATABASE_SCHEMA.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create a **.env** file.

Example

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Run Backend

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Running the Application

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

Open

```
http://localhost:5173
```

---

## Testing the Application

1. Register a new user.
2. Login.
3. Browse available services.
4. Select a slot.
5. Complete booking.
6. Choose payment method.
7. Verify booking appears in the dashboard.
8. Cancel booking and verify slot availability updates.

---

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login
* POST /api/auth/logout

### Services

* GET /api/services
* POST /api/services
* PUT /api/services/:id
* DELETE /api/services/:id

### Slots

* GET /api/slots
* POST /api/slots

### Bookings

* POST /api/bookings
* GET /api/bookings/my
* PUT /api/bookings/cancel/:id

### Payments

* POST /api/payments
* GET /api/payments

---

## Future Improvements

* Online Payment Gateway Integration
* Email Notifications
* SMS Reminders
* Calendar Integration
* Admin Analytics Dashboard
* Push Notifications
* Docker Deployment
* CI/CD Pipeline

---

## Author

Ansuman Behera

