import React, { useState, useEffect } from 'react'
import { 
  IoLeaf, IoDocument, IoCheckmarkCircle, IoTime, IoAlert, 
  IoArrowForward, IoInformation, IoCalendar, IoCash, 
  IoDocumentText, IoCloudUpload, IoEye, IoDownload, IoClose
} from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import { 
  applyForSubsidy, 
  getUserSubsidyApplications,
  getSubsidySchemes,
  checkEligibility 
} from '../api/subsidyAPI'

export default function Subsidy() {
  const { user, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('apply')
  const [applications, setApplications] = useState([])
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState({
    applications: false,
    schemes: false,
    eligibility: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState(null)
  const [selectedScheme, setSelectedScheme] = useState(null)
  const [showSchemeDetails, setShowSchemeDetails] = useState(false)
  
  // Form state - matching backend expectations
  const [formData, setFormData] = useState({
    schemeId: '',
    documents: {
      aadhar: null,
      pan: null,
      landCertificate: null
    },
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      bankName: ''
    }
  })

  // Fetch schemes on component mount
  useEffect(() => {
    fetchSchemes()
  }, [])

  // Fetch user's applications
  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications()
    }
  }, [isAuthenticated])

  const fetchSchemes = async () => {
    try {
      setLoading(prev => ({ ...prev, schemes: true }))
      const response = await getSubsidySchemes()
      setSchemes(response.schemes || [])
    } catch (error) {
      console.error('Error fetching schemes:', error)
      toast.error('Failed to load subsidy schemes')
    } finally {
      setLoading(prev => ({ ...prev, schemes: false }))
    }
  }

  const fetchApplications = async () => {
    try {
      setLoading(prev => ({ ...prev, applications: true }))
      const response = await getUserSubsidyApplications()
      setApplications(response.applications || [])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast.error('Failed to load applications')
    } finally {
      setLoading(prev => ({ ...prev, applications: false }))
    }
  }

  const handleCheckEligibility = async () => {
    if (!formData.schemeId) {
      toast.error('Please select a scheme first')
      return
    }

    try {
      setLoading(prev => ({ ...prev, eligibility: true }))
      const response = await checkEligibility(formData.schemeId)
      setEligibilityResult(response)
      
      if (response.isEligible) {
        toast.success('You are eligible for this scheme!')
      } else {
        toast.error('You are not eligible for this scheme')
      }
    } catch (error) {
      console.error('Error checking eligibility:', error)
      toast.error('Failed to check eligibility')
    } finally {
      setLoading(prev => ({ ...prev, eligibility: false }))
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      if (parent === 'documents') {
        // Handle document fields differently
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }))
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    const [parent, child] = name.split('.')
    
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: files[0]
      }
    }))
  }

  const handleViewSchemeDetails = (scheme) => {
    setSelectedScheme(scheme)
    setShowSchemeDetails(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to apply for subsidy')
      return
    }

    // Validate form
    if (!formData.schemeId) {
      toast.error('Please select a scheme')
      return
    }

    if (!formData.documents.aadhar) {
      toast.error('Please upload Aadhar card')
      return
    }

    if (!formData.documents.landCertificate) {
      toast.error('Please upload land certificate')
      return
    }

    if (!formData.bankDetails.accountHolderName || 
        !formData.bankDetails.accountNumber || 
        !formData.bankDetails.ifscCode || 
        !formData.bankDetails.bankName) {
      toast.error('Please fill all bank details')
      return
    }

    try {
      setSubmitting(true)
      
      // Prepare documents object
      const documents = {
        aadhar: formData.documents.aadhar,
        pan: formData.documents.pan,
        landCertificate: formData.documents.landCertificate
      }

      const applicationData = {
        schemeId: formData.schemeId,
        documents: documents,
        bankDetails: formData.bankDetails
      }

      console.log('Submitting application:', applicationData)

      const response = await applyForSubsidy(applicationData)
      
      toast.success('Application submitted successfully!')
      
      // Reset form
      setFormData({
        schemeId: '',
        documents: {
          aadhar: null,
          pan: null,
          landCertificate: null
        },
        bankDetails: {
          accountNumber: '',
          ifscCode: '',
          accountHolderName: '',
          bankName: ''
        }
      })
      setEligibilityResult(null)
      
      // Refresh applications
      fetchApplications()
      setActiveTab('status')
      
    } catch (error) {
      console.error('Submission error:', error)
      toast.error(error.response?.data?.message || 'Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'draft': { color: 'bg-gray-100 text-gray-700', icon: IoDocument, label: 'Draft' },
      'submitted': { color: 'bg-blue-100 text-blue-700', icon: IoTime, label: 'Submitted' },
      'under_review': { color: 'bg-yellow-100 text-yellow-700', icon: IoTime, label: 'Under Review' },
      'approved': { color: 'bg-green-100 text-green-700', icon: IoCheckmarkCircle, label: 'Approved' },
      'rejected': { color: 'bg-red-100 text-red-700', icon: IoAlert, label: 'Rejected' },
      'disbursed': { color: 'bg-purple-100 text-purple-700', icon: IoCash, label: 'Disbursed' }
    }
    const config = statusConfig[status] || statusConfig['submitted']
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="text-sm" /> {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Government Subsidy Help</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Apply for various government subsidies for farming, solar installation, and agricultural equipment
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-md inline-flex flex-wrap">
            <button
              onClick={() => setActiveTab('apply')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'apply' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Apply for Subsidy
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'status' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              My Applications
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === 'schemes' 
                  ? 'bg-green-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Available Schemes
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Apply Tab */}
          {activeTab === 'apply' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Apply for Subsidy</h2>
              
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please login to apply for subsidy</p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Scheme Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Subsidy Scheme *
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="schemeId"
                        value={formData.schemeId}
                        onChange={handleInputChange}
                        required
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Choose a scheme...</option>
                        {schemes.map(scheme => (
                          <option key={scheme._id} value={scheme._id}>
                            {scheme.name} - {scheme.subsidyPercentage}% subsidy
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleCheckEligibility}
                        disabled={loading.eligibility || !formData.schemeId}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
                      >
                        {loading.eligibility ? 'Checking...' : 'Check Eligibility'}
                      </button>
                    </div>
                  </div>

                  {/* Eligibility Result */}
                  {eligibilityResult && (
                    <div className={`p-4 rounded-lg ${
                      eligibilityResult.isEligible 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-yellow-50 border border-yellow-200'
                    }`}>
                      <p className={`font-semibold ${
                        eligibilityResult.isEligible ? 'text-green-700' : 'text-yellow-700'
                      }`}>
                        {eligibilityResult.isEligible 
                          ? '✓ You are eligible for this scheme!' 
                          : '⚠ You may not be eligible for this scheme'}
                      </p>
                      {eligibilityResult.reasons?.length > 0 && (
                        <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                          {eligibilityResult.reasons.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Document Uploads */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Aadhar Card */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aadhar Card *
                        </label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-green-500 transition">
                          <input
                            type="file"
                            name="documents.aadhar"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            className="hidden"
                            id="aadhar-upload"
                          />
                          <label htmlFor="aadhar-upload" className="cursor-pointer block">
                            <IoCloudUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                            {formData.documents.aadhar ? (
                              <div>
                                <p className="text-sm font-medium text-green-600">{formData.documents.aadhar.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(formData.documents.aadhar.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600">Click to upload Aadhar</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* PAN Card */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Card (Optional)
                        </label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-green-500 transition">
                          <input
                            type="file"
                            name="documents.pan"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            id="pan-upload"
                            className="hidden"
                          />
                          <label htmlFor="pan-upload" className="cursor-pointer block">
                            <IoCloudUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                            {formData.documents.pan ? (
                              <div>
                                <p className="text-sm font-medium text-green-600">{formData.documents.pan.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(formData.documents.pan.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600">Click to upload PAN</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>

                      {/* Land Certificate */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Land Certificate *
                        </label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-green-500 transition">
                          <input
                            type="file"
                            name="documents.landCertificate"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                            required
                            id="land-upload"
                            className="hidden"
                          />
                          <label htmlFor="land-upload" className="cursor-pointer block">
                            <IoCloudUpload className="text-3xl text-gray-400 mx-auto mb-2" />
                            {formData.documents.landCertificate ? (
                              <div>
                                <p className="text-sm font-medium text-green-600">{formData.documents.landCertificate.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {(formData.documents.landCertificate.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm text-gray-600">Click to upload Land Certificate</p>
                                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                              </>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Bank Account Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Holder Name *
                        </label>
                        <input
                          type="text"
                          name="bankDetails.accountHolderName"
                          value={formData.bankDetails.accountHolderName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter account holder name"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bank Name *
                        </label>
                        <input
                          type="text"
                          name="bankDetails.bankName"
                          value={formData.bankDetails.bankName}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter bank name"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Number *
                        </label>
                        <input
                          type="text"
                          name="bankDetails.accountNumber"
                          value={formData.bankDetails.accountNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="Enter account number"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IFSC Code *
                        </label>
                        <input
                          type="text"
                          name="bankDetails.ifscCode"
                          value={formData.bankDetails.ifscCode}
                          onChange={handleInputChange}
                          required
                          placeholder="SBIN0001234"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Status Tab */}
          {activeTab === 'status' && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">My Applications</h2>
              
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Please login to view your applications</p>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Login
                  </button>
                </div>
              ) : loading.applications ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <IoDocumentText className="text-5xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No applications found</p>
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                  >
                    Apply Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map(app => (
                    <div key={app._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-semibold text-gray-900">
                              Application #{app.applicationId || app._id.slice(-8)}
                            </p>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-sm text-gray-600">
                            Scheme: {app.schemeId?.name || app.schemeName || 'N/A'}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <IoCalendar /> Applied: {new Date(app.applicationDate || app.createdAt).toLocaleDateString()}
                            </span>
                            {app.appliedAmount && (
                              <span className="flex items-center gap-1">
                                <IoCash /> Amount: ₹{app.appliedAmount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleViewSchemeDetails(app.schemeId)}
                          className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                        >
                          <IoEye /> View Details
                        </button>
                      </div>
                      
                      {app.status === 'approved' && app.approvalDetails && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-700 font-medium">
                            Approved Amount: ₹{app.approvalDetails.approvedAmount?.toLocaleString()}
                          </p>
                          {app.approvalDetails.remarks && (
                            <p className="text-xs text-gray-600 mt-1">Remarks: {app.approvalDetails.remarks}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Approved on: {new Date(app.approvalDetails.approvedDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {app.status === 'rejected' && app.rejectionReason && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-700">
                            Reason: {app.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Schemes Tab */}
          {activeTab === 'schemes' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <div className="flex gap-3">
                  <IoInformation className="text-blue-500 text-xl flex-shrink-0" />
                  <p className="text-blue-700">
                    All subsidies are provided by the Government of India under various agricultural schemes. 
                    Please ensure you meet the eligibility criteria before applying.
                  </p>
                </div>
              </div>

              {loading.schemes ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : (
                <div className="grid gap-6">
                  {schemes.map(scheme => (
                    <div key={scheme._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                      <div className="flex flex-wrap justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{scheme.name}</h3>
                          <p className="text-gray-600 mb-4">{scheme.description}</p>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-green-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Subsidy</p>
                              <p className="text-xl font-bold text-green-600">{scheme.subsidyPercentage}%</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Maximum Amount</p>
                              <p className="text-xl font-bold text-blue-600">₹{scheme.maxAmount?.toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded">
                              <p className="text-sm text-gray-600">Category</p>
                              <p className="text-xl font-bold text-purple-600 capitalize">{scheme.category || 'General'}</p>
                            </div>
                          </div>

                          {scheme.eligibilityCriteria && (
                            <div className="bg-gray-50 p-4 rounded">
                              <p className="text-sm font-semibold text-gray-700 mb-2">Eligibility Criteria:</p>
                              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                                {scheme.eligibilityCriteria.landRequirement && (
                                  <li>Land Requirement: {scheme.eligibilityCriteria.landRequirement}</li>
                                )}
                                {scheme.eligibilityCriteria.incomeLimit && (
                                  <li>Annual Income Limit: ₹{scheme.eligibilityCriteria.incomeLimit.toLocaleString()}</li>
                                )}
                                {scheme.eligibilityCriteria.farmerType && scheme.eligibilityCriteria.farmerType.length > 0 && (
                                  <li>Farmer Type: {scheme.eligibilityCriteria.farmerType.join(', ')}</li>
                                )}
                                {scheme.eligibilityCriteria.documents && scheme.eligibilityCriteria.documents.length > 0 && (
                                  <li>Required Documents: {scheme.eligibilityCriteria.documents.join(', ')}</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            setActiveTab('apply')
                            setFormData(prev => ({ ...prev, schemeId: scheme._id }))
                          }}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
                        >
                          Apply Now <IoArrowForward />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Scheme Details Modal */}
      {showSchemeDetails && selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">{selectedScheme.name}</h3>
              <button
                onClick={() => setShowSchemeDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoClose size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600">{selectedScheme.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Subsidy Percentage</p>
                  <p className="text-2xl font-bold text-green-600">{selectedScheme.subsidyPercentage}%</p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Maximum Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{selectedScheme.maxAmount?.toLocaleString()}</p>
                </div>
              </div>

              {selectedScheme.eligibilityCriteria && (
                <div>
                  <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
                  <div className="bg-gray-50 p-4 rounded space-y-2">
                    {selectedScheme.eligibilityCriteria.landRequirement && (
                      <p><span className="font-medium">Land Requirement:</span> {selectedScheme.eligibilityCriteria.landRequirement}</p>
                    )}
                    {selectedScheme.eligibilityCriteria.incomeLimit && (
                      <p><span className="font-medium">Income Limit:</span> ₹{selectedScheme.eligibilityCriteria.incomeLimit.toLocaleString()}</p>
                    )}
                    {selectedScheme.eligibilityCriteria.farmerType && (
                      <p><span className="font-medium">Farmer Type:</span> {selectedScheme.eligibilityCriteria.farmerType.join(', ')}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedScheme.documents && selectedScheme.documents.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Required Documents</h4>
                  <ul className="list-disc list-inside space-y-1 bg-gray-50 p-4 rounded">
                    {selectedScheme.documents.map((doc, idx) => (
                      <li key={idx} className="text-gray-700">{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setActiveTab('apply')
                    setFormData(prev => ({ ...prev, schemeId: selectedScheme._id }))
                    setShowSchemeDetails(false)
                  }}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
                >
                  Apply for this Scheme
                </button>
                <button
                  onClick={() => setShowSchemeDetails(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}