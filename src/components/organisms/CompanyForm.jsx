import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";

const CompanyForm = ({ company, onSubmit, onCancel, isSubmitting }) => {
const [formData, setFormData] = useState({
    name_c: "",
    address_c: "",
    city_c: "",
    state_c: "",
    zip_c: "",
    website_c: "",
    phone_c: "",
    number_of_employees_c: "",
    annual_revenue_c: "",
    Tags: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (company) {
      setFormData({
name_c: company.name_c || "",
        address_c: company.address_c || "",
        city_c: company.city_c || "",
        state_c: company.state_c || "",
        zip_c: company.zip_c || "",
        website_c: company.website_c || "",
        phone_c: company.phone_c || "",
        number_of_employees_c: company.number_of_employees_c || "",
        annual_revenue_c: company.annual_revenue_c || "",
        Tags: company.Tags || ""
      });
    }
  }, [company]);

const validateForm = () => {
    const newErrors = {};

    if (!formData.name_c.trim()) {
      newErrors.name_c = "Company name is required";
    }

    if (!formData.city_c.trim()) {
      newErrors.city_c = "City is required";
    }

    if (!formData.state_c.trim()) {
      newErrors.state_c = "State is required";
    }

    if (formData.website_c && !isValidUrl(formData.website_c)) {
      newErrors.website_c = "Please enter a valid website URL";
    }

    if (formData.number_of_employees_c && (isNaN(formData.number_of_employees_c) || formData.number_of_employees_c < 0)) {
      newErrors.number_of_employees_c = "Please enter a valid number of employees";
    }

    if (formData.annual_revenue_c && (isNaN(formData.annual_revenue_c) || formData.annual_revenue_c < 0)) {
      newErrors.annual_revenue_c = "Please enter a valid annual revenue";
    }

  };

  const isValidUrl = (string) => {
    try {
      new URL(string.startsWith('http') ? string : `https://${string}`);
      return true;
    } catch (_) {
      return false;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <Input
          label="Company Name *"
          name="name_c"
          value={formData.name_c}
          onChange={handleInputChange}
          placeholder="Enter company name"
          error={errors.name_c}
          required
        />

        <Input
          label="Address"
          name="address_c"
          value={formData.address_c}
          onChange={handleInputChange}
          placeholder="Enter company address"
          error={errors.address_c}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City *"
            name="city_c"
            value={formData.city_c}
            onChange={handleInputChange}
            placeholder="Enter city"
            error={errors.city_c}
            required
          />

          <Input
            label="State *"
            name="state_c"
            value={formData.state_c}
            onChange={handleInputChange}
            placeholder="Enter state"
            error={errors.state_c}
            required
          />

          <Input
            label="ZIP Code"
            name="zip_c"
            value={formData.zip_c}
            onChange={handleInputChange}
            placeholder="Enter ZIP code"
            error={errors.zip_c}
          />
        </div>

        <Input
          label="Tags"
          name="Tags"
          value={formData.Tags}
          onChange={handleInputChange}
          placeholder="Enter tags (comma separated)"
error={errors.Tags}
        />

        <Input
          label="Website"
          type="url"
          name="website_c"
          value={formData.website_c}
          onChange={handleInputChange}
          placeholder="https://company.com"
          error={errors.website_c}
        />

        <Input
          label="Phone"
          type="tel"
          name="phone_c"
          value={formData.phone_c}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
          error={errors.phone_c}
        />

        <Input
          label="Number of Employees"
          type="number"
          name="number_of_employees_c"
          value={formData.number_of_employees_c}
          onChange={handleInputChange}
          placeholder="50"
          min="0"
          error={errors.number_of_employees_c}
        />

        <Input
          label="Annual Revenue"
          type="number"
          name="annual_revenue_c"
          value={formData.annual_revenue_c}
          onChange={handleInputChange}
          placeholder="1000000"
          min="0"
          error={errors.annual_revenue_c}
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : company ? "Update Company" : "Add Company"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;