import React, { useState } from 'react';
import { api } from '../service';
import { toast } from 'react-toastify';
import '../assets/css/ShowAllStd.css';
import {
    FaEdit,
    FaTrash,
    FaPlus,
    FaArrowLeft,
    FaSearch,
    FaSortUp,
    FaSortDown,
    FaGraduationCap,
    FaEnvelope,
    FaIdCard,
    FaUser,
    FaBook,
    FaChartLine,
    FaFileExport,
    FaFilter,
    FaTimes
} from "react-icons/fa";
import { MdGrade, MdPercent } from "react-icons/md";

const ShowAllStd = ({
    sendStd,
    setStd,
    setEditstd,
    loggedInUser,
    setShowStudentTable
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [filterMinMarks, setFilterMinMarks] = useState('');
    const [filterMaxMarks, setFilterMaxMarks] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Search functionality
    const filteredStudents = sendStd.filter(student => {
        const matchesSearch =
            student.prn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesMinMarks = filterMinMarks ?
            Number(student.percentage) >= Number(filterMinMarks) : true;
        const matchesMaxMarks = filterMaxMarks ?
            Number(student.percentage) <= Number(filterMaxMarks) : true;

        return matchesSearch && matchesMinMarks && matchesMaxMarks;
    });

    // Sort functionality
    const sortedStudents = [...filteredStudents].sort((a, b) => {
        if (sortConfig.key) {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle percentage as number
            if (sortConfig.key === 'percentage' || sortConfig.key === 'total') {
                aValue = Number(aValue);
                bValue = Number(bValue);
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
        setCurrentPage(1);
    };

    const handleDelete = (id) => {
        const studentToDelete = sendStd.find(student => student.id === id);
        setSelectedStudent(studentToDelete);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        api.delete(`/students/${selectedStudent.id}`)
            .then(() => {
                setStd((prev) =>
                    prev.filter((std) => std.id !== selectedStudent.id)
                );
                toast.success(`Student "${selectedStudent.name}" deleted successfully`);
                setShowDeleteModal(false);
                setSelectedStudent(null);
            })
            .catch((err) => {
                toast.error("Failed to delete student");
                console.log(err);
            });
    };

    const getGrade = (percentage) => {
        const p = Number(percentage);
        if (p >= 90) return { grade: 'A+', color: '#48bb78' };
        if (p >= 80) return { grade: 'A', color: '#68d391' };
        if (p >= 70) return { grade: 'B+', color: '#f6ad55' };
        if (p >= 60) return { grade: 'B', color: '#fbd38d' };
        if (p >= 50) return { grade: 'C+', color: '#f687b3' };
        if (p >= 40) return { grade: 'C', color: '#fc8181' };
        return { grade: 'F', color: '#e53e3e' };
    };

    const getPerformanceBadge = (percentage) => {
        const p = Number(percentage);
        if (p >= 80) return 'excellent';
        if (p >= 60) return 'good';
        if (p >= 40) return 'average';
        return 'poor';
    };

    const exportData = () => {
        const headers = ['PRN', 'Name', 'Email', 'M1', 'M2', 'M3', 'Total', 'Percentage', 'Grade'];
        const csvData = sortedStudents.map(student => [
            student.prn,
            student.name,
            student.email,
            student.m1,
            student.m2,
            student.m3,
            student.total,
            student.percentage,
            getGrade(student.percentage).grade
        ]);

        const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'students_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Data exported successfully!');
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterMinMarks('');
        setFilterMaxMarks('');
        setShowFilters(false);
    };

    const isFaculty = loggedInUser?.role === 'faculty';

    return (
        <div className="table-wrapper-std">
            <div className="table-container-std">
                {/* Header */}
                <div className="table-header-std">
                    <div className="header-left-std">
                        <div className="header-icon-std">
                            <FaGraduationCap />
                        </div>
                        <div>
                            <h1>Student Records</h1>
                            <p className="student-count-std">
                                {sendStd.length} {sendStd.length === 1 ? 'Student' : 'Students'} Registered
                            </p>
                        </div>
                    </div>

                    <div className="header-actions-std">
                        {isFaculty && (
                            <button
                                className="add-btn-std"
                                onClick={() => setShowStudentTable(false)}
                            >
                                <FaPlus /> Add Student
                            </button>
                        )}
                        <button
                            className="export-btn-std"
                            onClick={exportData}
                            disabled={sortedStudents.length === 0}
                        >
                            <FaFileExport /> Export
                        </button>
                    </div>
                </div>

                {/* Search and Controls */}
                <div className="table-controls-std">
                    <div className="search-wrapper-std">
                        <FaSearch className="search-icon-std" />
                        <input
                            type="text"
                            placeholder="Search by PRN, name or email..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="search-input-std"
                        />
                        {searchTerm && (
                            <button
                                className="clear-search-std"
                                onClick={() => setSearchTerm('')}
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <div className="controls-right-std">
                        <button
                            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FaFilter /> Filter
                        </button>
                        <span className="result-count-std">
                            {filteredStudents.length} results
                        </span>
                    </div>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="filters-container-std">
                        <div className="filter-group-std">
                            <label>Min Percentage</label>
                            <input
                                type="number"
                                value={filterMinMarks}
                                onChange={(e) => setFilterMinMarks(e.target.value)}
                                placeholder="0"
                                min="0"
                                max="100"
                                className="filter-input-std"
                            />
                        </div>
                        <div className="filter-group-std">
                            <label>Max Percentage</label>
                            <input
                                type="number"
                                value={filterMaxMarks}
                                onChange={(e) => setFilterMaxMarks(e.target.value)}
                                placeholder="100"
                                min="0"
                                max="100"
                                className="filter-input-std"
                            />
                        </div>
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <FaTimes /> Clear Filters
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="table-responsive-std">
                    <table className="student-table-std">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th onClick={() => handleSort('prn')} className="sortable-std">
                                    <FaIdCard className="th-icon-std" />
                                    PRN
                                    {sortConfig.key === 'prn' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon-std" /> :
                                            <FaSortDown className="sort-icon-std" />
                                    )}
                                </th>
                                <th onClick={() => handleSort('name')} className="sortable-std">
                                    <FaUser className="th-icon-std" />
                                    Name
                                    {sortConfig.key === 'name' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon-std" /> :
                                            <FaSortDown className="sort-icon-std" />
                                    )}
                                </th>
                                <th onClick={() => handleSort('email')} className="sortable-std">
                                    <FaEnvelope className="th-icon-std" />
                                    Email
                                    {sortConfig.key === 'email' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon-std" /> :
                                            <FaSortDown className="sort-icon-std" />
                                    )}
                                </th>
                                <th><FaBook className="th-icon-std" /> M1</th>
                                <th><FaBook className="th-icon-std" /> M2</th>
                                <th><FaBook className="th-icon-std" /> M3</th>
                                <th onClick={() => handleSort('total')} className="sortable-std">
                                    <MdGrade className="th-icon-std" />
                                    Total
                                    {sortConfig.key === 'total' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon-std" /> :
                                            <FaSortDown className="sort-icon-std" />
                                    )}
                                </th>
                                <th onClick={() => handleSort('percentage')} className="sortable-std">
                                    <MdPercent className="th-icon-std" />
                                    %
                                    {sortConfig.key === 'percentage' && (
                                        sortConfig.direction === 'asc' ?
                                            <FaSortUp className="sort-icon-std" /> :
                                            <FaSortDown className="sort-icon-std" />
                                    )}
                                </th>
                                {/* <th>Grade</th> */}
                                {isFaculty && <th className="action-header-std">Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((student, index) => {
                                    const grade = getGrade(student.percentage);
                                    return (
                                        <tr key={student.id} className="student-row-std">
                                            <td className="student-index-std">
                                                {indexOfFirstItem + index + 1}
                                            </td>
                                            <td>
                                                <span className="prn-badge">{student.prn}</span>
                                            </td>
                                            <td>
                                                <div className="student-cell-std">
                                                    <div className="student-avatar-std">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="student-name-std">{student.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="email-cell-std">
                                                    <FaEnvelope className="email-icon-std" />
                                                    {student.email}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="marks-badge">{student.m1}</span>
                                            </td>
                                            <td>
                                                <span className="marks-badge">{student.m2}</span>
                                            </td>
                                            <td>
                                                <span className="marks-badge">{student.m3}</span>
                                            </td>
                                            <td>
                                                <span className="total-badge">{student.total}</span>
                                            </td>
                                            <td>
                                                <span className={`percentage-badge ${getPerformanceBadge(student.percentage)}`}>
                                                    {student.percentage}%
                                                </span>
                                            </td>
                                            {/* <td>
                                                <span
                                                    className="grade-badge"
                                                    style={{
                                                        background: grade.color + '20',
                                                        color: grade.color,
                                                        borderColor: grade.color
                                                    }}
                                                >
                                                    {grade.grade}
                                                </span>
                                            </td> */}
                                            {isFaculty && (
                                                <td>
                                                    <div className="action-buttons-std">
                                                        <button
                                                            className="icon-btn-std edit-btn-std"
                                                            title="Edit Student"
                                                            onClick={() => {
                                                                setEditstd(student);
                                                                setShowStudentTable(false);
                                                            }}
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            className="icon-btn-std delete-btn-std"
                                                            title="Delete Student"
                                                            onClick={() => handleDelete(student.id)}
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={isFaculty ? 11 : 10} className="empty-state-std">
                                        <div className="empty-content-std">
                                            <FaGraduationCap className="empty-icon-std" />
                                            <p>No students found</p>
                                            <span className="empty-subtext-std">
                                                {searchTerm || filterMinMarks || filterMaxMarks
                                                    ? 'Try adjusting your search or filters'
                                                    : 'Start adding students to the system'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {sortedStudents.length > 0 && (
                    <div className="pagination-container-std">
                        <div className="pagination-info-std">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedStudents.length)} of {sortedStudents.length} students
                        </div>
                        <div className="pagination-controls-std">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="page-btn-std"
                            >
                                Previous
                            </button>
                            <span className="page-info-std">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="page-btn-std"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="table-footer-std">
                    <div className="footer-left-std">
                        <span className="total-count-std">
                            Total: <strong>{sortedStudents.length}</strong> students
                            {isFaculty && ' (Faculty Access)'}
                        </span>
                    </div>
                    <button
                        className="back-btn-std"
                        onClick={() => setShowStudentTable(false)}
                    >
                        <FaArrowLeft /> Back to Registration
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedStudent && (
                <div className="modal-overlay-std" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content-std" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-icon-std">
                            <FaTrash />
                        </div>
                        <h2>Delete Student</h2>
                        <p>
                            Are you sure you want to delete <strong>"{selectedStudent.name}"</strong>?
                            <br />
                            <span className="modal-warning-std">This action cannot be undone.</span>
                        </p>
                        <div className="modal-actions-std">
                            <button
                                className="modal-cancel-std"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="modal-confirm-std"
                                onClick={confirmDelete}
                            >
                                Delete Student
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowAllStd; 