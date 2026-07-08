import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import '../assets/css/UserRegistrationForm.css';
import {
    FaUsers,
    FaUser,
    FaEnvelope,
    FaLock,
    FaUserTag,
    FaUserPlus,
    FaUserEdit,
    FaSignInAlt,
    FaArrowLeft
} from "react-icons/fa";
import { MdAdminPanelSettings, MdSchool } from "react-icons/md";

const UserRegistrationForm = ({ acceptData, sendDataToForm, handleEditUser, goToLogin, showUserList }) => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        if (sendDataToForm) {
            setForm(sendDataToForm);
        }
    }, [sendDataToForm]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Basic validation
        if (!form.name || !form.email || !form.password || !form.role) {
            toast.error("Please fill in all fields");
            setIsLoading(false);
            return;
        }

        // Simulate async operation
        setTimeout(() => {
            if (sendDataToForm) {
                handleEditUser(form);
                toast.success("User updated successfully!");
            } else {
                acceptData(form);
                toast.success("User registered successfully!");
            }

            setForm({ name: "", email: "", password: "", role: "" });
            setIsLoading(false);
        }, 500);
    };

    const isEditMode = !!sendDataToForm;

    return (
        <div className="register-wrapper">
            <div className="register-container">
                {/* Header with navigation */}
                <div className="register-header">
                    <div className="register-icon">
                        {isEditMode ? <FaUserEdit /> : <FaUserPlus />}
                    </div>
                    <h1>
                        {isEditMode ? "Update User" : "Create Account"}
                    </h1>
                    <p>
                        {isEditMode
                            ? "Update user information"
                            : "Fill in the details to register"}
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="register-nav">
                    {!isEditMode && (
                        <span
                            className="nav-link table-link"
                            onClick={showUserList}
                        >
                            <FaUsers /> View Users
                        </span>
                    )}
                    {isEditMode && (
                        <span
                            className="nav-link back-link"
                            onClick={() => {
                                setForm({ name: "", email: "", password: "", role: "" });
                                // If you have a way to clear edit mode
                            }}
                        >
                            <FaArrowLeft /> Back
                        </span>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                    {/* Name Field */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaUser className="label-icon" />
                            Full Name
                        </label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                value={form.name}
                                name="name"
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaEnvelope className="label-icon" />
                            Email Address
                        </label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                value={form.email}
                                name="email"
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaLock className="label-icon" />
                            Password
                        </label>
                        <div className="input-wrapper">
                            <div className="input-icon">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                value={form.password}
                                name="password"
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="form-input"
                            />
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="form-group">
                        <label className="form-label">
                            <FaUserTag className="label-icon" />
                            Select Role
                        </label>
                        <div className="role-group">
                            <label className={`role-option ${form.role === "admin" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={form.role === "admin"}
                                    onChange={handleChange}
                                />
                                <MdAdminPanelSettings className="role-icon" />
                                <span>Admin</span>
                            </label>

                            <label className={`role-option ${form.role === "faculty" ? "selected" : ""}`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="faculty"
                                    checked={form.role === "faculty"}
                                    onChange={handleChange}
                                />
                                <MdSchool className="role-icon" />
                                <span>Faculty</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className={`register-btn ${isLoading ? "loading" : ""}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                {isEditMode ? <FaUserEdit /> : <FaUserPlus />}
                                {isEditMode ? "Update User" : "Register"}
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <div className="login-section">
                        <p className="login-text">
                            {isEditMode ? "Done editing?" : "Already have an account?"}{" "}
                            <span
                                className="login-link"
                                onClick={goToLogin}
                            >
                                <FaSignInAlt /> {isEditMode ? "Back to Login" : "Login"}
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserRegistrationForm;