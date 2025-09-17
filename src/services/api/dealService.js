class DealService {
  constructor() {
    this.tableName = 'deal_c';
    this.apperClient = null;
    this.updateableFields = [
      'title_c', 'contact_id_c', 'value_c', 'stage_c', 
      'probability_c', 'expected_close_date_c', 'notes_c', 'created_at_c'
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch deals:", response.message);
        return [];
      }
      
      // Transform database field names to UI field names for compatibility
      const transformedData = (response.data || []).map(deal => ({
        ...deal,
        title: deal.title_c || deal.title || "",
        contactId: deal.contact_id_c || deal.contactId,
        value: deal.value_c || deal.value || 0,
        stage: deal.stage_c || deal.stage || "Lead",
        probability: deal.probability_c || deal.probability || 0,
        expectedCloseDate: deal.expected_close_date_c || deal.expectedCloseDate,
        notes: deal.notes_c || deal.notes || ""
      }));
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(dealData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          title_c: dealData.title_c || dealData.title || "",
          contact_id_c: parseInt(dealData.contact_id_c || dealData.contactId),
          value_c: parseFloat(dealData.value_c || dealData.value || 0),
          stage_c: dealData.stage_c || dealData.stage || "Lead",
          probability_c: parseInt(dealData.probability_c || dealData.probability || 0),
          expected_close_date_c: dealData.expected_close_date_c || dealData.expectedCloseDate,
          notes_c: dealData.notes_c || dealData.notes || "",
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create deal:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, dealData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          Id: id,
          title_c: dealData.title_c || dealData.title || "",
          contact_id_c: parseInt(dealData.contact_id_c || dealData.contactId),
          value_c: parseFloat(dealData.value_c || dealData.value || 0),
          stage_c: dealData.stage_c || dealData.stage || "Lead",
          probability_c: parseInt(dealData.probability_c || dealData.probability || 0),
          expected_close_date_c: dealData.expected_close_date_c || dealData.expectedCloseDate,
          notes_c: dealData.notes_c || dealData.notes || ""
        }]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update deal:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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
        console.error("Failed to delete deal:", response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const dealService = new DealService();