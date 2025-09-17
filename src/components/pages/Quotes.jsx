import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import QuoteForm from "@/components/organisms/QuoteForm";
import QuoteCard from "@/components/molecules/QuoteCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { quoteService } from "@/services/api/quoteService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";

const Quotes = () => {
  const { onMenuClick } = useOutletContext();
  
  const [quotes, setQuotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statuses = ["Draft", "Sent", "Accepted", "Rejected"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [quotesData, contactsData, dealsData] = await Promise.all([
        quoteService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setQuotes(quotesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load quotes data");
      console.error("Quotes loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuote = () => {
    setEditingQuote(null);
    setShowForm(true);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleDeleteQuote = async (id) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      try {
        await quoteService.delete(id);
        setQuotes(prev => prev.filter(quote => quote.Id !== id));
        toast.success("Quote deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete quote");
        console.error("Delete error:", err);
      }
    }
  };

  const handleSubmitQuote = async (quoteData) => {
    try {
      setIsSubmitting(true);
      
      if (editingQuote) {
        const updated = await quoteService.update(editingQuote.Id, quoteData);
        setQuotes(prev => prev.map(quote => 
          quote.Id === editingQuote.Id ? updated : quote
        ));
        toast.success("Quote updated successfully!");
      } else {
        const newQuote = await quoteService.create(quoteData);
        setQuotes(prev => [newQuote, ...prev]);
        toast.success("Quote added successfully!");
      }
      
      setShowForm(false);
      setEditingQuote(null);
    } catch (err) {
      toast.error(editingQuote ? "Failed to update quote" : "Failed to add quote");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingQuote(null);
  };

  const getQuotesByStatus = (status) => {
    return quotes.filter(quote => quote.status_c === status);
  };

  const getContactById = (id) => {
    return contacts.find(contact => contact.Id === id);
  };

  const getDealById = (id) => {
    return deals.find(deal => deal.Id === id);
  };

  if (loading) return <Loading type="kanban" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const headerActions = [
    {
      label: "Add Quote",
      icon: "Plus",
      onClick: handleAddQuote,
      variant: "primary"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100">
      <Header
        onMenuClick={onMenuClick}
        title="Quotes Management"
        subtitle={`Track your ${quotes.length} quotes through the sales process`}
        actions={headerActions}
      />
      
      <div className="p-6">
        <Modal
          isOpen={showForm}
          onClose={handleCancelForm}
          title={editingQuote ? "Edit Quote" : "Add New Quote"}
          size="lg"
        >
          <QuoteForm
            quote={editingQuote}
            contacts={contacts}
            deals={deals}
            onSubmit={handleSubmitQuote}
            onCancel={handleCancelForm}
            isSubmitting={isSubmitting}
          />
        </Modal>

        {quotes.length === 0 ? (
          <div className="mt-12">
            <Empty
              icon="FileText"
              title="No quotes created"
              description="Start managing your sales quotes by creating your first quote"
              action={handleAddQuote}
              actionLabel="Create First Quote"
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statuses.map(status => {
                const statusQuotes = getQuotesByStatus(status);
                
                return (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-primary">{status}</h3>
                        <span className="text-sm bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent font-bold">
                          {statusQuotes.length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 min-h-[400px]">
                      {statusQuotes.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-gray-400">
                          <div className="text-center">
                            <ApperIcon name="Plus" size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No quotes</p>
                          </div>
                        </div>
                      ) : (
                        statusQuotes.map(quote => {
                          const contact = getContactById(quote.contact_id_c?.Id || quote.contact_id_c);
                          const deal = getDealById(quote.deal_id_c?.Id || quote.deal_id_c);
                          return (
                            <QuoteCard
                              key={quote.Id}
                              quote={quote}
                              contact={contact}
                              deal={deal}
                              onEdit={handleEditQuote}
                              onDelete={handleDeleteQuote}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Quotes Summary */}
            {quotes.length > 0 && (
              <Card className="mt-8 p-6 bg-gradient-to-br from-surface to-gray-50">
                <h3 className="text-lg font-semibold text-primary mb-4">Quotes Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent mb-1">
                      {quotes.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Quotes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent mb-1">
                      {getQuotesByStatus("Sent").length}
                    </div>
                    <div className="text-sm text-gray-600">Sent Quotes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-info to-info/80 bg-clip-text text-transparent mb-1">
                      {getQuotesByStatus("Accepted").length}
                    </div>
                    <div className="text-sm text-gray-600">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold bg-gradient-to-r from-warning to-warning/80 bg-clip-text text-transparent mb-1">
                      {getQuotesByStatus("Draft").length}
                    </div>
                    <div className="text-sm text-gray-600">Draft</div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quotes;