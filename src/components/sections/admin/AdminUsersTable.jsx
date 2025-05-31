import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Button might not be needed anymore if actions are removed
// import { Edit2, Trash2 } from "lucide-react"; // Icons no longer needed

export function AdminUsersTable({ data, highlightMatch, searchTerm }) { // Removed onEditUser, onDeleteUser
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-4">No admin users to display.</p>;
  }

  return (
    <table className="w-full border-collapse min-w-[600px] text-sm">
      <thead>
        <tr className="bg-gray-700/50 text-left">
          <th className="p-3">Email</th>
          <th className="p-3">UID</th>
          <th className="p-3">Roles (Placeholder)</th>
          {/* <th className="p-3">Actions</th> Removed Actions column */}
        </tr>
      </thead>
      <tbody>
        {data.map((user, index) => (
          <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className={`${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-750/40"} hover:bg-gray-700/70 text-gray-300`}
          ><td className="p-3 border-t border-gray-700">{highlightMatch(user.email, searchTerm)}</td><td className="p-3 border-t border-gray-700">{highlightMatch(user.uid || user.id, searchTerm)}</td><td className="p-3 border-t border-gray-700">Admin</td>{/* Placeholder for roles */}
            {/* Removed Actions td */}
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}
