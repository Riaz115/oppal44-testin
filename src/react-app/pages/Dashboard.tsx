import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/hooks/useGoogleAuth';
import { Gem, ChevronDown, Calendar, BarChart3, Database } from 'lucide-react';
import { useNavigate } from 'react-router';

interface GAProperty {
  id: string;
  displayName: string;
}

interface DateRange {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect to signup if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/signup');
    }
  }, [user, navigate]);
  
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('');
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock GA4 properties
  const mockProperties: GAProperty[] = [
    { id: 'properties/123456789', displayName: 'My Website - GA4' },
    { id: 'properties/987654321', displayName: 'E-commerce Store - GA4' },
    { id: 'properties/456789123', displayName: 'Mobile App - GA4' },
    { id: 'properties/789123456', displayName: 'Blog Analytics - GA4' },
    { id: 'properties/555666777', displayName: 'Marketing Site - GA4' },
    { id: 'properties/888999111', displayName: 'Corporate Website - GA4' }
  ];

  // Date range options
  const dateRanges: DateRange[] = [
    { 
      id: 'today', 
      label: 'Today', 
      startDate: new Date().toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    },
    { 
      id: 'yesterday', 
      label: 'Yesterday', 
      startDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], 
      endDate: new Date(Date.now() - 86400000).toISOString().split('T')[0] 
    },
    { 
      id: 'last7days', 
      label: 'Last 7 days', 
      startDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    },
    { 
      id: 'last30days', 
      label: 'Last 30 days', 
      startDate: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    },
    { 
      id: 'thismonth', 
      label: 'This month', 
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    },
    { 
      id: 'lastmonth', 
      label: 'Last month', 
      startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0], 
      endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0] 
    },
    { 
      id: 'last3months', 
      label: 'Last 3 months', 
      startDate: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    },
    { 
      id: 'thisyear', 
      label: 'This year', 
      startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], 
      endDate: new Date().toISOString().split('T')[0] 
    },
    { 
      id: 'lastyear', 
      label: 'Last year', 
      startDate: new Date(new Date().getFullYear() - 1, 0, 1).toISOString().split('T')[0], 
      endDate: new Date(new Date().getFullYear() - 1, 11, 31).toISOString().split('T')[0] 
    }
  ];

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handlePropertyChange = (property: GAProperty) => {
    setSelectedProperty(property.id);
    setIsPropertyDropdownOpen(false);
    
    // If both property and date range are selected, simulate loading
    if (selectedDateRange) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    setSelectedDateRange(dateRange.id);
    setIsDateDropdownOpen(false);
    
    // If both property and date range are selected, simulate loading
    if (selectedProperty) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getSelectedPropertyName = () => {
    const property = mockProperties.find(p => p.id === selectedProperty);
    return property ? property.displayName : 'Choose a property...';
  };

  const getSelectedDateRangeName = () => {
    const dateRange = dateRanges.find(d => d.id === selectedDateRange);
    return dateRange ? dateRange.label : 'Select date range...';
  };

  if (!user) {
    return null; // This will be handled by the useEffect redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-2">
              <Gem className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Opal44</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 text-sm text-gray-600">
                <img 
                  src={user.picture} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>Welcome, {user.name}</span>
                {user.hasGA4Access && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    GA4 Access ✓
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            GA4 Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect your Google Analytics 4 property and select a date range to view AI-powered insights
          </p>
        </div>

        {/* Selector Panel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* GA4 Property Selector */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2 text-blue-600" />
                Select GA4 Property
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsPropertyDropdownOpen(!isPropertyDropdownOpen);
                    setIsDateDropdownOpen(false);
                  }}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-left flex items-center justify-between hover:border-blue-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className={`text-lg ${selectedProperty ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {getSelectedPropertyName()}
                  </span>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isPropertyDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                    {mockProperties.map((property, index) => (
                      <button
                        key={property.id}
                        onClick={() => handlePropertyChange(property)}
                        className={`w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 ${
                          index === 0 ? 'rounded-t-xl' : ''
                        } ${index === mockProperties.length - 1 ? 'rounded-b-xl' : ''}`}
                      >
                        <div className="font-medium">{property.displayName}</div>
                        <div className="text-sm text-gray-500 mt-1">{property.id}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Date Range Selector */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                Select Date Range
              </label>
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDateDropdownOpen(!isDateDropdownOpen);
                    setIsPropertyDropdownOpen(false);
                  }}
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-6 py-4 text-left flex items-center justify-between hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className={`text-lg ${selectedDateRange ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {getSelectedDateRangeName()}
                  </span>
                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDateDropdownOpen && (
                  <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-y-auto">
                    {dateRanges.map((dateRange, index) => (
                      <button
                        key={dateRange.id}
                        onClick={() => handleDateRangeChange(dateRange)}
                        className={`w-full px-6 py-4 text-left hover:bg-purple-50 transition-colors text-gray-800 border-b border-gray-100 last:border-b-0 ${
                          index === 0 ? 'rounded-t-xl' : ''
                        } ${index === dateRanges.length - 1 ? 'rounded-b-xl' : ''}`}
                      >
                        <div className="font-medium">{dateRange.label}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {dateRange.startDate} to {dateRange.endDate}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          {(selectedProperty || selectedDateRange) && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Selection:</h3>
              <div className="space-y-2">
                {selectedProperty && (
                  <div className="flex items-center text-gray-700">
                    <Database className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium">Property:</span>
                    <span className="ml-2">{getSelectedPropertyName()}</span>
                  </div>
                )}
                {selectedDateRange && (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    <span className="font-medium">Date Range:</span>
                    <span className="ml-2">{getSelectedDateRangeName()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && selectedProperty && selectedDateRange && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading GA4 Data</h3>
            <p className="text-gray-600">Connecting to Google Analytics 4 and fetching your data...</p>
          </div>
        )}

        {/* Ready State */}
        {!isLoading && selectedProperty && selectedDateRange && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-xl">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-12 h-12 text-green-100" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Ready to Analyze!</h3>
            <p className="text-lg text-green-100 mb-6">
              Your GA4 property and date range are selected. Data will be fetched from Google Analytics 4 API.
            </p>
            <div className="bg-white/20 rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-sm text-green-100">
                <strong>Property:</strong> {getSelectedPropertyName()}<br/>
                <strong>Date Range:</strong> {getSelectedDateRangeName()}
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedProperty && !selectedDateRange && (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <BarChart3 className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Get Started</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Select a GA4 property and date range from the dropdowns above to begin analyzing your website data with AI-powered insights.
            </p>
          </div>
        )}

        {/* Partial Selection State */}
        {(selectedProperty && !selectedDateRange) || (!selectedProperty && selectedDateRange) && (
          <div className="text-center py-16">
            <div className="bg-yellow-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="w-12 h-12 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Almost Ready!</h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {selectedProperty && !selectedDateRange 
                ? "Great! Now please select a date range to complete your setup."
                : "Perfect! Now please select a GA4 property to continue."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
