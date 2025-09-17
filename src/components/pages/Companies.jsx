import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "@/components/atoms/Modal";
import { companyService } from "@/services/api/companyService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Header from "@/components/organisms/Header";
import CompanyForm from "@/components/organisms/CompanyForm";
import SearchBar from "@/components/molecules/SearchBar";
import CompanyRow from "@/components/molecules/CompanyRow";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Companies = () => {
  const { onMenuClick } = useOutletContext();
  
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError("Failed to load companies");
      console.error("Companies loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(company =>
        company.name_c?.toLowerCase().includes(term) ||
        company.Name?.toLowerCase().includes(term) ||
        company.city_c?.toLowerCase().includes(term) ||
        company.state_c?.toLowerCase().includes(term) ||
        company.Tags?.toLowerCase().includes(term)
      );
    }

    setFilteredCompanies(filtered);
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setShowForm(true);
  };

  const handleEditCompany = (company) => {
    setEditingCompany(company);
    setShowForm(true);
  };

  const handleDeleteCompany = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await companyService.delete(id);
        setCompanies(prev => prev.filter(company => company.Id !== id));
        toast.success("Company deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete company");
        console.error("Delete error:", err);
      }
    }
  };

  const handleSubmitCompany = async (companyData) => {
    try {
      setIsSubmitting(true);
      
      if (editingCompany) {
        const updated = await companyService.update(editingCompany.Id, companyData);
        setCompanies(prev => prev.map(company => 
          company.Id === editingCompany.Id ? updated : company
        ));
        toast.success("Company updated successfully!");
      } else {
        const newCompany = await companyService.create(companyData);
        setCompanies(prev => [newCompany, ...prev]);
        toast.success("Company added successfully!");
      }
      
      setShowForm(false);
      setEditingCompany(null);
    } catch (err) {
      toast.error(editingCompany ? "Failed to update company" : "Failed to add company");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  const headerActions = [
    {
      label: "Add Company",
      icon: "Building",
      onClick: handleAddCompany,
      variant: "primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100">
      <Header
        onMenuClick={onMenuClick}
        title="Companies"
        subtitle={`Manage your ${companies.length} companies and organizational relationships`}
        actions={headerActions}
      />
      
      <div className="p-6">
        <Card className="bg-gradient-to-br from-surface to-gray-50">
          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search companies by name, city, state, or tags..."
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCompany}
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  Add Company
                </Button>
              </div>
            </div>
          </div>

          {filteredCompanies.length === 0 ? (
            <div className="p-12">
              <Empty
                icon="Building"
                title={searchTerm ? "No companies found" : "No companies yet"}
                description={
                  searchTerm 
                    ? "Try adjusting your search criteria"
                    : "Start building your company database by adding your first company"
                }
                action={!searchTerm ? handleAddCompany : undefined}
                actionLabel="Add First Company"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Company Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">City/State</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Tags</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCompanies.map(company => (
                    <CompanyRow
                      key={company.Id}
                      company={company}
                      onEdit={handleEditCompany}
                      onDelete={handleDeleteCompany}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Company Form Modal */}
        <Modal
          isOpen={showForm}
          onClose={handleCancelForm}
          title={editingCompany ? "Edit Company" : "Add New Company"}
          size="md"
        >
          <CompanyForm
            company={editingCompany}
            onSubmit={handleSubmitCompany}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Companies;