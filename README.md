# ShopHub E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 13+, TypeScript, and Firebase. ShopHub provides a seamless shopping experience with features like real-time product updates, user authentication, and a responsive design.

## 🚀 Features

- **Modern Tech Stack**: Built with Next.js 13+, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive UI that works across all devices
- **Real-time Updates**: Firebase integration for real-time product and inventory management
- **Authentication**: Secure user authentication system
- **Shopping Cart**: Full-featured shopping cart with persistent storage
- **Wishlist**: Save items for later with a personalized wishlist
- **Product Management**:
  - Product categorization
  - Search functionality
  - Filtering and sorting options
  - Product reviews and ratings
- **User Profiles**: Customizable user profiles and order history
- **Admin Dashboard**: Comprehensive admin interface for product and order management
- **Performance Optimized**: Built with performance best practices

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 13+
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: React Context
- **Backend & Database**: Firebase
- **Authentication**: Firebase Auth
- **Image Storage**: Firebase Storage
- **Performance Monitoring**: Custom performance monitoring

## 📦 Project Structure

```
├── app/                  # Next.js 13+ app directory
│   ├── admin/           # Admin dashboard
│   ├── cart/            # Shopping cart
│   ├── category/        # Category pages
│   ├── product/         # Product pages
│   └── profile/         # User profile
├── components/          # Reusable components
│   ├── ui/             # UI components
│   └── ...             # Other components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/               # Utility functions and services
└── public/            # Static assets
```

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChaudaryAbdullah/ShopHub-eccommerce.git
   cd ShopHub-eccommerce
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your Firebase configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌟 Key Features Explained

### Authentication

- Email/Password authentication
- Social media login options
- Protected routes for authenticated users

### Product Management

- Real-time product updates
- Advanced filtering and sorting
- Product categories and subcategories
- Product reviews and ratings system

### Shopping Experience

- Intuitive shopping cart
- Wishlist functionality
- Order tracking
- Responsive product search

### Admin Features

- Product management dashboard
- Order management
- User management
- Analytics and reporting

## 🔧 Performance Optimization

The project includes several performance optimization features:

- Image optimization
- Code splitting
- Performance monitoring
- Lazy loading
- Caching strategies

## 📱 Responsive Design

ShopHub is built with a mobile-first approach and is fully responsive across:

- Mobile devices
- Tablets
- Desktop computers
- Large screens

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Chaudary Abdullah** - _Initial work_ - [ChaudaryAbdullah](https://github.com/ChaudaryAbdullah)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Shadcn UI](https://ui.shadcn.com/)
