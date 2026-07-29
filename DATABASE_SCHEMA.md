# Database Schema and Architecture

## Database Design

The application uses **MongoDB** as the primary database with **Mongoose** for schema modeling.

The database is designed to maintain data integrity, prevent duplicate bookings, and support efficient querying.

---

## Collections

### Users

Stores registered user information.

Fields

* name
* email
* password (hashed)
* role (User/Admin)
* createdAt
* updatedAt

---

### Services

Stores available wellness services.

Fields

* title
* description
* duration
* price
* active

---

### Slots

Stores appointment slots.

Fields

* serviceId
* date
* startTime
* endTime
* capacity
* bookedSeats
* availableSeats
* status

---

### Bookings

Stores booking information.

Fields

* userId
* serviceId
* slotId
* paymentType
* bookingStatus
* paymentStatus
* bookingDate

---

### Payments

Stores payment details.

Fields

* bookingId
* amount
* paymentMethod
* paymentStatus
* transactionDate

---

# Database Relationships

```text
User
 │
 └──────────────┐
                │
             Booking
            /       \
           /         \
      Service       Slot
           \
            \
          Payment
```

---

# Architectural Decisions

## MVC Architecture

The backend follows the Model-View-Controller (MVC) architecture.

* Models manage database schemas.
* Controllers handle request and response logic.
* Routes define API endpoints.
* Middleware manages authentication and validation.
* Services contain reusable business logic.

---

## Authentication

JWT-based authentication is used for secure access to protected resources.

Passwords are hashed using bcrypt before storage.

---

## Booking Transactions

MongoDB Transactions ensure ACID compliance.

Booking workflow:

1. Verify slot availability.
2. Start transaction.
3. Create booking.
4. Update slot availability.
5. Create payment record.
6. Commit transaction.
7. Roll back if any step fails.

This prevents double booking and maintains database consistency.

---

## Error Handling

The application uses centralized error handling with consistent HTTP status codes and descriptive error messages.

---

## Security Measures

* JWT Authentication
* Password Hashing (bcrypt)
* Input Validation
* Helmet Security Headers
* CORS Configuration
* Environment Variables
* Rate Limiting

---

## Scalability

The project is modular, making it easy to add features such as online payment gateways, notifications, analytics, and additional services without major architectural changes.
