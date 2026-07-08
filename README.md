# 🎓 Student Management System

A simple Student Management System built with **React**, **JSON Server**, **Axios**, and **React Toastify**. This project implements **Role-Based Access Control (RBAC)** where **Admin** and **Faculty** have different permissions.

---

## 🚀 Features

### 🔐 Authentication
- User Registration
- User Login
- Role-based Login
- Toast notifications for all actions

---

## 👨‍💼 Admin Features

- Register new users
- View all users
- Update user details
- Delete users
- Switch between Registration Form and User Table

---

## 👨‍🏫 Faculty Features

- Add Student
- View Student List
- Update Student Details
- Delete Student
- Automatically calculate:
  - Total Marks
  - Percentage
- Switch between Student Form and Student Table

---

## 🛠 Technologies Used

- React.js
- Axios
- JSON Server
- React Toastify
- React Icons
- CSS3

---

## 📂 Project Structure

```
src/
│
├── components/
│   ├── Login.jsx
│   ├── UserRegistrationForm.jsx
│   ├── StdRegistrationForm.jsx
│   ├── ShowAllUsers.jsx
│   └── ShowAllStd.jsx
│
├── assets/
│   └── css/
│       ├── Login.css
│       ├── UserRegistrationForm.css
│       ├── StdRegistrationForm.css
│       └── ShowAllStd.css
│
├── service.js
├── App.jsx
└── main.jsx
```

---

## 📦 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/student-management-system.git
```

Go to project folder

```bash
cd student-management-system
```

Install dependencies

```bash
npm install
```

---

## ▶ Run React App

```bash
npm run dev
```

---

## ▶ Run JSON Server

Install JSON Server (if not installed)

```bash
npm install -g json-server
```

Start JSON Server

```bash
json-server --watch db.json --port 3000
```

---

## 📁 Sample db.json

```json
{
  "users": [],
  "students": []
}
```

---

## 👤 Roles

### Admin

- Register User
- Login
- Add User
- Update User
- Delete User
- View User Table

---

### Faculty

- Login
- Add Student
- Update Student
- Delete Student
- View Student Table

---

## ✨ Functionalities

### User Registration

- Name
- Email
- Password
- Role Selection (Admin / Faculty)

---

### Student Registration

- PRN
- Name
- Email
- Marks 1
- Marks 2
- Marks 3

Automatically calculates

- Total
- Percentage

---

## 🔔 Toast Notifications

- User Registered Successfully
- Login Successful
- Invalid Login
- Student Added
- Student Updated
- Student Deleted
- User Updated
- User Deleted

---

## 🎨 UI Features

- Responsive Forms
- Modern Tables
- React Icons
- Edit/Delete Icons
- Add Student Icon
- View Table Links
- Back to Form Link

---

## 📷 Screens

- Login Page
- Registration Page
- User Management
- Student Registration
- Student Table

---

## 📌 Future Improvements

- Protected Routes
- JWT Authentication
- Local Storage Session
- Search Student
- Filter by Role
- Pagination
- Sorting
- Dashboard
- Profile Page
- Forgot Password
- Responsive Mobile UI

---

## 👨‍💻 Author

**Harshad Shinde**

GitHub: https://github.com/yourusername

---

## 📄 License

This project is developed for learning purposes.