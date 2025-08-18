import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, orderBy, onSnapshot, where, doc, updateDoc, addDoc, serverTimestamp, deleteDoc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/firebase/config";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RegistrationsTable } from "./admin/RegistrationsTable";
import { ContactsTable } from "./admin/ContactsTable";
import { JoiningRequestsTable } from "./admin/JoiningRequestsTable";
import { EventsTable } from "./admin/EventsTable";
import { CreateEventDialog } from "./admin/CreateEventDialog";
import { AdminUsersTable } from "./admin/AdminUsersTable";

export function AdminDashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [joiningRequests, setJoiningRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [registrationTypeFilter, setRegistrationTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("registrations");
  const navigate = useNavigate();

  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [newEventFormData, setNewEventFormData] = useState({
    eventName: "",
    registrationFee: 0,
    currency: "INR",
    description: "",
    isActive: false,
    eventType: "INDIVIDUAL"
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const commonErrorHandler = (collectionName, err) => {
      console.error(`[AdminDashboard] Error fetching ${collectionName}:`, err);
      setError(prevError => `${prevError ? prevError + "\n" : ""}Failed to load ${collectionName}: ${err.message}`);
    };
    
    let initialLoadsPending = 5;
    const checkDoneLoading = () => {
      initialLoadsPending--;
      if (initialLoadsPending === 0) {
        setLoading(false);
      }
    };

    const registrationsQuery = query(collection(db, "registrations"));
    const regUnsubscribe = onSnapshot(registrationsQuery, (querySnapshot) => {
      const registrationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRegistrations(registrationsData);
      checkDoneLoading();
    }, (err) => { commonErrorHandler("registrations", err); checkDoneLoading(); });

    const contactsQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const contactsUnsubscribe = onSnapshot(contactsQuery, (querySnapshot) => {
      const contactsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsData);
      checkDoneLoading();
    }, (err) => { commonErrorHandler("contacts", err); checkDoneLoading(); });

    const joiningRequestsQuery = query(collection(db, "joining_requests"), orderBy("timestamp", "desc"));
    const joiningUnsubscribe = onSnapshot(joiningRequestsQuery, (querySnapshot) => {
      const joiningRequestsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJoiningRequests(joiningRequestsData);
      checkDoneLoading();
    }, (err) => { commonErrorHandler("joining requests", err); checkDoneLoading(); });

    const eventsQuery = query(collection(db, "events"), orderBy("eventName", "asc"));
    const eventsUnsubscribe = onSnapshot(eventsQuery, (querySnapshot) => {
      const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvents(eventsData);
      checkDoneLoading();
    }, (err) => { commonErrorHandler("events", err); checkDoneLoading(); });
    
    const adminUsersQuery = query(collection(db, "admin"), orderBy("email", "asc"));
    const adminUsersUnsubscribe = onSnapshot(adminUsersQuery, (querySnapshot) => {
      const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminUsers(usersData);
      checkDoneLoading();
    }, (err) => { commonErrorHandler("admin users from 'admin' collection", err); checkDoneLoading(); });

    return () => {
      authUnsubscribe();
      regUnsubscribe();
      contactsUnsubscribe();
      joiningUnsubscribe();
      eventsUnsubscribe();
      adminUsersUnsubscribe();
    };
  }, []);

  const handleSignOut = async () => { 
    try {
      await signOut(auth);
      navigate("/admin");
    } catch (err) {
      console.error("[AdminDashboard] Sign out error:", err);
    }
  };
  
  const downloadCSV = () => { 
    let headers = [];
    let CsvData = [];
    let filename = "";
    
    const isHackathon = (reg) => reg.teamName || (reg.members && reg.members.length > 0);
    const getFullName = (reg) => isHackathon(reg) ? reg.teamName || 'N/A' : reg.fullName || 'N/A';
    const getDetails = (reg) => isHackathon(reg) ? `Team Size: ${reg.teamSize || 'N/A'}` : `Reg No: ${reg.registrationNumber || 'N/A'}`;
    const getExtraDetails = (reg) => isHackathon(reg) ? `Leader: ${reg.members?.[0]?.email || 'N/A'}` : `Email: ${reg.email || 'N/A'}`;
    const getDate = (reg) => (reg.registrationTimestamp?.toDate ? reg.registrationTimestamp.toDate().toLocaleString() : (reg.failureTimestamp?.toDate ? reg.failureTimestamp.toDate().toLocaleString() : (reg.timestamp?.toDate ? reg.timestamp.toDate().toLocaleString() : '')));

    if (activeTab === "registrations") {
      headers = ['Event Type', 'Name / Team Name', 'Details 1', 'Details 2', 'Event Name', 'Status', 'Payment ID', 'Order ID', 'Date'];
      CsvData = filteredData.map(reg => [
        reg.eventType || (isHackathon(reg) ? 'HACKATHON' : 'INDIVIDUAL'),
        getFullName(reg),
        getDetails(reg),
        getExtraDetails(reg),
        reg.eventName || 'N/A',
        reg.paymentStatus || 'N/A', 
        reg.paymentId || reg.razorpayPaymentId || 'N/A',
        reg.orderId || reg.razorpayOrderId || 'N/A',
        getDate(reg)
      ]);
      filename = `metaverse_all_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeTab === "contacts") {
      headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Message', 'Service Choice', 'Date'];
      CsvData = filteredData.map(contact => [ contact.fname || '', contact.lname || '', contact.email || '', contact.phone_number || '', contact.message || '', contact.servicechoice || '', (contact.timestamp?.toDate ? contact.timestamp.toDate().toLocaleString() : '') ]);
      filename = `metaverse_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (activeTab === "joining") {
      headers = ['Full Name', 'Email', 'Registration Number', 'Phone', 'Department', 'Reason', 'Date'];
      CsvData = filteredData.map(join => [ join.fullname || '', join.email || '', join.reg_number || '', join.phone_number || '', join.department || '', join.reason || '', (join.timestamp?.toDate ? join.timestamp.toDate().toLocaleString() : '') ]);
      filename = `metaverse_join_requests_${new Date().toISOString().split('T')[0]}.csv`;
    }
    
    const csvContent = [ headers.join(','), ...CsvData.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')) ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const downloadXLSX = () => { 
    let headers = [];
    let XlsxData = [];
    let filename = "";
    
    const isHackathon = (reg) => reg.teamName || (reg.members && reg.members.length > 0);
    const getFullName = (reg) => isHackathon(reg) ? reg.teamName || 'N/A' : reg.fullName || 'N/A';
    const getDetails = (reg) => isHackathon(reg) ? `Team Size: ${reg.teamSize || 'N/A'}` : `Reg No: ${reg.registrationNumber || 'N/A'}`;
    const getExtraDetails = (reg) => isHackathon(reg) ? `Leader: ${reg.members?.[0]?.email || 'N/A'}` : `Email: ${reg.email || 'N/A'}`;
    const getDate = (reg) => (reg.registrationTimestamp?.toDate ? reg.registrationTimestamp.toDate().toLocaleString() : (reg.failureTimestamp?.toDate ? reg.failureTimestamp.toDate().toLocaleString() : (reg.timestamp?.toDate ? reg.timestamp.toDate().toLocaleString() : '')));

    if (activeTab === "registrations") {
      headers = ['Event Type', 'Name / Team Name', 'Details 1', 'Details 2', 'Event Name', 'Status', 'Payment ID', 'Order ID', 'Date'];
      XlsxData = filteredData.map(reg => [
        reg.eventType || (isHackathon(reg) ? 'HACKATHON' : 'INDIVIDUAL'),
        getFullName(reg),
        getDetails(reg),
        getExtraDetails(reg),
        reg.eventName || 'N/A',
        reg.paymentStatus || 'N/A', 
        reg.paymentId || reg.razorpayPaymentId || 'N/A',
        reg.orderId || reg.razorpayOrderId || 'N/A',
        getDate(reg)
      ]);
      filename = `metaverse_all_registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
    } else if (activeTab === "contacts") {
      headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Message', 'Service Choice', 'Date'];
      XlsxData = filteredData.map(contact => [ contact.fname || '', contact.lname || '', contact.email || '', contact.phone_number || '', contact.message || '', contact.servicechoice || '', (contact.timestamp?.toDate ? contact.timestamp.toDate().toLocaleString() : '') ]);
      filename = `metaverse_contacts_${new Date().toISOString().split('T')[0]}.xlsx`;
    } else if (activeTab === "joining") {
      headers = ['Full Name', 'Email', 'Registration Number', 'Phone', 'Department', 'Reason', 'Date'];
      XlsxData = filteredData.map(join => [ join.fullname || '', join.email || '', join.reg_number || '', join.phone_number || '', join.department || '', join.reason || '', (join.timestamp?.toDate ? join.timestamp.toDate().toLocaleString() : '') ]);
      filename = `metaverse_join_requests_${new Date().toISOString().split('T')[0]}.xlsx`;
    }
    
    const tsvContent = [ headers.join('\t'), ...XlsxData.map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join('\t')) ].join('\n');
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActiveData = () => {
    switch(activeTab) {
      case "registrations":
        if (registrationTypeFilter === "all") {
          return registrations;
        } else {
          return registrations.filter(reg => {
            const eventType = reg.eventType || (reg.teamName || (reg.members && reg.members.length > 0) ? 'HACKATHON' : 'INDIVIDUAL');
            return eventType === registrationTypeFilter;
          });
        }
      case "contacts": return contacts;
      case "joining": return joiningRequests;
      case "events": return events;
      case "adminUsers": return adminUsers;
      default: return [];
    }
  };

  const filteredData = getActiveData().filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    if (activeTab === "events") { return ( (item.eventName || '').toLowerCase().includes(term) || (item.description || '').toLowerCase().includes(term) || (item.id || '').toLowerCase().includes(term) ); }
    if (activeTab === "adminUsers") { return (item.email || '').toLowerCase().includes(term) || (item.uid || item.id || '').toLowerCase().includes(term); }
    
    const isHackathonEntry = item.teamName || (item.members && item.members.length > 0);
    const searchFields = [
      isHackathonEntry ? item.teamName : item.fullName,
      item.eventName,
      item.email,
      item.contactNumber,
      item.department
    ].filter(Boolean).map(val => String(val).toLowerCase());
    
    return searchFields.some(field => field.includes(term));
  });

  const highlightMatch = (text, term) => {
    if (!term.trim() || !text) return text;
    const regex = new RegExp(`(${term.trim()})`, 'gi');
    const parts = text.toString().split(regex);
    return parts.map((part, index) => regex.test(part) ? <span key={index} className="bg-yellow-300 text-gray-900 px-0.5 rounded">{part}</span> : part );
  };
  
  const handleSetActiveEvent = async (eventIdToActivate) => {
    if (!auth.currentUser) {
      alert("Authentication error. Please sign out and sign in again.");
      return;
    }
    try {
      const otherEventsQuery = query(collection(db, "events"), where("isActive", "==", true));
      const otherEventsSnapshot = await getDocs(otherEventsQuery);
      
      const batch = writeBatch(db);
      otherEventsSnapshot.docs.forEach(docSnap => {
          if (docSnap.id !== eventIdToActivate) {
              batch.update(doc(db, "events", docSnap.id), { isActive: false });
          }
      });
      await batch.commit();

      const eventRef = doc(db, "events", eventIdToActivate);
      await updateDoc(eventRef, { isActive: true });
      console.log(`Event ${eventIdToActivate} successfully set to active.`);
    } catch (e) {
      console.error("Error setting event active: ", e);
      alert(`Failed to set event active: ${e.message}`);
    }
  };

  const handleNewEventInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? e.target.checked : (type === "number" ? parseFloat(value) * 100 : value);
    setNewEventFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleCreateNewEvent = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Authentication error. Please sign out and sign in again.");
      return;
    }
    if (!newEventFormData.eventName || !newEventFormData.registrationFee || newEventFormData.registrationFee <= 0) {
      alert("Event Name and a valid Registration Fee (greater than 0) are required.");
      return;
    }
    try {
      const eventDataToSave = { ...newEventFormData, createdAt: serverTimestamp() };
      await addDoc(collection(db, "events"), eventDataToSave);
      alert("Event created successfully!");
      setIsCreateEventDialogOpen(false);
      setNewEventFormData({ eventName: "", registrationFee: 0, currency: "INR", description: "", isActive: false });
    } catch (error) {
      console.error("Error creating new event: ", error);
      alert(`Failed to create event: ${error.message}`);
    }
  };

  const handleOpenEditEventDialog = (event) => {
    setNewEventFormData({
      eventName: event.eventName,
      registrationFee: event.registrationFee, 
      currency: event.currency,
      description: event.description || "",
      isActive: event.isActive,
    });
    setEditingEvent(event); 
    setIsEditEventDialogOpen(true);
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("Authentication error. Please sign out and sign in again.");
      return;
    }
    if (!editingEvent || !editingEvent.id) {
      alert("No event selected for editing.");
      return;
    }
    if (!newEventFormData.eventName || !newEventFormData.registrationFee || newEventFormData.registrationFee <= 0) {
      alert("Event Name and a valid Registration Fee (greater than 0) are required.");
      return;
    }
    try {
      const eventRef = doc(db, "events", editingEvent.id);
      await updateDoc(eventRef, { ...newEventFormData });
      alert("Event updated successfully!");
      setIsEditEventDialogOpen(false);
      setEditingEvent(null);
      setNewEventFormData({ eventName: "", registrationFee: 0, currency: "INR", description: "", isActive: false });
    } catch (error) {
      console.error("Error updating event: ", error);
      alert(`Failed to update event: ${error.message}`);
    }
  };

  const handleDeleteEvent = async (eventId, eventName) => { 
    if (!auth.currentUser) {
      alert("Authentication error. Please sign out and sign in again.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete the event "${eventName}"? This action cannot be undone.`)) {
      try {
        const eventRef = doc(db, "events", eventId);
        await deleteDoc(eventRef);
        alert(`Event "${eventName}" deleted successfully.`);
      } catch (error) {
        console.error("Error deleting event: ", error);
        alert(`Failed to delete event: ${e.message}`);
      }
    }
  };
  
  if (loading) { return ( <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-center"><div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div><p>Loading dashboard...</p></div></div> ); }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div><h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Admin Dashboard</h1><p className="text-gray-400">Manage event registrations, contacts, join requests, events, and admin users</p></div>
          <div className="flex items-center space-x-4">{user && ( <div className="flex items-center"> <div className="w-10 h-10 bg-indigo-600 rounded-full mr-2 flex items-center justify-center"><span>{user.email.charAt(0).toUpperCase()}</span></div><span className="mr-4 text-sm hidden md:inline">{user.email}</span></div>)}<Link to="/admin/setup"><Button className="bg-blue-600 hover:bg-blue-700">Admin Setup</Button></Link><Button onClick={handleSignOut} variant="destructive">Sign Out</Button></div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-gray-700 mb-6">
          {["registrations", "contacts", "joining", "events", "adminUsers"].map((tabName) => (
            <button key={tabName} className={`px-4 py-2 font-medium ${activeTab === tabName ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`} onClick={() => { setActiveTab(tabName); setSearchTerm(""); setRegistrationTypeFilter("all"); }}>
              {tabName === "registrations" && `Event Registrations (${registrations.length})`}
              {tabName === "contacts" && `Contact Submissions (${contacts.length})`}
              {tabName === "joining" && `Join Requests (${joiningRequests.length})`}
              {tabName === "events" && `Manage Events (${events.length})`}
              {tabName === "adminUsers" && `Admin Users (${adminUsers.length})`}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-gray-800/80 rounded-xl shadow-xl p-6 border border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">
              {activeTab === "registrations" && `Registrations (${filteredData.length})`}
              {activeTab === "contacts" && `Contact Submissions (${filteredData.length})`}
              {activeTab === "joining" && `Join Requests (${filteredData.length})`}
              {activeTab === "events" && `Events (${filteredData.length})`}
              {activeTab === "adminUsers" && `Admin Users (${filteredData.length})`}
            </h2>
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto items-center">
              {activeTab === "registrations" && (
                <select
                  value={registrationTypeFilter}
                  onChange={(e) => setRegistrationTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-700/50 border border-gray-700 rounded-lg text-sm text-white"
                >
                  <option value="all">All Registrations</option>
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="HACKATHON">Hackathon</option>
                </select>
              )}
              {(activeTab !== "events" && activeTab !== "adminUsers") && ( 
                <>
                  <div className="relative w-full md:w-64"><input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-700/50 border border-gray-700 rounded-lg" /></div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700">Export Data</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 bg-gray-700 border-gray-600 text-white">
                      <DropdownMenuItem onClick={downloadCSV} className="hover:bg-gray-600">Download as CSV</DropdownMenuItem>
                      <DropdownMenuItem onClick={downloadXLSX} className="hover:bg-gray-600">Download as Excel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              {activeTab === "events" && ( <Dialog open={isCreateEventDialogOpen || isEditEventDialogOpen} onOpenChange={isEditEventDialogOpen ? setIsEditEventDialogOpen : setIsCreateEventDialogOpen}><DialogTrigger asChild><Button className="bg-green-600 hover:bg-green-700" onClick={() => { setEditingEvent(null); setNewEventFormData({ eventName: "", registrationFee: 0, currency: "INR", description: "", isActive: false }); setIsCreateEventDialogOpen(true); }}>Create New Event</Button></DialogTrigger></Dialog>)}
            </div>
          </div>

          {error && <div className="bg-red-900/20 border border-red-800/40 p-4 rounded-lg text-center">{error}</div>}
          {!error && (
            <div className="overflow-x-auto">
              {filteredData.length === 0 ? (
                <div className="text-center py-8"><p className="text-gray-400">No data available for "{activeTab}"{searchTerm && ` matching "${searchTerm}"`}.</p></div>
              ) : (
                <>
                  {activeTab === "registrations" && <RegistrationsTable data={filteredData} highlightMatch={highlightMatch} searchTerm={searchTerm} />}
                  {activeTab === "contacts" && <ContactsTable data={filteredData} highlightMatch={highlightMatch} searchTerm={searchTerm} />}
                  {activeTab === "joining" && <JoiningRequestsTable data={filteredData} highlightMatch={highlightMatch} searchTerm={searchTerm} />}
                  {activeTab === "events" && <EventsTable data={filteredData} highlightMatch={highlightMatch} searchTerm={searchTerm} onSetActive={handleSetActiveEvent} onEdit={handleOpenEditEventDialog} onDelete={handleDeleteEvent} />}
                  {activeTab === "adminUsers" && <AdminUsersTable data={filteredData} highlightMatch={highlightMatch} searchTerm={searchTerm} />}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateEventDialog 
        key={editingEvent ? `edit-${editingEvent.id}` : 'create'}
        isOpen={isCreateEventDialogOpen || isEditEventDialogOpen} 
        onOpenChange={editingEvent ? setIsEditEventDialogOpen : setIsCreateEventDialogOpen}
        formData={newEventFormData}
        onInputChange={handleNewEventInputChange}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateNewEvent}
        isEditMode={!!editingEvent}
        onClose={() => { 
          setIsCreateEventDialogOpen(false);
          setIsEditEventDialogOpen(false);
          setEditingEvent(null);
          setNewEventFormData({ eventName: "", registrationFee: 0, currency: "INR", description: "", isActive: false });
        }}
      />
    </section>
  );
}