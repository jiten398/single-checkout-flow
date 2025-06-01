# eCommerce Flow - Next.js + MongoDB

A full-stack eCommerce application built with Next.js 14, MongoDB, and TypeScript. This project simulates a complete product purchase journey with transaction handling, email notifications, and dynamic form validations.

## 🚀 Features

- **Product Landing Page**
  - Dynamic product display with variants (colors/sizes)
  - Real-time price calculation
  - Inventory tracking
  - Beautiful UI with circular color selectors

- **Checkout Process**
  - Comprehensive form validation
  - Real-time order summary
  - Card number validation with Luhn algorithm
  - Future date validation for card expiry

- **Transaction Simulation**
  - User-controlled transaction outcomes (Approved/Declined/Error)
  - Success animation for approved transactions
  - Different UI states for each transaction result

- **Order Management**
  - Unique order ID generation
  - Database persistence
  - Email notifications via Mailtrap
  - Order confirmation page with full details

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Framer Motion** - Animations

### Backend
- **MongoDB** - Database
- **Mongoose** - ODM
- **Nodemailer** - Email service
- **Next.js API Routes** - Backend endpoints

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Mailtrap account (for email testing)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd <your_project_folder_name>
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ecommerce-flow
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce-flow

# Mailtrap Credentials (Get from https://mailtrap.io)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_mailtrap_username
MAILTRAP_PASS=your_mailtrap_password

# Optional: Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
ecommerce-flow/
├── app/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts         # Process orders
│   │   ├── orders/
│   │       └── route.ts         # Fetch orders
│   │   
│   ├── checkout/
│   │   └── page.tsx             # Checkout page
│   ├── thank-you/
│   │   └── [id]/
│   │       └── page.tsx         # Order confirmation
│   ├── page.tsx                 # Landing page
│   └── layout.tsx               # Root layout
├── components/
│   └── TransactionModal.tsx     # Payment simulation modal
├── lib/
│   ├── mongodb.ts               # Database connection
│   ├── mailer.ts                # Email service
│   └── validations.ts           # Zod schemas
├── models/
│   ├── Order.ts                 # Order schema
│   ├── Product.ts               # Product schema
├── public/
│   └── images/                  # Product images
└── types/
    └── global.d.ts              # Global type definitions
```

## 🔌 API Endpoints

### Products
- `GET /api/products/featured` - Get featured product with variants

### Orders
- `POST /api/checkout` - Create new order
- `GET /api/orders?orderId={id}` - Get order details


## 🧪 Testing the Flow

1. **Landing Page**
   - Select product color variant
   - Choose size
   - Adjust quantity
   - Click "Buy Now"

2. **Checkout Page**
   - Fill in billing information
   - Enter payment details:
     - Card: Any 16 digits (e.g., 4532015112830366)
     - Expiry: Any future MM/YY
     - CVV: Any 3 digits
   - Click "Complete Order"

3. **Transaction Simulation**
   - Choose transaction outcome:
     - ✅ **Approved** - Successful order
     - ⚠️ **Declined** - Card declined
     - ❌ **Error** - Gateway error

4. **Thank You Page**
   - View order confirmation
   - Check email in Mailtrap inbox

## 📧 Email Configuration

The project uses Mailtrap for email testing in development:

1. Sign up at [Mailtrap.io](https://mailtrap.io)
2. Create an inbox
3. Copy SMTP credentials to `.env.local`
4. Emails will appear in your Mailtrap inbox

## 🎨 Customization


### Modifying Validations
Edit `/lib/validations.ts` to change form validation rules.

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy



## 🐛 Troubleshooting

### Common Issues

1. **"Order not found" error**
   - Check MongoDB connection
   - Verify order ID in URL matches database

2. **Email not sending**
   - Verify Mailtrap credentials
   - Check console for error logs

3. **Database connection failed**
   - Ensure MongoDB is running
   - Check MONGODB_URI format


---
