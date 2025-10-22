# P2P Exchange 🚀

A modern peer-to-peer trading platform built with Next.js 15, TypeScript, and Tailwind CSS. This platform enables users to create trading rooms, buy and sell items directly with each other in a secure and user-friendly environment.

## ✨ Features

### 🏪 Trading Rooms
- **Create Trading Rooms**: Set up rooms to sell your items
- **Browse Available Rooms**: Discover items from other traders
- **Room Management**: Track your trading activities
- **Real-time Updates**: Get instant updates on room status

### 🔒 Security & Trust
- **User Authentication**: Secure login and registration system
- **Transaction Safety**: Protected trading environment
- **User Verification**: Build trust in the community
- **Activity Tracking**: Monitor all trading activities

### 💼 User Experience
- **Responsive Design**: Works seamlessly on all devices
- **Dark/Light Theme**: Choose your preferred theme
- **Thai Language Support**: Full localization for Thai users
- **Intuitive Navigation**: Simple and clean interface

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

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

## 📁 Project Structure

```
gunkong-web/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (roots)/           # Main application pages
│   │   │   ├── rooms/         # Trading rooms
│   │   │   ├── trading-history/ # Trading history
│   │   │   └── layout.tsx     # Main layout
│   │   ├── globals.css        # Global styles
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── Icon.tsx          # Icon component
│   │   └── provider/         # Context providers
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   ├── services/             # API services
│   ├── stores/               # State management
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── components.json           # shadcn/ui config
```

## 🎨 Design System

### Color Scheme
- **Primary**: Green theme for a fresh and trustworthy feel
- **Secondary**: Neutral grays for balance
- **Accent**: Complementary colors for highlights
- **Dark Mode**: Full dark theme support

### Components
Built with Radix UI primitives and custom styling:
- Cards, Buttons, Forms
- Dialogs, Dropdowns, Sheets
- Navigation, Breadcrumbs
- Badges, Icons, Layouts

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

## 📱 Pages & Features

### 🏠 Homepage (`/`)
- Dashboard overview
- Quick access to main features
- Recent activity summary

### 🏪 Trading Rooms (`/trading-rooms`)
- Browse all available rooms
- Create new trading rooms
- Filter and search functionality
- Room status management

### 📚 Trading History (`/trading-history`)
- Complete transaction history
- Order status tracking
- Transaction details

### 🔐 Authentication (`/login`, `/register`)
- Secure user authentication
- Account registration
- Password management

## 🛡️ Security Features

- **Input Validation**: All forms validated with Zod schemas
- **Type Safety**: Full TypeScript coverage
- **Secure Routing**: Protected routes and authentication
- **Error Handling**: Comprehensive error management

## 🌍 Internationalization

- **Thai Language**: Full Thai language support
- **Date Formatting**: Localized date and time display
- **Currency**: Thai Baht (฿) formatting
- **Cultural Adaptation**: Thai-friendly UI/UX

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
- 📧 Email: support@p2pexchange.com
- 💬 GitHub Issues: [Create an issue](https://github.com/your-username/gunkong-web/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Vercel](https://vercel.com/) for hosting and deployment

---

Built with ❤️ for the P2P trading community
