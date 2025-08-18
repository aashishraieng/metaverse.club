import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react"; // Icon for edit and delete

export function EventsTable({ data, highlightMatch, searchTerm, onSetActive, onEdit, onDelete }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-400 text-center py-4">No events to display. Create one using the button above!</p>;
  }

  return (
    <table className="w-full border-collapse min-w-[600px] text-sm">
      <thead>
        <tr className="bg-gray-700/50 text-left">
          <th className="p-3">Event Name</th>
          <th className="p-3">Event Type</th>
          <th className="p-3">Fee</th>
          <th className="p-3">Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.filter(event => event && event.eventName).map((event, index) => (
          <motion.tr 
            key={event.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`${index % 2 === 0 ? "bg-gray-800/60" : "bg-gray-750/40"} hover:bg-gray-700/70 text-gray-300`}
          >
            <td className="p-3 border-t border-gray-700">{highlightMatch(event.eventName, searchTerm)}</td>
            <td className="p-3 border-t border-gray-700">{event.eventType || "N/A"}</td>
            <td className="p-3 border-t border-gray-700">
                {typeof event.registrationFee === 'number' ? (
                    (event.registrationFee / 100).toFixed(2)
                ) : (
                    'N/A'
                )} {event.currency || 'INR'}
            </td>
            <td className="p-3 border-t border-gray-700">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                event.isActive ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"
              }`}>
                {event.isActive ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="p-3 border-t border-gray-700 space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(event)}
                className="text-blue-400 border-blue-400 hover:bg-blue-400/10 hover:text-blue-300"
              >
                <Edit2 className="h-3 w-3 mr-1" /> Edit
              </Button>
              {!event.isActive && (
                <Button 
                  size="sm" 
                  onClick={() => onSetActive(event.id, event.eventType)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Set Active
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(event.id, event.eventName)}
                className="text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 className="h-3 w-3 mr-1" /> Delete
              </Button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  );
}