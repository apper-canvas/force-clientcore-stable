class ActivityService {
  constructor() {
    this.tableName = 'activity_c';
    this.apperClient = null;
    this.updateableFields = [
      'contact_id_c', 'deal_id_c', 'type_c', 
      'description_c', 'date_c', 'user_id_c'
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
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "user_id_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "user_id_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(activityData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          contact_id_c: parseInt(activityData.contact_id_c || activityData.contactId),
          deal_id_c: activityData.deal_id_c || activityData.dealId ? parseInt(activityData.deal_id_c || activityData.dealId) : null,
          type_c: activityData.type_c || activityData.type || "Call",
          description_c: activityData.description_c || activityData.description || "",
          date_c: activityData.date_c || activityData.date || new Date().toISOString(),
          user_id_c: activityData.user_id_c || activityData.userId || "user1"
        }]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create activity:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activities:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, activityData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          Id: id,
          contact_id_c: parseInt(activityData.contact_id_c || activityData.contactId),
          deal_id_c: activityData.deal_id_c || activityData.dealId ? parseInt(activityData.deal_id_c || activityData.dealId) : null,
          type_c: activityData.type_c || activityData.type || "Call",
          description_c: activityData.description_c || activityData.description || "",
          date_c: activityData.date_c || activityData.date || new Date().toISOString(),
          user_id_c: activityData.user_id_c || activityData.userId || "user1"
        }]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update activity:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} activities:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error);
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
        console.error("Failed to delete activity:", response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const activityService = new ActivityService();