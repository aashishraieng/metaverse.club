import React from "react";
import { motion } from "framer-motion";

export function RegistrationsTable({ data, highlightMatch, searchTerm }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-4">No registration data to display.</p>;
  }

  return (
    <table className="w-full border-collapse min-w-[800px] text-sm">
      <thead>
        <tr className="bg-gray-700/50 text-left">
          <th className="p-3">Full Name</th>
          <th className="p-3">Reg No.</th>
          <th className="p-3">Email</th>
          <th className="p-3">Event</th>
          <th className="p-3">Status</th>
          <th className="p-3">Payment ID</th>
          <th className="p-3">Order ID</th>
          <th className="p-3">Date</th>
          <th className="p-3">Department</th>
          <th className="p-3">Contact No.</th>
          <th className="p-3">Error Code</th>
          <th className="p-3">Error Desc.</th>
        </tr>
      </thead>
      <tbody>
        {data.map((reg, index) => (
          <motion.tr 
            key={reg.id} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-750/40"} hover:bg-gray-700/70 ${reg.paymentStatus === "FAILED" ? "text-red-400" : "text-gray-300"}`}
          >
            <td className="p-2 border-t border-gray-700">{highlightMatch(reg.fullName || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(reg.registrationNumber || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(reg.email || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(reg.eventName || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                reg.paymentStatus === "SUCCESSFUL" ? "bg-green-500/20 text-green-300" : 
                reg.paymentStatus === "FAILED" ? "bg-red-500/20 text-red-300" : "bg-gray-500/20 text-gray-300"
              }`}>
                {highlightMatch(reg.paymentStatus || 'N/A', searchTerm)}
              </span>
            </td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(reg.paymentId || reg.razorpayPaymentId || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(reg.orderId || reg.razorpayOrderId || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 text-xs">
              { (reg.registrationTimestamp && reg.registrationTimestamp.toDate) ? reg.registrationTimestamp.toDate().toLocaleString() :
                (reg.failureTimestamp && reg.failureTimestamp.toDate) ? reg.failureTimestamp.toDate().toLocaleString() :
                (reg.timestamp && reg.timestamp.toDate) ? reg.timestamp.toDate().toLocaleString() : "N/A" }
            </td>
            <td className="p-2 border-t border-gray-700 text-xs">{highlightMatch(reg.department || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 text-xs">{highlightMatch(reg.contactNumber || 'N/A', searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 text-xs">{reg.paymentStatus === "FAILED" ? highlightMatch(reg.errorCode || 'N/A', searchTerm) : 'N/A'}</td>
            <td className="p-2 border-t border-gray-700 text-xs truncate max-w-[150px]" title={reg.errorDescription}>
              {reg.paymentStatus === "FAILED" ? highlightMatch(reg.errorDescription || 'N/A', searchTerm) : 'N/A'}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}
