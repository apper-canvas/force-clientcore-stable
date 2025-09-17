import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const CompanyRow = ({ company, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "N/A";
    }
  };

  const formatTags = (tags) => {
    if (!tags) return null;
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    return tagArray.slice(0, 2).map((tag, index) => (
      <Badge key={index} variant="secondary" className="mr-1 mb-1 text-xs">
        {tag}
      </Badge>
    ));
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="Building" size={20} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-primary">
              {company.name_c || company.Name || "Unnamed Company"}
            </div>
            <div className="text-sm text-gray-500">
              ID: {company.Id}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {company.address_c || "No address"}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {company.city_c || "Unknown"}, {company.state_c || "Unknown"}
        </div>
        {company.zip_c && (
          <div className="text-sm text-gray-500">{company.zip_c}</div>
        )}
      </td>
      
      <td className="px-6 py-4">
        <div className="flex flex-wrap">
          {formatTags(company.Tags) || (
            <span className="text-sm text-gray-500">No tags</span>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {formatDate(company.CreatedOn)}
        </div>
      </td>
      
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(company)}
            className="text-primary hover:text-accent"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(company.Id)}
            className="text-error hover:text-error/80"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default CompanyRow;