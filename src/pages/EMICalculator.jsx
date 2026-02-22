import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  IoCalculator, IoCheckmarkCircle, IoDocument, IoCall,
  IoArrowForward, IoTime, IoCash, IoStatsChart, IoDownload,
  IoPrint, IoShare, IoClose, IoWarning, IoInformationCircle
} from 'react-icons/io5'
import { Button, Badge } from '../components/UI'
import { createLoanApplication } from '../api/loansAPI'

export default function EMICalculator() {
  const navigate = useNavigate()
  const [input, setInput] = useState({
    systemCost: 500000,
    downPayment: 100000,
    tenureMonths: 60,
    interestRate: 8.5,
    processingFee: 1.0, // 1% processing fee
  })

  const [emi, setEmi] = useState(null)
  const [showAmortization, setShowAmortization] = useState(false)
  const [showLoanForm, setShowLoanForm] = useState(false)
  const [loanApplication, setLoanApplication] = useState({
    name: '',
    email: '',
    phone: '',
    aadhar: '',
    pan: '',
    income: '',
    occupation: 'farmer',
    address: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    agreeTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Predefined solar system packages
  const systemPackages = [
    { name: 'Small Farm (2-3 HP)', cost: 300000, description: 'Ideal for 2-3 acres' },
    { name: 'Medium Farm (5 HP)', cost: 500000, description: 'Perfect for 4-6 acres' },
    { name: 'Large Farm (7.5 HP)', cost: 750000, description: 'For 7-10 acres' },
    { name: 'Commercial (10+ HP)', cost: 1000000, description: 'Large scale farming' }
  ]

  // Loan schemes
  const loanSchemes = [
    { name: 'PM-KUSUM Scheme', interest: 4.5, subsidy: 90, description: 'Government subsidy scheme' },
    { name: 'Agriculture Term Loan', interest: 7.5, subsidy: 0, description: 'Regular bank loan' },
    { name: 'Solar Subsidy Loan', interest: 6.0, subsidy: 50, description: 'Subsidized interest rate' }
  ]

  const calculateEMI = () => {
    const principal = input.systemCost - input.downPayment
    const monthlyRate = input.interestRate / 100 / 12
    
    // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiValue = principal > 0 
      ? (principal * monthlyRate * Math.pow(1 + monthlyRate, input.tenureMonths)) /
        (Math.pow(1 + monthlyRate, input.tenureMonths) - 1)
      : 0
    
    const totalAmount = emiValue * input.tenureMonths
    const totalInterest = totalAmount - principal
    const processingFeeAmount = (input.systemCost * input.processingFee) / 100
    const totalPayment = totalAmount + processingFeeAmount + input.downPayment

    // Generate amortization schedule
    const schedule = []
    let balance = principal
    for (let i = 1; i <= input.tenureMonths; i++) {
      const interestPaid = balance * monthlyRate
      const principalPaid = emiValue - interestPaid
      balance -= principalPaid
      schedule.push({
        month: i,
        emi: Math.round(emiValue),
        principal: Math.round(principalPaid),
        interest: Math.round(interestPaid),
        balance: Math.round(Math.max(0, balance))
      })
    }

    setEmi({
      monthlyEMI: Math.round(emiValue),
      totalAmount: Math.round(totalAmount),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
      processingFee: Math.round(processingFeeAmount),
      totalPayment: Math.round(totalPayment),
      downPayment: input.downPayment,
      loanAmount: principal,
      schedule: schedule
    })
  }

  useEffect(() => {
    calculateEMI()
  }, [input])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setInput({ 
      ...input, 
      [name]: type === 'checkbox' ? checked : (parseFloat(value) || 0) 
    })
  }

  const handleLoanChange = (e) => {
    const { name, value, type, checked } = e.target
    setLoanApplication(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const selectPackage = (cost) => {
    setInput(prev => ({ ...prev, systemCost: cost }))
  }

  const selectScheme = (scheme) => {
    setInput(prev => ({ ...prev, interestRate: scheme.interest }))
  }

  const handleLoanSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate form
      if (!loanApplication.agreeTerms) {
        throw new Error('Please agree to the terms and conditions')
      }

      // Submit loan application
      await createLoanApplication({
        name: loanApplication.name,
        email: loanApplication.email,
        phone: loanApplication.phone,
        aadhar: loanApplication.aadhar,
        pan: loanApplication.pan,
        income: loanApplication.income,
        occupation: loanApplication.occupation,
        address: loanApplication.address,
        bankName: loanApplication.bankName,
        accountNumber: loanApplication.accountNumber,
        ifscCode: loanApplication.ifscCode,
        loanAmount: emi?.loanAmount,
        systemCost: input.systemCost,
        tenureMonths: input.tenureMonths,
        interestRate: input.interestRate,
        monthlyEMI: emi?.monthlyEMI
      })

      setSuccess('Loan application submitted successfully! Our representative will contact you within 24 hours.')
      setTimeout(() => {
        setShowLoanForm(false)
        setSuccess('')
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit application')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (!emi?.schedule) return

    const headers = ['Month', 'EMI', 'Principal', 'Interest', 'Balance']
    const csvData = emi.schedule.map(row => [
      row.month,
      row.emi,
      row.principal,
      row.interest,
      row.balance
    ])
    
    const csv = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emi-schedule-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const printSchedule = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>EMI Schedule</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #4CAF50; color: white; text-align: center; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>EMI Schedule - Solar Loan</h1>
          <div class="summary">
            <p><strong>Loan Amount:</strong> ₹${emi.loanAmount.toLocaleString()}</p>
            <p><strong>Monthly EMI:</strong> ₹${emi.monthlyEMI.toLocaleString()}</p>
            <p><strong>Interest Rate:</strong> ${input.interestRate}%</p>
            <p><strong>Tenure:</strong> ${input.tenureMonths} months</p>
          </div>
          <table>
            <tr>
              <th>Month</th>
              <th>EMI</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>Balance</th>
            </tr>
            ${emi.schedule.map(row => `
              <tr>
                <td style="text-align: center;">${row.month}</td>
                <td>₹${row.emi.toLocaleString()}</td>
                <td>₹${row.principal.toLocaleString()}</td>
                <td>₹${row.interest.toLocaleString()}</td>
                <td>₹${row.balance.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="success" className="mb-4 px-4 py-2">
            <span className="flex items-center gap-2 text-lg">
              <IoCalculator /> Easy Finance Options Available
            </span>
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-agro-dark mb-4">
            Solar EMI <span className="text-green-600">Calculator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your monthly payments with zero down payment options.
            Government subsidies available.
          </p>
        </div>

        {/* Predefined Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-agro-dark mb-6">Popular Solar Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemPackages.map((pkg, index) => (
              <div
                key={index}
                onClick={() => selectPackage(pkg.cost)}
                className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg border-2 ${
                  input.systemCost === pkg.cost ? 'border-green-500 bg-green-50' : 'border-transparent'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                <p className="text-2xl font-bold text-green-600">₹{pkg.cost.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Schemes */}
        <div className="mb-12 bg-blue-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-agro-dark mb-4">Available Loan Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loanSchemes.map((scheme, index) => (
              <div
                key={index}
                onClick={() => selectScheme(scheme)}
                className={`bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition border ${
                  input.interestRate === scheme.interest ? 'border-green-500 bg-green-50' : 'border-gray-200'
                }`}
              >
                <h3 className="font-bold">{scheme.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">{scheme.interest}%</span>
                  {scheme.subsidy > 0 && (
                    <Badge variant="success" className="text-xs">
                      {scheme.subsidy}% Subsidy
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-agro-dark flex items-center gap-2">
              <IoCalculator className="text-green-600" /> Calculate Your EMI
            </h2>

            <div className="space-y-6">
              {/* System Cost */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-agro-dark">
                    System Cost
                  </label>
                  <span className="text-xl font-bold text-green-600">
                    ₹{input.systemCost.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  name="systemCost"
                  min="100000"
                  max="2000000"
                  step="50000"
                  value={input.systemCost}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹1L</span>
                  <span>₹5L</span>
                  <span>₹10L</span>
                  <span>₹20L</span>
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-agro-dark">
                    Down Payment
                  </label>
                  <span className="text-lg font-semibold text-gray-700">
                    ₹{input.downPayment.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  name="downPayment"
                  min="0"
                  max={input.systemCost}
                  step="50000"
                  value={input.downPayment}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹{Math.round(input.systemCost/4).toLocaleString()}</span>
                  <span>₹{Math.round(input.systemCost/2).toLocaleString()}</span>
                  <span>₹{input.systemCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-agro-dark">
                    Loan Tenure
                  </label>
                  <span className="text-lg font-semibold text-gray-700">
                    {input.tenureMonths} months ({Math.round(input.tenureMonths/12)} years)
                  </span>
                </div>
                <input
                  type="range"
                  name="tenureMonths"
                  min="12"
                  max="240"
                  step="12"
                  value={input.tenureMonths}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1Y</span>
                  <span>3Y</span>
                  <span>5Y</span>
                  <span>10Y</span>
                  <span>20Y</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-agro-dark">
                    Interest Rate
                  </label>
                  <span className="text-lg font-semibold text-gray-700">
                    {input.interestRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  name="interestRate"
                  min="4"
                  max="15"
                  step="0.1"
                  value={input.interestRate}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>4%</span>
                  <span>8%</span>
                  <span>12%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Processing Fee */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-agro-dark">
                    Processing Fee
                  </label>
                  <span className="text-lg font-semibold text-gray-700">
                    {input.processingFee}%
                  </span>
                </div>
                <input
                  type="range"
                  name="processingFee"
                  min="0"
                  max="3"
                  step="0.5"
                  value={input.processingFee}
                  onChange={handleChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-agro-dark flex items-center gap-2">
              <IoStatsChart className="text-green-600" /> EMI Breakdown
            </h2>

            {emi ? (
              <div className="space-y-6">
                {/* Monthly EMI Card */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-green-100">Monthly EMI</p>
                    <IoCash className="text-2xl" />
                  </div>
                  <p className="text-4xl font-bold">₹{emi.monthlyEMI.toLocaleString()}</p>
                  <p className="text-sm text-green-100 mt-2">
                    For {input.tenureMonths} months at {input.interestRate}% interest
                  </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                    <p className="text-xl font-bold text-blue-600">₹{emi.loanAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Down Payment</p>
                    <p className="text-xl font-bold text-purple-600">₹{emi.downPayment.toLocaleString()}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Interest</p>
                    <p className="text-xl font-bold text-orange-600">₹{emi.totalInterest.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Processing Fee</p>
                    <p className="text-xl font-bold text-red-600">₹{emi.processingFee.toLocaleString()}</p>
                  </div>
                </div>

                {/* Total Payment */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total Payment</p>
                      <p className="text-2xl font-bold text-agro-dark">₹{emi.totalPayment.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Principal + Interest + Fees</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowLoanForm(true)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Apply for Loan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAmortization(!showAmortization)}
                    className="flex items-center gap-2"
                  >
                    {showAmortization ? 'Hide' : 'Show'} Schedule
                  </Button>
                </div>

                {/* Amortization Schedule */}
                {showAmortization && emi.schedule && (
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Payment Schedule</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={exportToCSV}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Export to CSV"
                        >
                          <IoDownload />
                        </button>
                        <button
                          onClick={printSchedule}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Print"
                        >
                          <IoPrint />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-gray-100">
                          <tr>
                            <th className="p-2 text-left">Month</th>
                            <th className="p-2 text-right">EMI</th>
                            <th className="p-2 text-right">Principal</th>
                            <th className="p-2 text-right">Interest</th>
                            <th className="p-2 text-right">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emi.schedule.map((row, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-2">{row.month}</td>
                              <td className="p-2 text-right">₹{row.emi.toLocaleString()}</td>
                              <td className="p-2 text-right">₹{row.principal.toLocaleString()}</td>
                              <td className="p-2 text-right">₹{row.interest.toLocaleString()}</td>
                              <td className="p-2 text-right">₹{row.balance.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <IoCalculator className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Adjust the sliders to calculate your EMI</p>
              </div>
            )}
          </div>
        </div>

        {/* Loan Application Modal */}
        {showLoanForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Loan Application</h3>
                  <button
                    onClick={() => setShowLoanForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <IoClose className="text-2xl" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                    <IoWarning /> {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                    <IoCheckmarkCircle /> {success}
                  </div>
                )}

                <form onSubmit={handleLoanSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={loanApplication.name}
                        onChange={handleLoanChange}
                        className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={loanApplication.phone}
                        onChange={handleLoanChange}
                        className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={loanApplication.email}
                      onChange={handleLoanChange}
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                      <input
                        type="text"
                        name="aadhar"
                        value={loanApplication.aadhar}
                        onChange={handleLoanChange}
                        className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        placeholder="XXXX-XXXX-XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
                      <input
                        type="text"
                        name="pan"
                        value={loanApplication.pan}
                        onChange={handleLoanChange}
                        className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        placeholder="ABCDE1234F"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income (₹)</label>
                      <input
                        type="number"
                        name="income"
                        value={loanApplication.income}
                        onChange={handleLoanChange}
                        className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                      <select
                        name="occupation"
                        value={loanApplication.occupation}
                        onChange={handleLoanChange}
                        className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                      >
                        <option value="farmer">Farmer</option>
                        <option value="agriculturist">Agriculturist</option>
                        <option value="business">Business</option>
                        <option value="salaried">Salaried</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Farm Address</label>
                    <textarea
                      name="address"
                      value={loanApplication.address}
                      onChange={handleLoanChange}
                      rows="2"
                      className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-bold mb-3">Bank Details (Optional)</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <input
                          type="text"
                          name="bankName"
                          value={loanApplication.bankName}
                          onChange={handleLoanChange}
                          className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={loanApplication.accountNumber}
                          onChange={handleLoanChange}
                          className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                        <input
                          type="text"
                          name="ifscCode"
                          value={loanApplication.ifscCode}
                          onChange={handleLoanChange}
                          className="w-full p-3 border-2 rounded-lg focus:border-green-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="bg-green-50 p-4 rounded-lg mb-4">
                      <p className="font-semibold mb-2">Loan Summary</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>System Cost:</span>
                        <span className="font-bold">₹{input.systemCost.toLocaleString()}</span>
                        <span>Loan Amount:</span>
                        <span className="font-bold">₹{emi?.loanAmount.toLocaleString()}</span>
                        <span>Monthly EMI:</span>
                        <span className="font-bold">₹{emi?.monthlyEMI.toLocaleString()}</span>
                        <span>Tenure:</span>
                        <span className="font-bold">{input.tenureMonths} months</span>
                      </div>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={loanApplication.agreeTerms}
                        onChange={handleLoanChange}
                        className="w-4 h-4"
                        required
                      />
                      <span className="text-sm">
                        I agree to the <a href="#" className="text-green-600 underline">terms and conditions</a> and authorize AgroMart to verify my information.
                      </span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <IoInformationCircle className="text-green-600" /> Important Information
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">Eligibility</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2 text-sm">
                  <IoCheckmarkCircle className="text-green-600" /> Indian citizen
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <IoCheckmarkCircle className="text-green-600" /> Farmer/Agriculturist
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <IoCheckmarkCircle className="text-green-600" /> Minimum 1 acre land
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <IoCheckmarkCircle className="text-green-600" /> Age 21-65 years
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Documents Required</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2 text-sm">
                  <IoDocument className="text-blue-600" /> Aadhar Card
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <IoDocument className="text-blue-600" /> PAN Card
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <IoDocument className="text-blue-600" /> Land Records
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <IoDocument className="text-blue-600" /> Bank Statement
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Need Help?</h3>
              <div className="space-y-3">
                <a href="tel:+919876543210" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
                  <IoCall className="text-xl" /> +91 98765 43210
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  Mon-Sat: 9:00 AM - 6:00 PM
                </p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => window.location.href = 'mailto:loans@agromart.com'}
                >
                  Email Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}