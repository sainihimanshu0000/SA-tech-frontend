import React, { useState, useEffect } from 'react';
import { 
  IoEye, IoCreate, IoClose, IoDocument,
  IoSearch, IoRefresh, IoFilter,
  IoCheckmarkCircle, IoAlert, IoTime,
  IoPerson, IoCall, IoMail, IoLocation,
  IoCard, IoCash, IoCalendar
} from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import {
  getAllLoanApplications,
  updateLoanApplicationStatus,
  getLoanStatistics
} from '../../api/loansAPI';

export default function LoanAdmin() {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateData, setStatusUpdateData] = useState({
    notes: '',
    rejectionReason: ''
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1
  });

  useEffect(() => {
    fetchLoans();
    fetchStatistics();
  }, [filters.status, filters.search, filters.page]);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await getAllLoanApplications(
        filters.status, 
        filters.page, 
        filters.limit,
        filters.search
      );
      
      // Handle both response structures
      const loansData = response.data || response.loans || [];
      setLoans(loansData);
      
      setPagination({
        total: response.pagination?.total || response.total || 0,
        pages: response.pagination?.pages || response.pagination?.totalPages || response.pages || 1,
        page: response.pagination?.page || response.pagination?.currentPage || response.page || 1
      });
    } catch (error) {
      console.error('Error fetching loans:', error);
      toast.error('Failed to fetch loan applications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getLoanStatistics();
      setStats(response.data || response);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (loanId, newStatus) => {
    try {
      const updateData = {
        status: newStatus,
        ...(newStatus === 'rejected' && { rejectionReason: statusUpdateData.rejectionReason }),
        ...(statusUpdateData.notes && { notes: statusUpdateData.notes })
      };

      await updateLoanApplicationStatus(loanId, updateData);
      
      toast.success(`Loan ${newStatus} successfully!`);
      fetchLoans();
      fetchStatistics();
      setShowStatusModal(false);
      setSelectedLoan(null);
      setStatusUpdateData({ notes: '', rejectionReason: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update loan status');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'under-review': 'bg-blue-100 text-blue-700',
      'approved': 'bg-green-100 text-green-700',
      'rejected': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <IoTime className="text-yellow-600" />;
      case 'under-review': return <IoTime className="text-blue-600" />;
      case 'approved': return <IoCheckmarkCircle className="text-green-600" />;
      case 'rejected': return <IoAlert className="text-red-600" />;
      default: return null;
    }
  };

  const getOccupationLabel = (occupation) => {
    const labels = {
      'farmer': 'Farmer',
      'agriculturist': 'Agriculturist',
      'business': 'Business',
      'salaried': 'Salaried',
      'other': 'Other'
    };
    return labels[occupation] || occupation;
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const maskAadhar = (aadhar) => {
    if (!aadhar) return 'Not provided';
    return `XXXX-XXXX-${aadhar.slice(-4)}`;
  };

  const maskPan = (pan) => {
    if (!pan) return 'Not provided';
    return `${pan.slice(0,2)}XXXXX${pan.slice(-2)}`;
  };

  const maskAccountNumber = (acc) => {
    if (!acc) return 'Not provided';
    return `XXXXXX${acc.slice(-4)}`;
  };

  const StatusModal = ({ loan }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Update Loan Status</h3>
          <button
            onClick={() => {
              setShowStatusModal(false);
              setStatusUpdateData({ notes: '', rejectionReason: '' });
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold">{loan.name}</p>
          <p className="text-sm text-gray-600">Loan Amount: {formatCurrency(loan.loanAmount)}</p>
          <p className="text-sm text-gray-600">Current Status: 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusBadge(loan.status)}`}>
              {loan.status}
            </span>
          </p>
        </div>

        {/* Notes field for all updates */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={statusUpdateData.notes}
            onChange={(e) => setStatusUpdateData({ ...statusUpdateData, notes: e.target.value })}
            rows="3"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any notes about this application..."
          />
        </div>

        {/* Rejection reason field - shown only when rejecting */}
        {statusUpdateData.showRejection && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rejection Reason *
            </label>
            <textarea
              value={statusUpdateData.rejectionReason}
              onChange={(e) => setStatusUpdateData({ ...statusUpdateData, rejectionReason: e.target.value })}
              rows="2"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter reason for rejection..."
              required
            />
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleStatusUpdate(loan._id, 'under-review')}
            disabled={loan.status === 'under-review'}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <IoTime /> Mark Under Review
          </button>
          
          <button
            onClick={() => handleStatusUpdate(loan._id, 'approved')}
            disabled={loan.status === 'approved'}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <IoCheckmarkCircle /> Approve Loan
          </button>
          
          {!statusUpdateData.showRejection ? (
            <button
              onClick={() => setStatusUpdateData({ ...statusUpdateData, showRejection: true })}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <IoAlert /> Reject Loan
            </button>
          ) : (
            <button
              onClick={() => {
                if (!statusUpdateData.rejectionReason) {
                  toast.error('Please provide rejection reason');
                  return;
                }
                handleStatusUpdate(loan._id, 'rejected');
              }}
              className="w-full bg-red-700 text-white px-4 py-3 rounded-lg hover:bg-red-800 flex items-center justify-center gap-2"
            >
              <IoAlert /> Confirm Rejection
            </button>
          )}
          
          <button
            onClick={() => {
              setShowStatusModal(false);
              setStatusUpdateData({ notes: '', rejectionReason: '' });
            }}
            className="w-full bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const LoanDetailsModal = ({ loan }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Loan Application Details</h2>
          <button
            onClick={() => setShowDetails(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Header */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(loan.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(loan.status)}`}>
                  {loan.status?.toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                <IoCalendar className="inline mr-1" /> Applied: {formatDate(loan.createdAt)}
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedLoan(loan);
                setShowStatusModal(true);
                setShowDetails(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
            >
              <IoCreate /> Update Status
            </button>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <IoPerson className="text-blue-600" /> Personal Information
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{loan.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <IoMail className="text-gray-400" /> {loan.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium flex items-center gap-1">
                  <IoCall className="text-gray-400" /> {loan.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Occupation</p>
                <p className="font-medium">{getOccupationLabel(loan.occupation)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Annual Income</p>
                <p className="font-medium text-green-600">{formatCurrency(loan.income || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium flex items-center gap-1">
                  <IoLocation className="text-gray-400" /> {loan.address || 'Not provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Identity Documents */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <IoDocument className="text-blue-600" /> Identity Documents
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-medium">{maskAadhar(loan.aadhar)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN Number</p>
                <p className="font-medium">{maskPan(loan.pan)}</p>
              </div>
            </div>
          </div>

          {/* Loan Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <IoCash className="text-blue-600" /> Loan Details
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">System Cost</p>
                <p className="font-medium text-blue-600">{formatCurrency(loan.systemCost)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium text-lg text-green-600">{formatCurrency(loan.loanAmount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-medium">{loan.tenureMonths} months</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="font-medium">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly EMI</p>
                <p className="font-medium text-purple-600">{formatCurrency(loan.monthlyEMI)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Payable</p>
                <p className="font-medium">{formatCurrency(loan.monthlyEMI * loan.tenureMonths)}</p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <IoCard className="text-blue-600" /> Bank Details
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bank Name</p>
                <p className="font-medium">{loan.bankName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Number</p>
                <p className="font-medium">{maskAccountNumber(loan.accountNumber)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">IFSC Code</p>
                <p className="font-medium">{loan.ifscCode || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {loan.documents && loan.documents.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Uploaded Documents</h3>
              <div className="grid grid-cols-2 gap-3">
                {loan.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-white rounded-lg hover:bg-blue-50 border"
                  >
                    <IoDocument className="text-blue-600" />
                    <span className="text-sm">{doc.type || `Document ${index + 1}`}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Status Updates */}
          {loan.notes && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Notes</p>
              <p className="text-blue-800">{loan.notes}</p>
            </div>
          )}

          {loan.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-semibold">Rejection Reason</p>
              <p className="text-red-800">{loan.rejectionReason}</p>
            </div>
          )}

          {loan.approvedOn && (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">Approved on</p>
              <p className="text-green-800">{formatDate(loan.approvedOn)}</p>
            </div>
          )}

          <button
            onClick={() => setShowDetails(false)}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Loan Management</h1>
          <button
            onClick={() => {
              fetchLoans();
              fetchStatistics();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <IoRefresh /> Refresh
          </button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold">{stats.total || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow">
              <p className="text-sm text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.byStatus?.pending || 0}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg shadow">
              <p className="text-sm text-blue-600">Under Review</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byStatus?.['under-review'] || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow">
              <p className="text-sm text-green-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.byStatus?.approved || 0}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg shadow">
              <p className="text-sm text-red-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.byStatus?.rejected || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <IoSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={() => setFilters({ status: '', search: '', page: 1 })}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
            >
              <IoFilter /> Clear Filters
            </button>
          </div>
        </div>

        {/* Loans Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6">Applicant</th>
                    <th className="text-left py-4 px-6">Contact</th>
                    <th className="text-left py-4 px-6">Loan Amount</th>
                    <th className="text-left py-4 px-6">System Cost</th>
                    <th className="text-left py-4 px-6">EMI</th>
                    <th className="text-left py-4 px-6">Status</th>
                    <th className="text-left py-4 px-6">Date</th>
                    <th className="text-left py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map(loan => (
                    <tr key={loan._id} className="border-t hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-semibold">{loan.name}</p>
                          <p className="text-sm text-gray-500">{getOccupationLabel(loan.occupation)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm">{loan.email}</p>
                          <p className="text-sm text-gray-500">{loan.phone}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-semibold text-green-600">
                        {formatCurrency(loan.loanAmount)}
                      </td>
                      <td className="py-4 px-6">
                        {formatCurrency(loan.systemCost)}
                      </td>
                      <td className="py-4 px-6">
                        {formatCurrency(loan.monthlyEMI)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(loan.status)}
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(loan.status)}`}>
                            {loan.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {formatDate(loan.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowDetails(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <IoEye size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedLoan(loan);
                              setShowStatusModal(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Update Status"
                          >
                            <IoCreate size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4 border-t">
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {filters.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === pagination.pages}
                  className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}

            {loans.length === 0 && (
              <div className="text-center py-12">
                <IoDocument className="text-5xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No loan applications found</p>
              </div>
            )}
          </div>
        )}

        {/* Modals */}
        {showStatusModal && selectedLoan && <StatusModal loan={selectedLoan} />}
        {showDetails && selectedLoan && <LoanDetailsModal loan={selectedLoan} />}
      </div>
    </div>
  );
}