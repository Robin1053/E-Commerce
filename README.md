# 🛒 E-Commerce Platform

A modern, full-stack e-commerce application built with Next.js 15, React 19, and Prisma. Features a complete shopping experience with user authentication, product management, shopping cart functionality, and Stripe payment integration.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat-square&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

- 🔐 **Authentication System**
  - Email/Password authentication
  - OAuth providers support
  - Passkey support for passwordless login
  - Email verification
  - Profile management with avatar uploads

- 🛍️ **Product Management**
  - Product catalog with categories
  - Product search and filtering
  - Detailed product pages
  - Image management

- 🛒 **Shopping Cart**
  - Add/remove products
  - Quantity management
  - Persistent cart across sessions
  - Real-time cart updates

- 💳 **Payment Integration**
  - Stripe payment processing
  - Secure checkout flow
  - Order history tracking
  - Customer management

- 🎨 **Modern UI/UX**
  - Material-UI (MUI) components
  - Responsive design
  - Tailwind CSS styling
  - Custom theme support

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15.5 (App Router)
- **UI Library:** React 19.2
- **Component Library:** Material-UI (MUI) 7.3
- **Styling:** Tailwind CSS 4, Emotion
- **Date Handling:** Day.js
- **Icons:** MUI Icons Material

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma 6.19
- **Authentication:** Better Auth 1.3
- **Payment:** Stripe 19.3

### Development
- **Language:** TypeScript 5
- **Linting:** ESLint 9
- **Package Manager:** npm/pnpm/yarn

## 📋 Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- Stripe account (for payment processing)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Robin1053/E-Commerce.git
   cd E-Commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"
   
   # Better Auth
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
E-Commerce/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/
│   ├── imgs/user/            # User profile images
│   └── Produkts/             # Product images
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── Products/         # Product pages
│   │   └── your-orders/      # Order history
│   ├── Components/           # React components
│   │   ├── auth/             # Auth components
│   │   └── users/            # User components
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts           # Auth configuration
│   │   ├── auth-client.ts    # Auth client
│   │   └── DB/Prisma.ts      # Prisma client
│   ├── theme/                # MUI theme configuration
│   └── types/                # TypeScript type definitions
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind configuration
└── tsconfig.json             # TypeScript configuration
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **User** - User accounts and profiles
- **Session** - Active user sessions
- **Account** - OAuth and credential accounts
- **Product** - Product catalog
- **Category** - Product categories
- **Cart** - Shopping carts
- **CartItem** - Cart line items
- **Passkey** - WebAuthn passkeys for passwordless auth

## 🔒 Authentication

The app uses Better Auth with support for:
- Email/password authentication
- OAuth providers
- WebAuthn/Passkey support
- Email verification
- Session management

## 💳 Payment Processing

Stripe integration includes:
- Product and price synchronization
- Secure checkout sessions
- Customer management
- Webhook handling for payment events

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npx prisma migrate dev      # Run migrations in development
npx prisma generate         # Generate Prisma Client
npx prisma studio          # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Robin Eberle**
- Email: eberle_robin@gmx.de
- GitHub: [@Robin1053](https://github.com/Robin1053)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Prisma](https://www.prisma.io/)
- [Stripe](https://stripe.com/)
- [Better Auth](https://www.better-auth.com/)

---

Made with ❤️ by Robin Eberle
