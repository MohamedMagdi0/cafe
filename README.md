# Cafe Management System

A full-stack cafe management web application built with Next.js, supporting multiple languages (English and Arabic), table management, order tracking, and financial analytics.

## Features

### User Roles

- **Admin**: Full access to all features including analytics, menu management, and outcome tracking
- **Waiter**: Can manage tables, take orders, and settle bills

### Core Functionality

- **Table Management**: Create tables with custom labels, track orders per table
- **Order Taking**: Add multiple orders (tea, coffee, shisha, etc.) to tables with quantities
- **Bill Settlement**:
  - Settle individual items (marks them as paid with visual strikethrough)
  - Settle entire table bills
  - Reopen settled tables for new guests
- **Multi-language Support**: Switch between English and Arabic for the entire interface
- **Financial Tracking**:
  - Daily income tracking from table settlements
  - Outcome tracking for purchases/expenses
  - Net profit calculation (income in green, outcome in red)
  - Retrospective analytics (today, this week, this month)

### Admin Features

- View comprehensive analytics dashboard
- Add/edit menu items (with bilingual names)
- Track income and outcomes
- View transaction history
- Period-based reporting (day/week/month)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

**Admin:**

- Username: `admin`
- Password: `admin123`

**Waiter:**

- Username: `waiter1`
- Password: `waiter123`

## Usage

### For Waiters

1. **Login** with waiter credentials
2. **Add Tables**: Click "Add Table" and enter a custom label
3. **Take Orders**: Click on an active table, select menu items, and add quantities
4. **Settle Items**: Mark individual items as settled (they'll be crossed out)
5. **Settle Table**: Mark entire table as settled when all items are paid
6. **Reopen Table**: After settlement, reopen the table for new guests

### For Admins

1. **Login** with admin credentials
2. **Dashboard**: View daily statistics and manage tables
3. **Analytics Page**: Access detailed financial reports
4. **Menu Management**: Add new items with English and Arabic names
5. **Outcome Tracking**: Record expenses and purchases
6. **Period Selection**: View data for today, this week, or this month

## Project Structure

```
cafe/
├── app/
│   ├── api/          # API routes
│   ├── admin/        # Admin dashboard
│   ├── dashboard/    # Main dashboard
│   ├── login/        # Login page
│   └── page.tsx      # Root page (redirects)
├── components/       # React components
├── lib/             # Utilities (auth, db, i18n)
├── types/           # TypeScript types
└── data/            # JSON data storage (auto-created)
```

## Data Storage

The application uses JSON files for data storage (located in `/data` directory):

- `users.json` - User accounts
- `tables.json` - Table and order data
- `menu.json` - Menu items
- `transactions.json` - Financial transactions

**Note**: For production use, consider migrating to a proper database (PostgreSQL, MongoDB, etc.)

## Language Support

The application supports:

- **English** (default)
- **Arabic** (RTL layout)

Switch languages using the language switcher in the header. Language preference is saved in localStorage.

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **date-fns** - Date manipulation
- **uuid** - Unique ID generation

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication with JWT tokens
- Receipt printing
- Inventory management
- Employee shift tracking
- Advanced reporting and charts

## License

This project is open source and available for use.
