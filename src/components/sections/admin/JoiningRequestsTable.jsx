import React from "react";
import { motion } from "framer-motion";

export function JoiningRequestsTable({ data, highlightMatch, searchTerm }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-4">No joining requests to display.</p>;
  }

  return (
    <table className="w-full border-collapse min-w-[800px] text-sm">
      <thead>
        <tr className="bg-gray-700/50 text-left">
          <th className="p-3">Name</th>
          <th className="p-3">Email</th>
          <th className="p-3">Reg No.</th>
          <th className="p-3">Department</th>
          <th className="p-3">Contact</th>
          <th className="p-3">Reason</th>
          <th className="p-3">Date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((join, index) => (
          <motion.tr 
            key={join.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-750/40"} hover:bg-gray-700/70 text-gray-300`}
          >
            <td className="p-2 border-t border-gray-700">{highlightMatch(join.fullname, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(join.email, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(join.reg_number, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(join.department, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700">{highlightMatch(join.phone_number, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 truncate max-w-xs" title={join.reason}>{highlightMatch(join.reason, searchTerm)}</td>
            <td className="p-2 border-t border-gray-700 text-xs">
              { (join.timestamp && join.timestamp.toDate) ? join.timestamp.toDate().toLocaleString() : "N/A" }
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}
