import React, { useState } from 'react';
import { api } from '../service';
import { toast } from 'react-toastify';
import '../assets/css/ShowAllStd.css';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaArrowLeft,
    FaUsers,
    FaSearch,
    FaUser,
    FaEnvelope,
    FaUserTag,
    FaSortUp,
    FaSortDown,
    FaUserShield,
    FaUserGraduate
} from "react-icons/fa";
import { MdAdminPanelSettings, MdSchool } from "react-icons/md";
import '../assets/css/ShowAllUsers.css'

const ShowAllUsers = ({
    sendUser,
    setUser,
    setEditUser,
    loggedInUser,
    setShowUserTable,
    goToRegister
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Search functionality
    const filteredUsers = sendUser.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort functionality
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
            const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleDeleteUser = (id) => {
        const userToDelete = sendUser.find(user => user.id === id);
        setSelectedUser(userToDelete);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        api.delete(`/users/${selectedUser.id}`)
            .then(() => {
                setUser((prev) =>
                    prev.filter((user) => user.id !== selectedUser.id)
                );
                toast.success(`User "${selectedUser.name}" deleted successfully`);
                setShowDeleteModal(false);
                setSelectedUser(null);
            })
            .catch((error) => {
                toast.error("Failed to delete user");
                console.log(error);
            });
    };

    const getRoleIcon = (role) => {
        if (role === 'admin') {
            return <MdAdminPanelSettings className="role-icon-admin" />;
        }
        return <MdSchool className="role-icon-faculty" />;
    };

    const getRoleBadgeClass = (role) => {
        return role === 'admin' ? 'badge-admin' : 'badge-faculty';
    };

    const isAdmin = loggedInUser?.role === 'admin';

    return (
        <div className="table-wrapper">
            <div className="table-container">
                {/* Header */}
                <div className="table-header">
                    <div className="header-left">
                        <div className="header-icon">
                            <FaUsers />
                        </div>
                        <div>
                            <h1>User Management</h1>
                            <p className="user-count">
                                {sendUser.length} {sendUser.length === 1 ? 'User' : 'Users'} Registered
                            </p>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className="header-actions">
                            <button
                                className="add-user-btn"
                                onClick={goToRegister}
                            >
                                <FaPlus /> Add New User
                            </button>
                        </div>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="table-controls">
                    <div className="search-wrapper">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search"
                                onClick={() => setSearchTerm('')}
                            >
                                ×
                            </button>
                        )}
                    </div>
                    <div className="filter-info">
                        {filteredUsers.length !== sendUser.length && (
                            <span>Showing {filteredUsers.length} results</span>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th onClick={() => handleSort('name')} className="sortable">
                                    <FaUser className="th-icon" />
                                    Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon" /> :
                                            <FaSortDown className="sort-icon" />
                                    )}
                                </th>
                                <th onClick={() => handleSort('email')} className="sortable">
                                    <FaEnvelope className="th-icon" />
                                    Email
                                    {sortConfig.key === 'email' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon" /> :
                                            <FaSortDown className="sort-icon" />
                                    )}
                                </th>
                                <th onClick={() => handleSort('role')} className="sortable">
                                    <FaUserTag className="th-icon" />
                                    Role
                                    {sortConfig.key === 'role' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon" /> :
                                            <FaSortDown className="sort-icon" />
                                    )}
                                </th>
                                {isAdmin && <th className="action-header">Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {sortedUsers.length > 0 ? (
                                sortedUsers.map((user, index) => (
                                    <tr key={user.id} className="user-row">
                                        <td className="user-index">{index + 1}</td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-avatar">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="user-name">{user.name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="email-cell">
                                                <FaEnvelope className="email-icon" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="icon-btn edit-btn"
                                                        title="Edit User"
                                                        onClick={() => {
                                                            setEditUser(user);
                                                            setShowUserTable(false);
                                                        }}
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        className="icon-btn delete-btn"
                                                        title="Delete User"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? 5 : 4} className="empty-state">
                                        <div className="empty-content">
                                            <FaUsers className="empty-icon" />
                                            <p>No users found</p>
                                            <span className="empty-subtext">
                                                {searchTerm ? 'Try adjusting your search' : 'Start adding users to the system'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="table-footer">
                    <div className="footer-left">
                        <span className="total-count">
                            Total: <strong>{sortedUsers.length}</strong> users
                        </span>
                    </div>
                    <button
                        className="back-btn"
                        onClick={() => setShowUserTable(false)}
                    >
                        <FaArrowLeft /> Back to Registration
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon">
                            <FaTrash />
                        </div>
                        <h2>Confirm Delete</h2>
                        <p>
                            Are you sure you want to delete user <strong>"{selectedUser.name}"</strong>?
                            <br />
                            <span className="modal-warning">This action cannot be undone.</span>
                        </p>
                        <div className="modal-actions">
                            <button
                                className="modal-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-confirm"
                                onClick={confirmDelete}
                            >
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowAllUsers;