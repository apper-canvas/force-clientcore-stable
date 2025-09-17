import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const QuoteCard = ({ quote, contact, deal, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Draft":
        return "gray";
      case "Sent":
        return "blue";
      case "Accepted":
        return "green";
      case "Rejected":
        return "red";
      default:
        return "gray";
    }
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 border-l-4 border-l-accent">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-primary text-sm mb-1 line-clamp-2">
              {quote.Name || "Unnamed Quote"}
            </h4>
            <div className="flex items-center gap-2">
              <StatusBadge
                status={quote.status_c || "Draft"}
                color={getStatusColor(quote.status_c || "Draft")}
                size="sm"
              />
              {isExpired(quote.expires_on_c) && (
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  Expired
                </span>
              )}
              {isExpiringSoon(quote.expires_on_c) && !isExpired(quote.expires_on_c) && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Expiring Soon
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(quote)}
              className="p-1.5"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(quote.Id)}
              className="p-1.5 text-error hover:text-error"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>

        {/* Company */}
        {quote.company_c && (
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="Building" size={14} className="text-gray-400" />
            <span className="text-gray-700 truncate">{quote.company_c}</span>
          </div>
        )}

        {/* Contact */}
        {contact && (
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="User" size={14} className="text-gray-400" />
            <span className="text-gray-700 truncate">
              {contact.first_name_c} {contact.last_name_c}
            </span>
          </div>
        )}

        {/* Deal */}
        {deal && (
          <div className="flex items-center gap-2 text-sm">
            <ApperIcon name="DollarSign" size={14} className="text-gray-400" />
            <span className="text-gray-700 truncate">
              {deal.title_c || deal.title}
            </span>
          </div>
        )}

        {/* Dates */}
        <div className="space-y-2 text-xs text-gray-600 border-t pt-2">
          <div className="flex items-center justify-between">
            <span>Quote Date:</span>
            <span>{formatDate(quote.quote_date_c)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Expires:</span>
            <span className={isExpired(quote.expires_on_c) ? "text-red-600 font-medium" : ""}>
              {formatDate(quote.expires_on_c)}
            </span>
          </div>
          {quote.delivery_method_c && (
            <div className="flex items-center justify-between">
              <span>Delivery:</span>
              <span className="truncate ml-2">{quote.delivery_method_c}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {quote.Tags && (
          <div className="flex flex-wrap gap-1">
            {quote.Tags.split(',').map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full truncate"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuoteCard;