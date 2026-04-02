# ATM Banking System

> A **production-ready** full-stack ATM Banking System with ASP.NET Core 9 backend and React 19 frontend, following Clean Architecture principles.

![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-Educational-green.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

## 🏗️ Architecture Overview

The solution is organized into **frontend** and **backend** layers following Clean Architecture principles:

```
ATM-Banking-System/
├── frontend/                    # React 19 + TypeScript UI Layer
│   ├── src/
│   │   ├── pages/              # ATM Pages (Login, Dashboard, Withdraw, Deposit, History)
│   │   ├── components/         # Reusable Components
│   │   ├── api/               # Axios API Client
│   │   ├── context/           # React Context (Auth, Session)
│   │   ├── hooks/             # Custom Hooks
│   │   └── types/             # TypeScript Types
│   └── package.json           # Dependencies (React, Tailwind, React Router)
│
└── backend/
    ├── ATM-Banking-System.sln  # Solution file
    ├── ATM.Domain/             # Core business logic (no dependencies)
    │   ├── Entities/           # Domain entities
    │   ├── ValueObjects/       # Value objects (Money, CardNumber, Pin)
    │   ├── Enums/             # Domain enums
    │   └── Exceptions/        # Domain exceptions
    │
    ├── ATM.Application/        # Application services & interfaces
    │   ├── DTOs/              # Data Transfer Objects
    │   ├── Interfaces/        # Service & repository interfaces
    │   └── Services/          # Application services
    │
    ├── ATM.Infrastructure/     # Data access & external concerns
    │   ├── Context/           # EF Core DbContext
    │   ├── Repositories/      # Repository implementations
    │   └── UnitOfWork.cs      # Transaction management
    │
    ├── ATM.API/               # Web API layer
    │   ├── Controllers/       # API endpoints
    │   ├── Middleware/        # Exception handling
    │   ├── Validators/        # Request validation
    │   └── Program.cs         # Application startup
    │
    └── ATM.Tests/             # Unit tests
        ├── Services/          # Service unit tests
        └── ATM.Tests.csproj   # Test project
```

## 🎯 Key Features

### Security
- ✅ **PIN Hashing** using BCrypt
- ✅ **Card Blocking** after 3 failed attempts
- ✅ **Session Management** with expiration
- ✅ **Audit Logging** for all financial operations

### Banking Operations
- ✅ **Card Authentication** with PIN validation
- ✅ **Balance Inquiry**
- ✅ **Cash Withdrawal** with ATM cash management
- ✅ **Cash Deposit**
- ✅ **Transaction History** with pagination
- ✅ **Double-Entry Ledger** for accounting
- ✅ **Optimistic Concurrency** control

### Technical Implementation
- ✅ **Repository Pattern** with generic base
- ✅ **Unit of Work** for transaction consistency
- ✅ **Repository Manager** centralized access
- ✅ **Service Manager** for application services
- ✅ **Global Exception Handling**
- ✅ **FluentValidation** for request validation
- ✅ **API Versioning** (v1)
- ✅ **Standardized API Responses**
- ✅ **Comprehensive Unit Testing** with xUnit and Moq
- ✅ **Code Coverage** tracking with Coverlet
- ✅ **Modular Project Structure** for scalability

### Frontend Features
- ✅ **Responsive Design** with Tailwind CSS
- ✅ **Modern React 19** with TypeScript
- ✅ **Client-side Routing** with React Router
- ✅ **Form Validation** with React Hook Form & Zod
- ✅ **Session Management** with Context API
- ✅ **API Integration** with Axios
- ✅ **Beautiful UI Components** with Lucide Icons
- ✅ **Dark Mode Ready** Styling
- ✅ **Type-Safe** Development

## 📦 Prerequisites

### Backend
- .NET 9 SDK
- SQL Server 
- Visual Studio 2022 or VS Code

### Frontend
- Node.js 18+ and npm 9+
- Modern web browser

### General
- Git (for cloning)

## ⚡ Quick Start

### Run Everything + Docker:
```bash
# Clone the repository
git clone https://github.com/Ma7moudkolib/ATM-Banking-System.git
cd ATM-Banking-System

# Backend
cd backend && dotnet run

# Frontend (in new terminal)
cd frontend && npm install && npm run dev
```

Backend: https://localhost:7001
Frontend: http://localhost:5173

## 🚀 Getting Started

### 1. Clone and Build

```bash
# Create solution structure
mkdir AtmApi
cd AtmApi

# Create projects
dotnet new sln -n AtmApi
dotnet new classlib -n AtmApi.Domain -o src/AtmApi.Domain
dotnet new classlib -n AtmApi.Application -o src/AtmApi.Application
dotnet new classlib -n AtmApi.Infrastructure -o src/AtmApi.Infrastructure
dotnet new webapi -n AtmApi.API -o src/AtmApi.API

# Add projects to solution
dotnet sln add src/AtmApi.Domain/AtmApi.Domain.csproj
dotnet sln add src/AtmApi.Application/AtmApi.Application.csproj
dotnet sln add src/AtmApi.Infrastructure/AtmApi.Infrastructure.csproj
dotnet sln add src/AtmApi.API/AtmApi.API.csproj

# Add project references
cd src/AtmApi.Application
dotnet add reference ../AtmApi.Domain/AtmApi.Domain.csproj

cd ../AtmApi.Infrastructure
dotnet add reference ../AtmApi.Application/AtmApi.Application.csproj

cd ../AtmApi.API
dotnet add reference ../AtmApi.Infrastructure/AtmApi.Infrastructure.csproj
dotnet add reference ../AtmApi.Application/AtmApi.Application.csproj

cd ../../
```

### 2. Install NuGet Packages

```bash
# Domain
cd src/AtmApi.Domain
dotnet add package BCrypt.Net-Next

# Application
cd ../AtmApi.Application
dotnet add package Microsoft.Extensions.Caching.Abstractions

# Infrastructure
cd ../AtmApi.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools

# API
cd ../AtmApi.API
dotnet add package FluentValidation.AspNetCore
dotnet add package Microsoft.AspNetCore.Mvc.Versioning
dotnet add package Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Swashbuckle.AspNetCore
dotnet add package Microsoft.Extensions.Caching.Memory

cd ../../
```

### 3. Configure Database

Update `appsettings.json` with your connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=AtmApiDb;Trusted_Connection=True;"
  }
}
```

### 4. Run the Application

```bash
# From backend directory
cd ATM.API
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7001`
- HTTP: `http://localhost:5001`

### 5. Run Unit Tests

```bash
# From backend directory
dotnet test ATM.Tests/ATM.Tests.csproj

# Run with verbose output
dotnet test ATM.Tests/ATM.Tests.csproj -v normal

# Run with code coverage
dotnet test ATM.Tests/ATM.Tests.csproj /p:CollectCoverage=true
```

**Test Coverage:**
- ✅ AccountService Tests
- ✅ AuthenticationService Tests
- ✅ TransactionService Tests
- ✅ AuditService Tests

## 🎨 Frontend Getting Started

### 1. Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install packages
npm install
```

### 2. Configure API Endpoint

Update `frontend/.env.local` with your backend URL:

```env
VITE_API_BASE_URL=https://localhost:7001/api/v1
```

### 3. Run Development Server

```bash
# Start the dev server
npm run dev
```

The frontend will be available at:
- `http://localhost:5173` (default Vite port)

### 4. Build for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

### 5. Frontend Pages

The frontend includes the following pages:

| Page | Route | Description |
|------|-------|-------------|
| **LoginPage** | `/` | Card authentication & PIN entry |
| **DashboardPage** | `/dashboard` | Account overview & balance |
| **WithdrawPage** | `/withdraw` | Cash withdrawal interface |
| **DepositPage** | `/deposit` | Cash deposit interface |
| **HistoryPage** | `/history` | Transaction history & details |
| **AccountPage** | `/account` | Account details & settings |

## 📝 Seeded Test Data

The application includes test data for immediate testing:

### Test Accounts

| Account Number   | Customer Name | Balance  | Currency |
|-----------------|---------------|----------|----------|
| ACC1234567890   | John Doe      | $5,000   | USD      |
| ACC0987654321   | Jane Smith    | $10,000  | USD      |

### Test Cards

| Card Number         | PIN  | Account       | Daily Limit |
|--------------------|------|---------------|-------------|
| 4532015112830366   | 1234 | ACC1234567890 | $1,000      |
| 5425233430109903   | 5678 | ACC0987654321 | $2,000      |

### ATM Machines

| Machine Code | Location         | Cash Available | Max Withdrawal |
|-------------|------------------|----------------|----------------|
| ATM001      | Downtown Branch  | $50,000        | $1,000         |
| ATM002      | Airport Terminal | $100,000       | $1,000         |

## 🔌 API Endpoints

### Authentication

#### Login
```http
POST /api/v1/authentication/login
Content-Type: application/json

{
  "cardNumber": "4532015112830366",
  "pin": "1234"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "sessionId": "guid-here",
    "cardNumber": "****-****-****-0366",
    "accountNumber": "ACC1234567890",
    "customerName": "John Doe",
    "expiresAt": "2026-01-11T12:05:00Z"
  },
  "errors": [],
  "timestamp": "2026-01-11T12:00:00Z"
}
```

#### Validate Session
```http
GET /api/v1/authentication/validate/{sessionId}
```

### Account Operations

#### Get Balance
```http
GET /api/v1/account/balance/{sessionId}
```

**Response:**
```json
{
  "success": true,
  "message": "Balance retrieved successfully",
  "data": {
    "accountNumber": "ACC1234567890",
    "availableBalance": 5000.00,
    "currency": "USD",
    "inquiryDate": "2026-01-11T12:00:00Z"
  }
}
```

#### Get Account Details
```http
GET /api/v1/account/details/{sessionId}
```

### Transactions

#### Withdraw Cash
```http
POST /api/v1/transaction/withdraw
Content-Type: application/json

{
  "sessionId": "guid-here",
  "amount": 100.00,
  "atmMachineCode": "ATM001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Withdrawal completed successfully",
  "data": {
    "transactionReference": "TXN20260111120000ABCD1234",
    "type": "Withdrawal",
    "amount": 100.00,
    "currency": "USD",
    "balanceBefore": 5000.00,
    "balanceAfter": 4900.00,
    "transactionDate": "2026-01-11T12:00:00Z",
    "status": "Completed"
  }
}
```

#### Deposit Cash
```http
POST /api/v1/transaction/deposit
Content-Type: application/json

{
  "sessionId": "guid-here",
  "amount": 200.00,
  "atmMachineCode": "ATM001"
}
```

#### Transaction History
```http
POST /api/v1/transaction/history
Content-Type: application/json

{
  "sessionId": "guid-here",
  "fromDate": "2026-01-01T00:00:00Z",
  "toDate": "2026-01-11T23:59:59Z",
  "pageNumber": 1,
  "pageSize": 10
}
```

## 🧪 Unit Testing

The project includes comprehensive unit tests for all major services using **xUnit** and **Moq**:

### Test Files
- [AccountServiceTests.cs](backend/ATM.Tests/Services/AccountServiceTests.cs)
- [AuthenticationServiceTests.cs](backend/ATM.Tests/Services/AuthenticationServiceTests.cs)
- [TransactionServiceTests.cs](backend/ATM.Tests/Services/TransactionServiceTests.cs)
- [AuditServiceTests.cs](backend/ATM.Tests/Services/AuditServiceTests.cs)

### Running Tests

```bash
# Run all tests
cd backend
dotnet test

# Run specific test class
dotnet test --filter ClassName=AccountServiceTests

# Run with Live Unit Testing (Visual Studio)
# Ctrl + Alt + U
```

## 🧪 Testing with cURL

### Complete Transaction Flow

```bash
# 1. Login
SESSION_ID=$(curl -X POST https://localhost:7001/api/v1/authentication/login \
  -H "Content-Type: application/json" \
  -d '{"cardNumber":"4532015112830366","pin":"1234"}' \
  -k -s | jq -r '.data.sessionId')

echo "Session ID: $SESSION_ID"

# 2. Check Balance
curl -X GET "https://localhost:7001/api/v1/account/balance/$SESSION_ID" -k -s | jq

# 3. Withdraw $100
curl -X POST https://localhost:7001/api/v1/transaction/withdraw \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"amount\":100,\"atmMachineCode\":\"ATM001\"}" \
  -k -s | jq

# 4. Check Balance Again
curl -X GET "https://localhost:7001/api/v1/account/balance/$SESSION_ID" -k -s | jq

# 5. Get Transaction History
curl -X POST https://localhost:7001/api/v1/transaction/history \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"pageNumber\":1,\"pageSize\":5}" \
  -k -s | jq
```

## 🔐 Security Features

### PIN Security
- PINs are hashed using BCrypt (never stored in plain text)
- 3 failed attempts result in card blocking
- Failed attempts are tracked with timestamps

### Session Management
- Sessions expire after 5 minutes of inactivity
- Stored in-memory cache
- Each session tied to specific card and account

### Transaction Safety
- Database transactions ensure atomicity
- Optimistic concurrency control prevents race conditions
- All financial operations are audited

### Validation Rules
- Card numbers validated with Luhn algorithm
- Withdrawal amounts must be multiples of $20
- Maximum withdrawal: $1,000 per transaction
- Maximum deposit: $10,000 per transaction

## 📊 Database Schema

### Key Tables

**Accounts**
- Id (PK)
- AccountNumber (Unique)
- CustomerName
- Balance (decimal 18,2)
- Currency
- Status
- Version (Concurrency Token)

**Cards**
- Id (PK)
- CardNumber (Unique, encrypted)
- HashedPin
- AccountId (FK)
- Status
- ExpiryDate
- FailedPinAttempts
- DailyWithdrawalLimit

**Transactions**
- Id (PK)
- TransactionReference (Unique)
- AccountId (FK)
- Type
- Status
- Amount
- BalanceBefore
- BalanceAfter

**LedgerEntries** (Immutable)
- Id (PK)
- TransactionId (FK)
- AccountId (FK)
- EntryType (Debit/Credit)
- Amount
- BalanceAfter

## 🏦 Business Rules

### Withdrawals
1. Session must be valid
2. Card must be active
3. Account must be active
4. Sufficient balance required
5. Amount must be multiple of $20
6. Cannot exceed daily limit
7. ATM must have sufficient cash
8. Transaction is atomic (DB + ATM cash update)

### Deposits
1. Session must be valid
2. Card must be active
3. Account must be active
4. Maximum $10,000 per transaction
5. Transaction is atomic

### Double-Entry Ledger
- Every transaction creates ledger entries
- Withdrawals create DEBIT entries
- Deposits create CREDIT entries
- Entries are immutable (append-only)
- Balance is always tracked

## 🛠️ Design Patterns Used

### Repository Pattern
Generic repository with specific implementations for each entity type.

### Unit of Work Pattern
Manages database transactions and ensures consistency across multiple repository operations.

### Manager Patterns
- **RepositoryManager**: Centralizes access to all repositories
- **ServiceManager**: Coordinates all application services

### Value Objects
- **Money**: Ensures currency consistency
- **CardNumber**: Validates card numbers with Luhn algorithm
- **Pin**: Handles secure PIN hashing and verification

## 📈 Error Handling

All errors return standardized responses:

```json
{
  "success": false,
  "message": "Error description",
  "data": null,
  "errors": [
    "Detailed error 1",
    "Detailed error 2"
  ],
  "timestamp": "2026-01-11T12:00:00Z"
}
```

### HTTP Status Codes
- `200 OK` - Success
- `400 Bad Request` - Validation errors, business rule violations
- `401 Unauthorized` - Invalid session or credentials
- `403 Forbidden` - Card blocked
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Unexpected errors

## 🔄 Migration Commands

```bash
# Navigate to backend directory
cd backend

# Create migration
dotnet ef migrations add MigrationName -p ATM.Infrastructure -s ATM.API

# Update database
dotnet ef database update -p ATM.Infrastructure -s ATM.API

# Drop database
dotnet ef database drop -p ATM.Infrastructure -s ATM.API

# Remove last migration
dotnet ef migrations remove -p ATM.Infrastructure -s ATM.API
```

## 📁 Project Structure

```
backend/
├── ATM-Banking-System.sln
├── ATM.Domain/               # Business logic layer
├── ATM.Application/          # Application services layer
├── ATM.Infrastructure/       # Data access layer
├── ATM.API/                  # Presentation layer
└── ATM.Tests/                # Unit tests (new)
```


## � Technology Stack

### Backend
- **Framework**: ASP.NET Core 9
- **Language**: C# 13
- **Database**: SQL Server / LocalDB
- **ORM**: Entity Framework Core 9
- **Validation**: FluentValidation v12
- **Testing**: xUnit v2.9.2 with Moq v4.20.70
- **Code Coverage**: Coverlet v6.0.2
- **Security**: BCrypt.NET
- **API Versioning**: Microsoft.AspNetCore.Mvc.Versioning

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router v7
- **Form Management**: React Hook Form v7 + Zod
- **HTTP Client**: Axios v1.14
- **Icons**: Lucide React v1.7
- **Type Validation**: Zod v4

## 📚 Additional Resources

### Architecture & Patterns
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code-a/9780136083238/)

### Backend Documentation
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [FluentValidation](https://docs.fluentvalidation.net/)
- [xUnit](https://xunit.net/)
- [Moq](https://github.com/moq)

### Frontend Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Vite](https://vitejs.dev/)

## 📄 License

This project is provided as a reference implementation for educational purposes.

---

**Built with ❤️ following Clean Architecture principles for production-ready FinTech applications.**

**Last Updated**: April 2, 2026 | **Version**: 1.0.0
