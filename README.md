# SlotSwapper -  Time Slot Swap Application

![SlotSwapper](https://img.shields.io/badge/MERN-Stack-brightgreen) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-green) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

A full-stack web application that enables users to swap busy time slots with each other through a peer-to-peer scheduling system.

## 🚀 Features

### Core Functionality
- **User Authentication** - Secure JWT-based signup/login system
- **Event Management** - Create, view, and manage events
- **Slot Swapping** - Mark slots as swappable and request swaps with other users
- **Notifications** - Instant updates on swap requests and responses
- **Dynamic State Management** - Seamless UI updates without page refreshes

### User Experience
- **Intuitive Dashboard** - Clean calendar view with user events
- **Marketplace** - Browse available swappable slots from other users
- **Request Management** - Handle incoming and outgoing swap requests
- **Responsive Design** - Optimized for desktop and mobile devices
- **Advanced Searching** - Searching of pages and events


## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautifully designed components
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Redux** - state management

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3002

# MongoDB
MONGO_URL=mongodb://localhost:27017/slotswapper
# or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/slotswapper

# JWT
JWT_SECRET=your_jwt_secret_key_here

#  Client URL (for CORS)
ORIGIN= http://localhost:5173
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slot-swapper
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
  
   ```

4. **Start the development servers**

   **Run  frontend**
   ```bash
   # From root directory - starts both servers
   npm run dev
   ```

   ** Run servers **
   ```bash
   # Terminal 1 - Start backend
   node app.js
   ```

5. **Access the application**
   - Frontend: https://slot-swapper-3m9e.onrender.com
   - Backend API: https://slot-swappers.onrender.com/api

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Event/Slot Model
```javascript
{
  title: String,
  startingTime: String,
  endingTime: String,
  desc: String,
  status: Enum ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
  userId: ObjectId (ref: 'User'),
  createdAt: Date
}
```

### SwapRequest Model
```javascript
{
  requesterId: ObjectId (ref: 'User'),
  recipientId: ObjectId (ref: 'User'),
  requesterSlotId: ObjectId (ref: 'Event'),
  recipientSlotId: ObjectId (ref: 'Event'),
  status: Enum ['PENDING', 'ACCEPTED', 'REJECTED'],
  createdAt: Date,
  respondedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - logout the current user
  

### Events
- `GET /api/event` - Get user's events
- `POST /api/event` - Create new event
- `PUT /api/event/:id` - Update event
- `DELETE /api/event/:id` - Delete event
### Swap System
- `GET /api/swap-request` - Get available slots from other users
- `POST /api/swap-request` - Create swap request
- `POST /api/swap-request/:requestId` - Respond to swap request
- `GET /api/swap-request/req-slots` - Get swap requests

## 🎯 Core Features Implementation

### Authentication Flow
- JWT tokens stored in HTTP-only cookies
- Protected routes with authentication middleware


### Swap Logic
1. **Slot Marking**: Users mark busy slots as "swappable"
2. **Discovery**: Browse other users' swappable slots
3. **Request**: Initiate swap with own swappable slot
4. **Response**: Accept/reject incoming requests
5. **Execution**: Automatic calendar updates on acceptance

### State Management
- React redux for global state
- Optimistic updates for better UX

## 🚀 Deployment

### Backend Deployment (Example: Render)
1. Build command: `npm install`
2. Start command: `node app.js`
3. Environment variables in deployment platform

### Frontend Deployment (Example: render)
1. Build command: `cd client && npm run build`
2. Output directory: `client`
3. Environment variables for API URL



## 📱 Usage Guide

1. **Sign Up/Login**: Create an account or login
2. **Add Events**: Create busy time slots in your calendar
3. **Mark Swappable**: Click "Make Swappable" on events you're willing to swap
4. **Browse Marketplace**: View other users' available slots
5. **Request Swap**: Offer your slot in exchange for someone else's
6. **Manage Requests**: Accept or reject incoming swap proposals
7. **Searching and sorting**: Events can sorting and searching with any field like title or desc 
8. **Automatic Updates**: Calendars update instantly when swaps are accepted

## 🎨 UI Components

Built with Shadcn/ui components including:
- Custom form components with validation
- Modal dialogs for swap requests
- Toast notifications for user feedback
- Responsive calendar views
- Clean, modern design system

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token expiration
- Protected API routes
- Input validation and sanitization
- CORS configuration


## 👨‍💻 Developer

Built with ❤️ using the MERN stack for ServiceHive Full Stack Intern technical challenge.

---
