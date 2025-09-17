import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const QuoteForm = ({ quote, contacts, deals, onSubmit, onCancel, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    Name: "",
    Tags: "",
    company_c: "",
    contact_id_c: "",
    deal_id_c: "",
    quote_date_c: "",
    status_c: "Draft",
    delivery_method_c: "",
    expires_on_c: "",
    bill_to_name_c: "",
    bill_to_street_c: "",
    bill_to_city_c: "",
    bill_to_state_c: "",
    bill_to_country_c: "",
    bill_to_pincode_c: "",
    ship_to_name_c: "",
    ship_to_street_c: "",
    ship_to_city_c: "",
    ship_to_state_c: "",
    ship_to_country_c: "",
    ship_to_pincode_c: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (quote) {
      setFormData({
        Name: quote.Name || "",
        Tags: quote.Tags || "",
        company_c: quote.company_c || "",
        contact_id_c: quote.contact_id_c?.Id || quote.contact_id_c || "",
        deal_id_c: quote.deal_id_c?.Id || quote.deal_id_c || "",
        quote_date_c: quote.quote_date_c ? 
          new Date(quote.quote_date_c).toISOString().split("T")[0] : "",
        status_c: quote.status_c || "Draft",
        delivery_method_c: quote.delivery_method_c || "",
        expires_on_c: quote.expires_on_c ? 
          new Date(quote.expires_on_c).toISOString().split("T")[0] : "",
        bill_to_name_c: quote.bill_to_name_c || "",
        bill_to_street_c: quote.bill_to_street_c || "",
        bill_to_city_c: quote.bill_to_city_c || "",
        bill_to_state_c: quote.bill_to_state_c || "",
        bill_to_country_c: quote.bill_to_country_c || "",
        bill_to_pincode_c: quote.bill_to_pincode_c || "",
        ship_to_name_c: quote.ship_to_name_c || "",
        ship_to_street_c: quote.ship_to_street_c || "",
        ship_to_city_c: quote.ship_to_city_c || "",
        ship_to_state_c: quote.ship_to_state_c || "",
        ship_to_country_c: quote.ship_to_country_c || "",
        ship_to_pincode_c: quote.ship_to_pincode_c || ""
      });
    }
  }, [quote]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = "Quote name is required";
    }
    
    if (!formData.company_c.trim()) {
      newErrors.company_c = "Company is required";
    }

    if (!formData.quote_date_c) {
      newErrors.quote_date_c = "Quote date is required";
    }

    if (!formData.expires_on_c) {
      newErrors.expires_on_c = "Expiry date is required";
    }

    // Validate that expiry date is after quote date
    if (formData.quote_date_c && formData.expires_on_c) {
      const quoteDate = new Date(formData.quote_date_c);
      const expiryDate = new Date(formData.expires_on_c);
      if (expiryDate <= quoteDate) {
        newErrors.expires_on_c = "Expiry date must be after quote date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const quoteData = {
        Name: formData.Name,
        Tags: formData.Tags,
        company_c: formData.company_c,
        contact_id_c: formData.contact_id_c || null,
        deal_id_c: formData.deal_id_c || null,
        quote_date_c: formData.quote_date_c,
        status_c: formData.status_c,
        delivery_method_c: formData.delivery_method_c,
        expires_on_c: formData.expires_on_c,
        bill_to_name_c: formData.bill_to_name_c,
        bill_to_street_c: formData.bill_to_street_c,
        bill_to_city_c: formData.bill_to_city_c,
        bill_to_state_c: formData.bill_to_state_c,
        bill_to_country_c: formData.bill_to_country_c,
        bill_to_pincode_c: formData.bill_to_pincode_c,
        ship_to_name_c: formData.ship_to_name_c,
        ship_to_street_c: formData.ship_to_street_c,
        ship_to_city_c: formData.ship_to_city_c,
        ship_to_state_c: formData.ship_to_state_c,
        ship_to_country_c: formData.ship_to_country_c,
        ship_to_pincode_c: formData.ship_to_pincode_c
      };
      onSubmit(quoteData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const copyBillingToShipping = () => {
    setFormData(prev => ({
      ...prev,
      ship_to_name_c: prev.bill_to_name_c,
      ship_to_street_c: prev.bill_to_street_c,
      ship_to_city_c: prev.bill_to_city_c,
      ship_to_state_c: prev.bill_to_state_c,
      ship_to_country_c: prev.bill_to_country_c,
      ship_to_pincode_c: prev.bill_to_pincode_c
    }));
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">
            {quote ? "Edit Quote" : "Add New Quote"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="p-2"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Quote Name *"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                error={errors.Name}
                placeholder="Enter quote name"
              />
            </div>
            <div>
              <Input
                label="Tags"
                name="Tags"
                value={formData.Tags}
                onChange={handleChange}
                placeholder="Enter tags (comma-separated)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Company *"
                name="company_c"
                value={formData.company_c}
                onChange={handleChange}
                error={errors.company_c}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Contact
              </label>
              <select
                name="contact_id_c"
                value={formData.contact_id_c}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border-2 border-gray-200 bg-surface text-primary focus:border-accent focus:outline-none transition-colors duration-200"
              >
                <option value="">Select a contact</option>
                {contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.first_name_c} {contact.last_name_c} - {contact.company_c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Deal
              </label>
              <select
                name="deal_id_c"
                value={formData.deal_id_c}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border-2 border-gray-200 bg-surface text-primary focus:border-accent focus:outline-none transition-colors duration-200"
              >
                <option value="">Select a deal</option>
                {deals.map(deal => (
                  <option key={deal.Id} value={deal.Id}>
                    {deal.title_c || deal.title} - ${deal.value_c || deal.value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Input
                label="Delivery Method"
                name="delivery_method_c"
                value={formData.delivery_method_c}
                onChange={handleChange}
                placeholder="Enter delivery method"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Quote Date *"
                name="quote_date_c"
                type="date"
                value={formData.quote_date_c}
                onChange={handleChange}
                error={errors.quote_date_c}
              />
            </div>
            <div>
              <Input
                label="Expires On *"
                name="expires_on_c"
                type="date"
                value={formData.expires_on_c}
                onChange={handleChange}
                error={errors.expires_on_c}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Status
              </label>
              <select
                name="status_c"
                value={formData.status_c}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border-2 border-gray-200 bg-surface text-primary focus:border-accent focus:outline-none transition-colors duration-200"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Billing Address */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Bill To Name"
                  name="bill_to_name_c"
                  value={formData.bill_to_name_c}
                  onChange={handleChange}
                  placeholder="Enter billing name"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="bill_to_street_c"
                  value={formData.bill_to_street_c}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <Input
                  label="City"
                  name="bill_to_city_c"
                  value={formData.bill_to_city_c}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Input
                  label="State"
                  name="bill_to_state_c"
                  value={formData.bill_to_state_c}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Input
                  label="Country"
                  name="bill_to_country_c"
                  value={formData.bill_to_country_c}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
              </div>
              <div>
                <Input
                  label="Pincode"
                  name="bill_to_pincode_c"
                  value={formData.bill_to_pincode_c}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary">Shipping Address</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copyBillingToShipping}
              >
                <ApperIcon name="Copy" size={16} className="mr-2" />
                Copy from Billing
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Ship To Name"
                  name="ship_to_name_c"
                  value={formData.ship_to_name_c}
                  onChange={handleChange}
                  placeholder="Enter shipping name"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  label="Street Address"
                  name="ship_to_street_c"
                  value={formData.ship_to_street_c}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <Input
                  label="City"
                  name="ship_to_city_c"
                  value={formData.ship_to_city_c}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <Input
                  label="State"
                  name="ship_to_state_c"
                  value={formData.ship_to_state_c}
                  onChange={handleChange}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <Input
                  label="Country"
                  name="ship_to_country_c"
                  value={formData.ship_to_country_c}
                  onChange={handleChange}
                  placeholder="Enter country"
                />
              </div>
              <div>
                <Input
                  label="Pincode"
                  name="ship_to_pincode_c"
                  value={formData.ship_to_pincode_c}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : (quote ? "Update Quote" : "Add Quote")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default QuoteForm;