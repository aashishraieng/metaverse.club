import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

// This is the updated sub-component to display member details
const MemberDetails = ({ members }) => {
  if (!members || members.length === 0) {
    return (
      <div className="p-4 text-gray-500 bg-gray-800/50">
        No member details available.
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-900/70">
      <h4 className="font-semibold mb-4 text-lg text-gray-200">Team Members</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-800/50">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Registration No.</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contact Number</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={index}
                className="border-b border-gray-700/50 hover:bg-gray-800/60"
              >
                <td className="px-4 py-3 font-medium text-white">
                  {member.fullName}
                </td>
                <td className="px-4 py-3">{member.registrationNumber}</td>
                <td className="px-4 py-3">{member.email}</td>
                <td className="px-4 py-3">{member.contactNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export function RegistrationsTable({ data, highlightMatch, searchTerm }) {
  const [expandedRow, setExpandedRow] = useState(null);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const isHackathon = (reg) => {
    return reg.teamName || (reg.members && reg.members.length > 0);
  };

  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-4">No registration data to display.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="w-full border-collapse min-w-[800px] text-sm">
        <thead>
          <tr className="bg-gray-700/50 text-left">
            <th className="p-3">Event Type</th>
            <th className="p-3">Name / Team Name</th>
            <th className="p-3">Details</th>
            <th className="p-3">Event</th>
            <th className="p-3">Status</th>
            <th className="p-3">Payment ID</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((reg, index) => {
            const isHackathonEntry = isHackathon(reg);
            return (
              <React.Fragment key={reg.id}>
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className={`${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-750/40"} hover:bg-gray-700/70 ${reg.paymentStatus === "FAILED" ? "text-red-400" : "text-gray-300"} ${isHackathonEntry ? 'cursor-pointer' : ''}`}
                  onClick={() => isHackathonEntry && toggleRow(reg.id)}
                >
                  <td className="p-2 border-t border-gray-700 font-medium">
                    {reg.eventType || (isHackathonEntry ? 'HACKATHON' : 'INDIVIDUAL')}
                    {isHackathonEntry && (
                      <span className="ml-2">
                        {expandedRow === reg.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    )}
                  </td>
                  <td className="p-2 border-t border-gray-700 font-medium text-white">
                    {isHackathonEntry ? highlightMatch(reg.teamName || 'N/A', searchTerm) : highlightMatch(reg.fullName || 'N/A', searchTerm)}
                  </td>
                  <td className="p-2 border-t border-gray-700 text-xs">
                    {isHackathonEntry ? `Team Size: ${reg.teamSize || 'N/A'}` : `Reg No: ${reg.registrationNumber || 'N/A'}`}
                    <br />
                    {isHackathonEntry ? `Leader: ${reg.members?.[0]?.email || 'N/A'}` : `Email: ${reg.email || 'N/A'}`}
                  </td>
                  <td className="p-2 border-t border-gray-700">{highlightMatch(reg.eventName || 'N/A', searchTerm)}</td>
                  <td className="p-2 border-t border-gray-700">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      reg.paymentStatus === "SUCCESSFUL" ? "bg-green-500/20 text-green-300" :
                      reg.paymentStatus === "FAILED" ? "bg-red-500/20 text-red-300" : "bg-gray-500/20 text-gray-300"
                    }`}>
                      {highlightMatch(reg.paymentStatus || 'N/A', searchTerm)}
                    </span>
                  </td>
                  <td className="p-2 border-t border-gray-700 text-xs">{highlightMatch(reg.paymentId || reg.razorpayPaymentId || 'N/A', searchTerm)}</td>
                  <td className="p-2 border-t border-gray-700 text-xs">
                    { (reg.registrationTimestamp && reg.registrationTimestamp.toDate) ? reg.registrationTimestamp.toDate().toLocaleString() :
                      (reg.failureTimestamp && reg.failureTimestamp.toDate) ? reg.failureTimestamp.toDate().toLocaleString() :
                      (reg.timestamp && reg.timestamp.toDate) ? reg.timestamp.toDate().toLocaleString() : "N/A" }
                  </td>
                </motion.tr>
                {expandedRow === reg.id && (
                  <tr>
                    <td colSpan="7" className="p-0 border-t-2 border-gray-700">
                      <MemberDetails members={reg.members} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}