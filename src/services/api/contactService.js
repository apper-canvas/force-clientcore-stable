class ContactService {
  constructor() {
    this.tableName = 'contact_c';
    this.apperClient = null;
    this.updateableFields = [
      'first_name_c', 'last_name_c', 'email_c', 'phone_c', 
      'company_c', 'status_c', 'tags_c', 'created_at_c', 'last_activity_c'
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_activity_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await client.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to fetch contacts:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const client = this.getApperClient();
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_activity_c"}}
        ]
      };
      
      const response = await client.getRecordById(this.tableName, id, params);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(contactData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          first_name_c: contactData.first_name_c || contactData.firstName || "",
          last_name_c: contactData.last_name_c || contactData.lastName || "",
          email_c: contactData.email_c || contactData.email || "",
          phone_c: contactData.phone_c || contactData.phone || "",
          company_c: contactData.company_c || contactData.company || "",
          status_c: contactData.status_c || contactData.status || "Lead",
          tags_c: contactData.tags_c || contactData.tags || "",
          created_at_c: new Date().toISOString(),
          last_activity_c: new Date().toISOString()
        }]
      };
      
      const response = await client.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to create contact:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contacts:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, contactData) {
    try {
      const client = this.getApperClient();
      const params = {
        records: [{
          Id: id,
          first_name_c: contactData.first_name_c || contactData.firstName || "",
          last_name_c: contactData.last_name_c || contactData.lastName || "",
          email_c: contactData.email_c || contactData.email || "",
          phone_c: contactData.phone_c || contactData.phone || "",
          company_c: contactData.company_c || contactData.company || "",
          status_c: contactData.status_c || contactData.status || "Lead",
          tags_c: contactData.tags_c || contactData.tags || "",
          last_activity_c: new Date().toISOString()
        }]
      };
      
      const response = await client.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error("Failed to update contact:", response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contacts:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error);
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
        console.error("Failed to delete contact:", response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} contacts:`, failed);
        }
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error);
      return false;
    }
  }
}

export const contactService = new ContactService();