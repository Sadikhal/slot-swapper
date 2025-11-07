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


### 🧰 Steps to Run

```bash
# 1️⃣ Clone repository
git clone <repository-url>
cd slot-swapper

# 2️⃣ Backend setup
cd server
npm install

# 3️⃣ Frontend setup
cd ../client
npm install

# 4️⃣ Run both (from root)
npm run dev

# OR run backend manually
cd server
node app.js
```

---

## 🌐 Access the Application

| Service                     | URL                                                                              |
| :-------------------------- | :------------------------------------------------------------------------------- |
| 🖥️ **Frontend**            | [https://slot-swapper-3m9e.onrender.com](https://slot-swapper-3m9e.onrender.com) |
| ⚙️ **Backend API Base URL** | `https://slot-swappers.onrender.com/api`                                         |

---

## 🔐 Demo Access (For HR Evaluation)

> To make evaluation simple, you can log in directly — no signup required.

**🔗 Login Page:**
👉 [https://slot-swapper-3m9e.onrender.com/auth/login](https://slot-swapper-3m9e.onrender.com/auth/login)

**🧑‍💻 Credentials:**

```
Email: sadikhalipv@gmail.com
Password: Slot@098
```

> (Note: “S” in **Slot** is capital.)

Once logged in, you can explore the full **SlotSwapper Dashboard**, **Event Management**, **Swap Marketplace**, and **Requests System** instantly.

---

## 🗄 Database Schema

<details>
<summary><b>👤 User Model</b></summary>

```javascript
{
  name: String,
  email: String, // unique
  password: String, // hashed
  createdAt: Date
}
```

</details>

<details>
<summary><b>🗓️ Event / Slot Model</b></summary>

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

</details>

<details>
<summary><b>🔄 SwapRequest Model</b></summary>

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

</details>

---

## 🔌 API Endpoints

<details>
<summary><b>🔑 Authentication</b></summary>

* `POST /api/auth/register` – Register new user
* `POST /api/auth/login` – Login user
* `GET /api/auth/user` – Get current logged user
* `POST /api/auth/logout` – Logout current user

</details>

<details>
<summary><b>🗓️ Events</b></summary>

* `GET /api/event` – Get user’s events
* `POST /api/event` – Create new event
* `PUT /api/event/:id` – Update event
* `DELETE /api/event/:id` – Delete event

</details>

<details>
<summary><b>🔄 Swap System</b></summary>

* `GET /api/swap-request` – Get swappable slots from other users
* `POST /api/swap-request` – Create swap request
* `POST /api/swap-request/:requestId` – Respond (accept/reject)
* `GET /api/swap-request/req-slots` – View incoming/outgoing requests

</details>

---

## 🎯 Core Logic

1. User marks a slot as **SWAPPABLE**
2. Another user browses available slots
3. Initiates a **swap request**
4. Receiver **accepts or rejects**
5. On acceptance, times are **automatically exchanged**
6. User can search and sort the events
   

---

## 🧠 State Management

* Global state handled with **Redux**
* **Optimistic updates** for instant feedback

---

## 🚀 Deployment

| Platform              | Command                                                |
| :-------------------- | :----------------------------------------------------- |
| **Backend (Render)**  | Build: `npm install` → Start: `node app.js`            |
| **Frontend (Render)** | Build: `cd client && npm run build` → Output: `client` |

---

## 📱 Usage Guide

1. 🧾 **Login or Register**
2. ➕ **Create Events**
3. ♻️ **Mark as Swappable**
4. 🔍 **Browse Marketplace**
5. 🔁 **Request Swaps**
6. ✅ **Accept/Reject Requests**
7. 🔎 **Search or Sort Events**
8. 🪄 **Automatic Calendar Updates**

---

## 🎨 UI Components

Built with **Shadcn/ui** & **TailwindCSS**:

* ✨ Form validation
* 💬 Toast notifications
* 🪟 Modal dialogs for swap confirmation
* 🗓️ Responsive calendar view
* 🎨 Clean, modern design

---

## 🔒 Security Features

* 🔐 Password hashing (bcryptjs)
* 🕒 JWT token expiration
* 🛡️ Protected API routes
* 🧹 Input validation & sanitization
* 🌍 CORS enabled

---

## 👨‍💻 Developer

Built with ❤️ using the **MERN Stack**
for **ServiceHive Full Stack Intern Technical Challenge**

---

⭐ **If you liked this project**, give it a star on GitHub — it helps a lot!

```
