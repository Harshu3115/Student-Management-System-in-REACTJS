import React, { useEffect, useState } from 'react';
import '../assets/css/StdRegistrationForm.css';
import {
    FaTable,
    FaUserGraduate,
    FaIdCard,
    FaUser,
    FaEnvelope,
    FaBook,
    FaCalculator,
    FaPlus,
    FaEdit,
    FaArrowLeft,
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle
} from "react-icons/fa";
import { MdGrade, MdPercent } from "react-icons/md";

const StdRegistrationForm = ({
    acceptStudentFormData,
    sendDataToStdForm,
    handleEditStd,
    setShowStudentTable,
    showStudentList
}) => {
    const [form, setForm] = useState({
        prn: "",
        name: "",
        email: "",
        m1: "",
        m2: "",
        m3: "",
        total: "",
        percentage: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [fieldStatus, setFieldStatus] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate marks fields
        if (['m1', 'm2', 'm3'].includes(name)) {
            if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setFieldStatus({ ...fieldStatus, [name]: 'valid' });
                setErrors({ ...errors, [name]: '' });
            } else {
                setFieldStatus({ ...fieldStatus, [name]: 'invalid' });
                setErrors({ ...errors, [name]: 'Marks must be between 0 and 100' });
            }
        }

        setForm({ ...form, [name]: value });
    };

    useEffect(() => {
        if (sendDataToStdForm) {
            setForm(sendDataToStdForm);
            // Auto-calculate total and percentage when editing
            if (sendDataToStdForm.m1 && sendDataToStdForm.m2 && sendDataToStdForm.m3) {
                const total = Number(sendDataToStdForm.m1) + Number(sendDataToStdForm.m2) + Number(sendDataToStdForm.m3);
                const percentage = (total / 300) * 100;
                setForm(prev => ({
                    ...prev,
                    total: total,
                    percentage: percentage.toFixed(2)
                }));
            }
        }
    }, [sendDataToStdForm]);

    const validateForm = () => {
        const newErrors = {};

        if (!form.prn.trim()) newErrors.prn = 'PRN is required';
        else if (form.prn.trim().length < 5) newErrors.prn = 'PRN must be at least 5 characters';

        if (!form.name.trim()) newErrors.name = 'Name is required';
        else if (form.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';

        if (!form.m1) newErrors.m1 = 'Marks 1 is required';
        else if (Number(form.m1) < 0 || Number(form.m1) > 100) newErrors.m1 = 'Marks must be between 0 and 100';

        if (!form.m2) newErrors.m2 = 'Marks 2 is required';
        else if (Number(form.m2) < 0 || Number(form.m2) > 100) newErrors.m2 = 'Marks must be between 0 and 100';

        if (!form.m3) newErrors.m3 = 'Marks 3 is required';
        else if (Number(form.m3) < 0 || Number(form.m3) > 100) newErrors.m3 = 'Marks must be between 0 and 100';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.input-error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsLoading(true);

        const total = Number(form.m1) + Number(form.m2) + Number(form.m3);
        const percentage = (total / 300) * 100;

        const updatedForm = {
            ...form,
            total: total,
            percentage: percentage.toFixed(2),
            prn: form.prn.trim().toUpperCase()
        };

        // Simulate async operation
        setTimeout(() => {
            if (sendDataToStdForm) {
                handleEditStd(updatedForm);
            } else {
                acceptStudentFormData(updatedForm);
            }

            setForm({ prn: "", name: "", email: "", m1: "", m2: "", m3: "", total: "", percentage: "" });
            setErrors({});
            setFieldStatus({});
            setIsLoading(false);
        }, 500);
    };

    const isEditMode = !!sendDataToStdForm;
    const isFormValid = form.prn && form.name && form.email && form.m1 && form.m2 && form.m3;

    return (
        <div className="student-wrapper">
            <div className="student-container">
                {/* Header */}
                <div className="student-header">
                    <div className="student-icon">
                        {isEditMode ? <FaEdit /> : <FaUserGraduate />}
                    </div>
                    <h1>
                        {isEditMode ? "Update Student" : "Add New Student"}
                    </h1>
                    <p>
                        {isEditMode
                            ? "Update student information"
                            : "Fill in the details to add a new student"}
                    </p>
                </div>

                {/* Navigation */}
                <div className="student-nav">
                    <button
                        className="nav-btn table-view-btn"
                        onClick={showStudentList}
                    >
                        <FaTable /> View Students
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="student-form">
                    {/* PRN Field */}
                    <div className="form-row">
                        <div className="form-group full-width">
                            <label className="form-label">
                                <FaIdCard className="label-icon" />
                                PRN Number
                            </label>
                            <div className={`input-wrapper ${errors.prn ? 'error' : fieldStatus.prn === 'valid' ? 'success' : ''}`}>
                                <div className="input-icon">
                                    <FaIdCard />
                                </div>
                                <input
                                    type="text"
                                    value={form.prn}
                                    name="prn"
                                    onChange={handleChange}
                                    placeholder="e.g., 2024CS001"
                                    className="form-input"
                                />
                                {fieldStatus.prn === 'valid' && <FaCheckCircle className="input-status valid" />}
                                {errors.prn && <FaTimesCircle className="input-status invalid" />}
                            </div>
                            {errors.prn && <span className="error-message">{errors.prn}</span>}
                        </div>
                    </div>

                    {/* Name and Email */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                <FaUser className="label-icon" />
                                Full Name
                            </label>
                            <div className={`input-wrapper ${errors.name ? 'error' : fieldStatus.name === 'valid' ? 'success' : ''}`}>
                                <div className="input-icon">
                                    <FaUser />
                                </div>
                                <input
                                    type="text"
                                    value={form.name}
                                    name="name"
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    className="form-input"
                                />
                                {fieldStatus.name === 'valid' && <FaCheckCircle className="input-status valid" />}
                                {errors.name && <FaTimesCircle className="input-status invalid" />}
                            </div>
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <FaEnvelope className="label-icon" />
                                Email Address
                            </label>
                            <div className={`input-wrapper ${errors.email ? 'error' : fieldStatus.email === 'valid' ? 'success' : ''}`}>
                                <div className="input-icon">
                                    <FaEnvelope />
                                </div>
                                <input
                                    type="email"
                                    value={form.email}
                                    name="email"
                                    onChange={handleChange}
                                    placeholder="student@email.com"
                                    className="form-input"
                                />
                                {fieldStatus.email === 'valid' && <FaCheckCircle className="input-status valid" />}
                                {errors.email && <FaTimesCircle className="input-status invalid" />}
                            </div>
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                    </div>

                    {/* Marks Section */}
                    <div className="marks-section">
                        <div className="marks-header">
                            <FaBook className="marks-icon" />
                            <h3>Subject Marks</h3>
                            <span className="marks-hint">(Out of 100)</span>
                        </div>

                        <div className="marks-grid">
                            <div className="form-group">
                                <label className="form-label">Maths 1</label>
                                <div className={`input-wrapper ${errors.m1 ? 'error' : fieldStatus.m1 === 'valid' ? 'success' : ''}`}>
                                    <div className="input-icon">
                                        <FaCalculator />
                                    </div>
                                    <input
                                        type="number"
                                        value={form.m1}
                                        name="m1"
                                        onChange={handleChange}
                                        placeholder="0-100"
                                        className="form-input"
                                        min="0"
                                        max="100"
                                    />
                                    {fieldStatus.m1 === 'valid' && <FaCheckCircle className="input-status valid" />}
                                    {errors.m1 && <FaTimesCircle className="input-status invalid" />}
                                </div>
                                {errors.m1 && <span className="error-message">{errors.m1}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Maths 2</label>
                                <div className={`input-wrapper ${errors.m2 ? 'error' : fieldStatus.m2 === 'valid' ? 'success' : ''}`}>
                                    <div className="input-icon">
                                        <FaCalculator />
                                    </div>
                                    <input
                                        type="number"
                                        value={form.m2}
                                        name="m2"
                                        onChange={handleChange}
                                        placeholder="0-100"
                                        className="form-input"
                                        min="0"
                                        max="100"
                                    />
                                    {fieldStatus.m2 === 'valid' && <FaCheckCircle className="input-status valid" />}
                                    {errors.m2 && <FaTimesCircle className="input-status invalid" />}
                                </div>
                                {errors.m2 && <span className="error-message">{errors.m2}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">Maths 3</label>
                                <div className={`input-wrapper ${errors.m3 ? 'error' : fieldStatus.m3 === 'valid' ? 'success' : ''}`}>
                                    <div className="input-icon">
                                        <FaCalculator />
                                    </div>
                                    <input
                                        type="number"
                                        value={form.m3}
                                        name="m3"
                                        onChange={handleChange}
                                        placeholder="0-100"
                                        className="form-input"
                                        min="0"
                                        max="100"
                                    />
                                    {fieldStatus.m3 === 'valid' && <FaCheckCircle className="input-status valid" />}
                                    {errors.m3 && <FaTimesCircle className="input-status invalid" />}
                                </div>
                                {errors.m3 && <span className="error-message">{errors.m3}</span>}
                            </div>
                        </div>
                    </div>

                    

                    {/* Hidden Fields */}
                    <input type="hidden" value={form.total} name="total" />
                    <input type="hidden" value={form.percentage} name="percentage" />

                    {/* Submit Button */}
                    <button
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        type="submit"
                        disabled={isLoading || !isFormValid}
                    >
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            <>
                                {isEditMode ? <FaEdit /> : <FaPlus />}
                                {isEditMode ? "Update Student" : "Add Student"}
                            </>
                        )}
                    </button>

                    {/* Additional Info */}
                    <div className="form-footer">
                        <FaInfoCircle className="info-icon" />
                        <span>All marks are out of 100. Total and percentage will be calculated automatically.</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StdRegistrationForm;