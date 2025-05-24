import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/firebase/config";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [joiningRequests, setJoiningRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [searchCategory, setSearchCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("registrations");
  const navigate = useNavigate();

  console.log("[AdminDashboard] Component rendered");

  useEffect(() => {
    console.log("[AdminDashboard] useEffect running to check auth state");
    
    // Check authentication state to get user info, but don't redirect
    // ProtectedRoute component already handles redirects for us
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(`[AdminDashboard] Auth state changed: ${currentUser ? currentUser.email : 'No user'}`);
      setUser(currentUser);
      
      if (currentUser) {
        console.log(`[AdminDashboard] User authenticated: ${currentUser.email}`);
        fetchAllData();
      }
    });

    return () => {
      console.log("[AdminDashboard] Cleanup - unsubscribing from auth");
      unsubscribe();
    };
  }, []);

  // Fetch all data collections
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchRegistrations(),
        fetchContacts(),
        fetchJoiningRequests()
      ]);
    } catch (err) {
      console.error("[AdminDashboard] Error fetching data:", err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    console.log("[AdminDashboard] Fetching registrations");
    try {
      const registrationsQuery = query(
        collection(db, "registrations"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(registrationsQuery);
      
      const registrationsData = [];
      querySnapshot.forEach((doc) => {
        registrationsData.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`[AdminDashboard] Fetched ${registrationsData.length} registrations`);
      setRegistrations(registrationsData);
      return registrationsData;
    } catch (err) {
      console.error("[AdminDashboard] Error fetching registrations:", err);
      throw err;
    }
  };

  const fetchContacts = async () => {
    console.log("[AdminDashboard] Fetching contacts");
    try {
      const contactsQuery = query(
        collection(db, "contacts"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(contactsQuery);
      
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`[AdminDashboard] Fetched ${contactsData.length} contacts`);
      setContacts(contactsData);
      return contactsData;
    } catch (err) {
      console.error("[AdminDashboard] Error fetching contacts:", err);
      throw err;
    }
  };

  const fetchJoiningRequests = async () => {
    console.log("[AdminDashboard] Fetching joining requests");
    try {
      const joiningRequestsQuery = query(
        collection(db, "joining_requests"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(joiningRequestsQuery);
      
      const joiningRequestsData = [];
      querySnapshot.forEach((doc) => {
        joiningRequestsData.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`[AdminDashboard] Fetched ${joiningRequestsData.length} joining requests`);
      setJoiningRequests(joiningRequestsData);
      return joiningRequestsData;
    } catch (err) {
      console.error("[AdminDashboard] Error fetching joining requests:", err);
      throw err;
    }
  };

  const handleSignOut = async () => {
    console.log("[AdminDashboard] Signing out");
    try {
      await signOut(auth);
      console.log("[AdminDashboard] Sign out successful, navigating to login");
      navigate("/admin");
    } catch (err) {
      console.error("[AdminDashboard] Sign out error:", err);
    }
  };

  // Download data as CSV
  const downloadCSV = () => {
    console.log(`[AdminDashboard] Downloading ${activeTab} as CSV`);
    let headers = [];
    let data = [];
    let filename = "";
    
    if (activeTab === "registrations") {
      headers = ['Name', 'Registration Number', 'Email', 'Department', 'Contact Number', 'Registration Date'];
      data = filteredData.map(reg => [
        reg.name || '',
        reg.reg_number || '',
        reg.email || '',
        reg.department || '',
        reg.contact_number || '',
        reg.timestamp?.toDate ? reg.timestamp.toDate().toLocaleString() : ''
      ]);
      filename = `metaverse_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    } 
    else if (activeTab === "contacts") {
      headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Message', 'Service Choice', 'Date'];
      data = filteredData.map(contact => [
        contact.fname || '',
        contact.lname || '',
        contact.email || '',
        contact.phone_number || '',
        contact.message || '',
        contact.servicechoice || '',
        contact.timestamp?.toDate ? contact.timestamp.toDate().toLocaleString() : ''
      ]);
      filename = `metaverse_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    }
    else if (activeTab === "joining") {
      headers = ['Full Name', 'Email', 'Registration Number', 'Phone', 'Department', 'Reason', 'Date'];
      data = filteredData.map(join => [
        join.fullname || '',
        join.email || '',
        join.reg_number || '',
        join.phone_number || '',
        join.department || '',
        join.reason || '',
        join.timestamp?.toDate ? join.timestamp.toDate().toLocaleString() : ''
      ]);
      filename = `metaverse_join_requests_${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download data as XLSX
  const downloadXLSX = () => {
    console.log(`[AdminDashboard] Downloading ${activeTab} as XLSX`);
    let headers = [];
    let data = [];
    let filename = "";
    
    if (activeTab === "registrations") {
      headers = ['Name', 'Registration Number', 'Email', 'Department', 'Contact Number', 'Registration Date'];
      data = filteredData.map(reg => [
        reg.name || '',
        reg.reg_number || '',
        reg.email || '',
        reg.department || '',
        reg.contact_number || '',
        reg.timestamp?.toDate ? reg.timestamp.toDate().toLocaleString() : ''
      ]);
      filename = `metaverse_registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
    } 
    else if (activeTab === "contacts") {
      headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Message', 'Service Choice', 'Date'];
      data = filteredData.map(contact => [
        contact.fname || '',
        contact.lname || '',
        contact.email || '',
        contact.phone_number || '',
        contact.message || '',
        contact.servicechoice || '',
        contact.timestamp?.toDate ? contact.timestamp.toDate().toLocaleString() : ''
      ]);
      filename = `metaverse_contacts_${new Date().toISOString().split('T')[0]}.xlsx`;
    }
    else if (activeTab === "joining") {
      headers = ['Full Name', 'Email', 'Registration Number', 'Phone', 'Department', 'Reason', 'Date'];
      data = filteredData.map(join => [
        join.fullname || '',
        join.email || '',
        join.reg_number || '',
        join.phone_number || '',
        join.department || '',
        join.reason || '',
        join.timestamp?.toDate ? join.timestamp.toDate().toLocaleString() : ''
      ]);
      filename = `metaverse_join_requests_${new Date().toISOString().split('T')[0]}.xlsx`;
    }
    
    // Combine headers and data for TSV (Excel)
    const tsvContent = [
      headers.join('\t'),
      ...data.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join('\t'))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get the appropriate data array based on active tab
  const getActiveData = () => {
    switch(activeTab) {
      case "registrations":
        return registrations;
      case "contacts":
        return contacts;
      case "joining":
        return joiningRequests;
      default:
        return [];
    }
  };

  // Filter data based on search term and category
  const filteredData = getActiveData().filter((item) => {
    if (!searchTerm.trim()) return true;
    
    const term = searchTerm.toLowerCase().trim();
    
    if (activeTab === "registrations") {
      if (searchCategory === "all") {
        // Search all fields
        return (
          (item.name || '').toLowerCase().includes(term) ||
          (item.reg_number || '').toLowerCase().includes(term) ||
          (item.email || '').toLowerCase().includes(term) ||
          (item.department || '').toLowerCase().includes(term) ||
          (item.contact_number || '').toLowerCase().includes(term)
        );
      } else if (searchCategory === "name") {
        return (item.name || '').toLowerCase().includes(term);
      } else if (searchCategory === "reg_number") {
        return (item.reg_number || '').toLowerCase().includes(term);
      } else if (searchCategory === "email") {
        return (item.email || '').toLowerCase().includes(term);
      } else if (searchCategory === "department") {
        return (item.department || '').toLowerCase().includes(term);
      } else if (searchCategory === "contact") {
        return (item.contact_number || '').toLowerCase().includes(term);
      }
    } 
    else if (activeTab === "contacts") {
      if (searchCategory === "all") {
        return (
          (item.fname || '').toLowerCase().includes(term) ||
          (item.lname || '').toLowerCase().includes(term) ||
          (item.email || '').toLowerCase().includes(term) ||
          (item.phone_number || '').toLowerCase().includes(term) ||
          (item.message || '').toLowerCase().includes(term) ||
          (item.servicechoice || '').toLowerCase().includes(term)
        );
      } else if (searchCategory === "name") {
        return ((item.fname || '') + ' ' + (item.lname || '')).toLowerCase().includes(term);
      } else if (searchCategory === "email") {
        return (item.email || '').toLowerCase().includes(term);
      } else if (searchCategory === "message") {
        return (item.message || '').toLowerCase().includes(term);
      } else if (searchCategory === "contact") {
        return (item.phone_number || '').toLowerCase().includes(term);
      }
    }
    else if (activeTab === "joining") {
      if (searchCategory === "all") {
        return (
          (item.fullname || '').toLowerCase().includes(term) ||
          (item.email || '').toLowerCase().includes(term) ||
          (item.reg_number || '').toLowerCase().includes(term) ||
          (item.department || '').toLowerCase().includes(term) ||
          (item.phone_number || '').toLowerCase().includes(term) ||
          (item.reason || '').toLowerCase().includes(term)
        );
      } else if (searchCategory === "name") {
        return (item.fullname || '').toLowerCase().includes(term);
      } else if (searchCategory === "reg_number") {
        return (item.reg_number || '').toLowerCase().includes(term);
      } else if (searchCategory === "email") {
        return (item.email || '').toLowerCase().includes(term);
      } else if (searchCategory === "department") {
        return (item.department || '').toLowerCase().includes(term);
      } else if (searchCategory === "contact") {
        return (item.phone_number || '').toLowerCase().includes(term);
      } else if (searchCategory === "reason") {
        return (item.reason || '').toLowerCase().includes(term);
      }
    }
    
    return true;
  });

  // Highlight matching text
  const highlightMatch = (text, term) => {
    if (!term.trim() || !text) return text;
    
    const regex = new RegExp(`(${term.trim()})`, 'gi');
    const parts = text.toString().split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <span key={index} className="bg-yellow-300 text-gray-900 px-0.5 rounded">{part}</span> : part
    );
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Admin Dashboard</h1>
            <p className="text-gray-400">Manage event registrations, contacts, and join requests</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-600 rounded-full mr-2 flex items-center justify-center">
                  <span>{user.email.charAt(0).toUpperCase()}</span>
                </div>
                <span className="mr-4 text-sm hidden md:inline">{user.email}</span>
              </div>
            )}
            <Link to="/admin/setup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Admin Setup
              </Button>
            </Link>
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "registrations" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-white"}`}
            onClick={() => {
              setActiveTab("registrations");
              setSearchTerm("");
              setSearchCategory("all");
            }}
          >
            Event Registrations ({registrations.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "contacts" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-white"}`}
            onClick={() => {
              setActiveTab("contacts");
              setSearchTerm("");
              setSearchCategory("all");
            }}
          >
            Contact Submissions ({contacts.length})
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "joining" 
              ? "text-blue-400 border-b-2 border-blue-500" 
              : "text-gray-400 hover:text-white"}`}
            onClick={() => {
              setActiveTab("joining");
              setSearchTerm("");
              setSearchCategory("all");
            }}
          >
            Join Requests ({joiningRequests.length})
          </button>
        </div>

        <div className="bg-gray-800/80 rounded-xl shadow-xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">
              {activeTab === "registrations" && `Registrations (${filteredData.length})`}
              {activeTab === "contacts" && `Contact Submissions (${filteredData.length})`}
              {activeTab === "joining" && `Join Requests (${filteredData.length})`}
            </h2>
            
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all focus:outline-none"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-700/50 border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all focus:outline-none text-sm"
                >
                  <option value="all">All Fields</option>
                  <option value="name">Name</option>
                  {activeTab === "registrations" && (
                    <>
                      <option value="reg_number">Reg Number</option>
                      <option value="email">Email</option>
                      <option value="department">Department</option>
                      <option value="contact">Contact</option>
                    </>
                  )}
                  {activeTab === "contacts" && (
                    <>
                      <option value="email">Email</option>
                      <option value="contact">Phone</option>
                      <option value="message">Message</option>
                    </>
                  )}
                  {activeTab === "joining" && (
                    <>
                      <option value="reg_number">Reg Number</option>
                      <option value="email">Email</option>
                      <option value="department">Department</option>
                      <option value="contact">Contact</option>
                      <option value="reason">Reason</option>
                    </>
                  )}
                </select>
              </div>
              
              <div className="relative">
                <Button 
                  onClick={() => setShowExportOptions(!showExportOptions)}
                  className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </Button>
                
                {showExportOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-10 border border-gray-700 overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          downloadCSV();
                          setShowExportOptions(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download as CSV
                      </button>
                      <button
                        onClick={() => {
                          downloadXLSX();
                          setShowExportOptions(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download as Excel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/20 border border-red-800/40 p-4 rounded-lg text-center">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredData.length === 0 ? (
                searchTerm ? (
                  <div className="bg-gray-700/50 rounded-lg p-8 text-center border border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium mb-2">No matching results</h3>
                    <p className="text-gray-400">No items found matching "{searchTerm}"</p>
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <div className="bg-gray-700/50 rounded-lg p-8 text-center border border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="text-lg font-medium">No data available</h3>
                    <p className="text-gray-400">
                      {activeTab === "registrations" && "No registrations found. They will appear here once users register."}
                      {activeTab === "contacts" && "No contact submissions found. They will appear here when users submit the contact form."}
                      {activeTab === "joining" && "No join requests found. They will appear here when users apply to join."}
                    </p>
                  </div>
                )
              ) : (
                <>
                  {/* Registrations Table */}
                  {activeTab === "registrations" && (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-700/50 text-left">
                          <th className="p-3 rounded-tl-lg">Name</th>
                          <th className="p-3">Registration Number</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3 rounded-tr-lg">Registration Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((reg, index) => (
                          <motion.tr
                            key={reg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-750/30"}
                          >
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(reg.name || 'N/A', searchTerm) : (reg.name || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(reg.reg_number || 'N/A', searchTerm) : (reg.reg_number || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(reg.email || 'N/A', searchTerm) : (reg.email || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(reg.department || 'N/A', searchTerm) : (reg.department || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(reg.contact_number || 'N/A', searchTerm) : (reg.contact_number || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">
                              {reg.timestamp?.toDate 
                                ? reg.timestamp.toDate().toLocaleString() 
                                : "N/A"}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Contacts Table */}
                  {activeTab === "contacts" && (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-700/50 text-left">
                          <th className="p-3 rounded-tl-lg">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Message</th>
                          <th className="p-3">Service Choice</th>
                          <th className="p-3 rounded-tr-lg">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((contact, index) => (
                          <motion.tr
                            key={contact.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-750/30"}
                          >
                            <td className="p-3 border-t border-gray-800">
                              {searchTerm 
                                ? highlightMatch(`${contact.fname || ''} ${contact.lname || ''}`.trim() || 'N/A', searchTerm) 
                                : (`${contact.fname || ''} ${contact.lname || ''}`.trim() || 'N/A')}
                            </td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(contact.email || 'N/A', searchTerm) : (contact.email || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(contact.phone_number || 'N/A', searchTerm) : (contact.phone_number || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800 max-w-xs truncate">
                              {searchTerm ? highlightMatch(contact.message || 'N/A', searchTerm) : (contact.message || 'N/A')}
                            </td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(contact.servicechoice || 'N/A', searchTerm) : (contact.servicechoice || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">
                              {contact.timestamp?.toDate 
                                ? contact.timestamp.toDate().toLocaleString() 
                                : "N/A"}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Joining Requests Table */}
                  {activeTab === "joining" && (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-700/50 text-left">
                          <th className="p-3 rounded-tl-lg">Name</th>
                          <th className="p-3">Email</th>
                          <th className="p-3">Reg Number</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Contact</th>
                          <th className="p-3">Reason</th>
                          <th className="p-3 rounded-tr-lg">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData.map((join, index) => (
                          <motion.tr
                            key={join.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-750/30"}
                          >
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(join.fullname || 'N/A', searchTerm) : (join.fullname || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(join.email || 'N/A', searchTerm) : (join.email || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(join.reg_number || 'N/A', searchTerm) : (join.reg_number || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(join.department || 'N/A', searchTerm) : (join.department || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800">{searchTerm ? highlightMatch(join.phone_number || 'N/A', searchTerm) : (join.phone_number || 'N/A')}</td>
                            <td className="p-3 border-t border-gray-800 max-w-xs truncate">
                              {searchTerm ? highlightMatch(join.reason || 'N/A', searchTerm) : (join.reason || 'N/A')}
                            </td>
                            <td className="p-3 border-t border-gray-800">
                              {join.timestamp?.toDate 
                                ? join.timestamp.toDate().toLocaleString() 
                                : "N/A"}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 