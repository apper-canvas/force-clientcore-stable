import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";

const ContactRow = ({ contact, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewContact = () => {
    navigate(`/contacts/${contact.Id}`);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
            {contact.firstName?.[0]}{contact.lastName?.[0]}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-primary">
              {contact.firstName} {contact.lastName}
            </div>
            <div className="text-sm text-gray-500">{contact.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-primary">{contact.company}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-primary">{contact.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={contact.status} />
<td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={contact.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {contact.lastActivity 
          ? format(new Date(contact.lastActivity), "MMM dd, yyyy")
          : "Never"
        }
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewContact}
            className="p-2"
          >
            <ApperIcon name="Eye" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(contact)}
            className="p-2"
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(contact.Id)}
            className="p-2 text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ContactRow;