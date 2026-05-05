 # Full-Stack E-Commerce Platform

A production-grade full-stack e-commerce system featuring a cross-platform mobile client, web-based admin dashboard, and scalable backend API — all deployed and integrated with modern tooling.

## Demo

Admin dashboard: https://youtu.be/1WndrCsXcJ8 

Mobile: https://youtube.com/shorts/BaIMuuqun2s
---

## Overview

This project consists of three main applications:

- **Mobile App** – Built with React Native (Expo) for customers
- **Admin Dashboard** – Built with React (Vite) for store management
- **Backend API** – RESTful API built with Node.js & Express

The system supports end-to-end e-commerce workflows including authentication, product management, cart handling, and secure payments.

---

## Tech Stack

### Frontend (Mobile)

- React Native (Expo)
- Nativewind CSS
- TanStack Query (data fetching & caching)

### Frontend (Admin Dashboard)

- React (Vite)
- Tailwind CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB (Mongoose)

### Authentication

- Clerk (role-based access control)

### Payments

- Stripe (secure checkout flow)

### DevOps & Tooling

- Sentry (error monitoring)
- Inngest (background jobs & async workflows)
- Sevalla (deployment)

## Key Features

### Customer Mobile App

- Secure authentication via Clerk
- Browse and search products
- Add/remove items from cart
- Wishlist functionality
- Place orders with Stripe checkout
- Product reviews and ratings system
- View order history

### Admin Dashboard

- Full product CRUD management
- Order tracking and status updates
- Role-based admin access control
- Centralized store management interface

### Backend API

- Designed 5+ RESTful resource groups:
  - Products
  - Users
  - Carts
  - Wishlists
  - Orders

- Full CRUD operations across all resources
- Secure route protection using Clerk middleware
- Structured, scalable API architecture

## Architecture Highlights

### Role-Based Access Control

Clerk enforces strict separation between customer and admin permissions.

### Efficient Data Layer

TanStack Query enables caching, background refetching, and optimized API usage on the client side.

### End-to-End Payments

Stripe integration handles secure checkout, payment intents, and order confirmation.

### Scalable Database Design

MongoDB schemas model relationships between users, products, carts, and orders.

### Production Monitoring

Sentry captures runtime errors and improves system reliability.

### Async Job Processing

Inngest manages background workflows (e.g., order processing, events).
