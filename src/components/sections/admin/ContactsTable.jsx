import React from "react";
import { motion } from "framer-motion";

export function ContactsTable({ data, highlightMatch, searchTerm }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-4">No contact submissions to display.</p>;
  }

  return (
    <table className="w-full border-collapse min-w-[700px] text-sm">
      <thead>
        <tr className="bg-gray-700/50 text-left">
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Phone</th>
          <th className="p-3">Message</th>
          <th className="p-3">Service Choice</th>
          <th className="p-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((contact, index) => (
          <motion.tr 
            key={contact.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-750/40"} hover:bg-gray-700/70 text-gray-300`}
          >
            <td className="p-2 border-t border-gray-700">{highlightMatch(`${contact.fname || ''} ${contact.lname || ''}`.trim(), searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(contact.email, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(contact.phone_number, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 truncate max-w-xs" title={contact.message}>{highlightMatch(contact.message, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(contact.servicechoice, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 text-xs">
              { (contact.timestamp && contact.timestamp.toDate) ? contact.timestamp.toDate().toLocaleString() : "N/A" }
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}
