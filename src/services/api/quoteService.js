class QuoteService {
  constructor() {
    this.tableName = 'quote_c';
    this.apperClient = null;
    this.updateableFields = [
      'Name', 'Tags', 'company_c', 'contact_id_c', 'deal_id_c', 'quote_date_c', 
      'status_c', 'delivery_method_c', 'expires_on_c', 'bill_to_name_c', 
      'bill_to_street_c', 'bill_to_city_c', 'bill_to_state_c', 'bill_to_country_c', 
      'bill_to_pincode_c', 'ship_to_name_c', 'ship_to_street_c', 'ship_to_city_c', 
      'ship_to_state_c', 'ship_to_country_c', 'ship_to_pincode_c'
    ];
  }

  getApperClient() {
    if (!this.apperClient) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
    return this.apperClient;
  }

  async getAll() {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "bill_to_name_c"}},
          {"field": {"Name": "bill_to_street_c"}},
          {"field": {"Name": "bill_to_city_c"}},
          {"field": {"Name": "bill_to_state_c"}},
          {"field": {"Name": "bill_to_country_c"}},
          {"field": {"Name": "bill_to_pincode_c"}},
          {"field": {"Name": "ship_to_name_c"}},
          {"field": {"Name": "ship_to_street_c"}},
          {"field": {"Name": "ship_to_city_c"}},
          {"field": {"Name": "ship_to_state_c"}},
          {"field": {"Name": "ship_to_country_c"}},
          {"field": {"Name": "ship_to_pincode_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch quotes:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "delivery_method_c"}},
          {"field": {"Name": "expires_on_c"}},
          {"field": {"Name": "bill_to_name_c"}},
          {"field": {"Name": "bill_to_street_c"}},
          {"field": {"Name": "bill_to_city_c"}},
          {"field": {"Name": "bill_to_state_c"}},
          {"field": {"Name": "bill_to_country_c"}},
          {"field": {"Name": "bill_to_pincode_c"}},
          {"field": {"Name": "ship_to_name_c"}},
          {"field": {"Name": "ship_to_street_c"}},
          {"field": {"Name": "ship_to_city_c"}},
          {"field": {"Name": "ship_to_state_c"}},
          {"field": {"Name": "ship_to_country_c"}},
          {"field": {"Name": "ship_to_pincode_c"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(quoteData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          Name: quoteData.Name || "",
          Tags: quoteData.Tags || "",
          company_c: quoteData.company_c || "",
          contact_id_c: quoteData.contact_id_c ? parseInt(quoteData.contact_id_c) : null,
          deal_id_c: quoteData.deal_id_c ? parseInt(quoteData.deal_id_c) : null,
          quote_date_c: quoteData.quote_date_c || "",
          status_c: quoteData.status_c || "Draft",
          delivery_method_c: quoteData.delivery_method_c || "",
          expires_on_c: quoteData.expires_on_c || "",
          bill_to_name_c: quoteData.bill_to_name_c || "",
          bill_to_street_c: quoteData.bill_to_street_c || "",
          bill_to_city_c: quoteData.bill_to_city_c || "",
          bill_to_state_c: quoteData.bill_to_state_c || "",
          bill_to_country_c: quoteData.bill_to_country_c || "",
          bill_to_pincode_c: quoteData.bill_to_pincode_c || "",
          ship_to_name_c: quoteData.ship_to_name_c || "",
          ship_to_street_c: quoteData.ship_to_street_c || "",
          ship_to_city_c: quoteData.ship_to_city_c || "",
          ship_to_state_c: quoteData.ship_to_state_c || "",
          ship_to_country_c: quoteData.ship_to_country_c || "",
          ship_to_pincode_c: quoteData.ship_to_pincode_c || ""
        }]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create quote:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, quoteData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          Id: id,
          Name: quoteData.Name || "",
          Tags: quoteData.Tags || "",
          company_c: quoteData.company_c || "",
          contact_id_c: quoteData.contact_id_c ? parseInt(quoteData.contact_id_c) : null,
          deal_id_c: quoteData.deal_id_c ? parseInt(quoteData.deal_id_c) : null,
          quote_date_c: quoteData.quote_date_c || "",
          status_c: quoteData.status_c || "Draft",
          delivery_method_c: quoteData.delivery_method_c || "",
          expires_on_c: quoteData.expires_on_c || "",
          bill_to_name_c: quoteData.bill_to_name_c || "",
          bill_to_street_c: quoteData.bill_to_street_c || "",
          bill_to_city_c: quoteData.bill_to_city_c || "",
          bill_to_state_c: quoteData.bill_to_state_c || "",
          bill_to_country_c: quoteData.bill_to_country_c || "",
          bill_to_pincode_c: quoteData.bill_to_pincode_c || "",
          ship_to_name_c: quoteData.ship_to_name_c || "",
          ship_to_street_c: quoteData.ship_to_street_c || "",
          ship_to_city_c: quoteData.ship_to_city_c || "",
          ship_to_state_c: quoteData.ship_to_state_c || "",
          ship_to_country_c: quoteData.ship_to_country_c || "",
          ship_to_pincode_c: quoteData.ship_to_pincode_c || ""
        }]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update quote:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const client = this.getApperClient();
      const params = { 
        RecordIds: [id]
      };
      
      const response = await client.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to delete quote:", response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const quoteService = new QuoteService();