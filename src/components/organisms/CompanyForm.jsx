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