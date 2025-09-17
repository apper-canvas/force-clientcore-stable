import { format } from "date-fns";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ActivityItem = ({ activity, contact, deal }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "Call":
        return "Phone";
      case "Email":
        return "Mail";
      case "Meeting":
        return "Calendar";
      case "Note":
        return "FileText";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "Call":
        return "info";
      case "Email":
        return "accent";
      case "Meeting":
        return "warning";
      case "Note":
        return "primary";
      default:
        return "default";
    }
  };

  return (
    <Card className="p-4 mb-3 bg-gradient-to-br from-surface to-gray-50">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br from-${getActivityColor(activity.type)}/10 to-${getActivityColor(activity.type)}/5`}>
          <ApperIcon 
            name={getActivityIcon(activity.type)} 
            size={16} 
            className={`text-${getActivityColor(activity.type)}`}
          />
        </div>
        
        <div className="flex-1">
<div className="flex items-center gap-2 mb-2">
            <Badge variant={getActivityColor(activity.type)}>{activity.type}</Badge>
            <span className="text-sm text-gray-500">
              {activity?.date ? format(new Date(activity.date), "MMM dd, yyyy 'at' h:mm a") : "Invalid date"}
            </span>
          </div>
          <p className="text-primary font-medium mb-1">{activity.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {contact && (
              <div className="flex items-center">
                <ApperIcon name="User" size={14} className="mr-1" />
                {contact.firstName} {contact.lastName}
              </div>
            )}
            {deal && (
              <div className="flex items-center">
                <ApperIcon name="DollarSign" size={14} className="mr-1" />
                {deal.title}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityItem;