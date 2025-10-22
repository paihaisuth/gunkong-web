# Gunkong P2P Exchange Middleman 🚀

A secure peer-to-peer trading middleman platform built with Next.js 15, TypeScript, and Tailwind CSS. This platform serves as a trusted intermediary between buyers and sellers, handling payment verification and transaction approval to ensure safe P2P trading.

## ✨ Features

### 💳 Middleman Services

-   **Payment Verification**: Check and verify payments from buyers
-   **Transaction Approval**: Approve releases to sellers after payment confirmation
-   **Escrow Management**: Hold funds securely during transaction process
-   **Transaction Monitoring**: Track all payment statuses and approvals

### 🔒 Security & Trust

-   **User Authentication**: Secure login and registration system
-   **Transaction Safety**: Protected escrow system
-   **Payment Verification**: Secure payment confirmation process
-   **Activity Tracking**: Monitor all transaction activities

### 💼 User Experience

-   **Responsive Design**: Works seamlessly on all devices
-   **Dark/Light Theme**: Choose your preferred theme
-   **Thai Language Support**: Full localization for Thai users
-   **Simple Interface**: Clean and intuitive middleman dashboard

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) with App Router
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **UI Components**: [Radix UI](https://www.radix-ui.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **HTTP Client**: [Axios](https://axios-http.com/)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/)
-   **Validation**: [Zod](https://zod.dev/)
-   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/gunkong-web.git
    cd gunkong-web
    ```

2. **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Configure your environment variables:

    ```env
    NEXT_PUBLIC_API_URL=your_api_endpoint
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4. **Run the development server**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```

5. **Open your browser**

    Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Scheme

-   **Primary**: Green theme for a fresh and trustworthy feel
-   **Secondary**: Neutral grays for balance
-   **Accent**: Complementary colors for highlights
-   **Dark Mode**: Full dark theme support

### Components

Built with Radix UI primitives and custom styling:

-   Cards, Buttons, Forms
-   Dialogs, Dropdowns, Sheets
-   Navigation, Breadcrumbs
-   Badges, Icons, Layouts

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Using other package managers
yarn dev / pnpm dev / bun dev
```

## 🛡️ Security Features

-   **Input Validation**: All forms validated with Zod schemas
-   **Type Safety**: Full TypeScript coverage
-   **Secure Routing**: Protected routes and authentication
-   **Error Handling**: Comprehensive error management

## 🌍 Internationalization

-   **Thai Language**: Full Thai language support
-   **Date Formatting**: Localized date and time display
-   **Currency**: Thai Baht (฿) formatting
-   **Cultural Adaptation**: Thai-friendly UI/UX

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

-   📧 Email: paihaisuth@gmail.com
-   💬 GitHub Issues: [Create an issue](https://github.com/your-username/gunkong-web/issues)

---

Built with ❤️ for secure P2P trading with trusted middleman services
