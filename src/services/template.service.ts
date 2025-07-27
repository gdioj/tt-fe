import { createClient } from "@/util/supabase/server";
// Import your model types here
// import { YourModel } from "@/models";

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class TemplateService {
  /**
   * Template for a basic service class
   * Copy this template and modify for new services
   */

  /**
   * Fetches all records
   * @returns Promise<YourModel[]> - Array of records or empty array if error
   */
  static async getAll(): Promise<any[]> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("your_table")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching records:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Unexpected error fetching records:", error);
      return [];
    }
  }

  /**
   * Fetches a single record by ID
   * @param id - The record's unique identifier
   * @returns Promise<YourModel | null> - Record object or null if not found
   */
  static async getById(id: string): Promise<any | null> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("your_table")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(`Error fetching record ${id}:`, error);
        return null;
      }

      return data;
    } catch (error) {
      console.error(`Unexpected error fetching record ${id}:`, error);
      return null;
    }
  }

  /**
   * Creates a new record
   * @param record - Record data without id (will be generated)
   * @returns Promise<ServiceResponse<YourModel>> - Response with created record or error
   */
  static async create(record: any): Promise<ServiceResponse<any>> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("your_table")
        .insert([record])
        .select("*")
        .single();

      if (error) {
        console.error("Error creating record:", error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error creating record:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  }

  /**
   * Updates an existing record
   * @param id - The record's unique identifier
   * @param updates - Partial record data to update
   * @returns Promise<ServiceResponse<YourModel>> - Response with updated record or error
   */
  static async update(id: string, updates: any): Promise<ServiceResponse<any>> {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("your_table")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        console.error(`Error updating record ${id}:`, error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error(`Unexpected error updating record ${id}:`, error);
      return { success: false, error: "An unexpected error occurred" };
    }
  }

  /**
   * Deletes a record
   * @param id - The record's unique identifier
   * @returns Promise<boolean> - True if successful, false if error
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const supabase = await createClient();

      const { error } = await supabase
        .from("your_table")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(`Error deleting record ${id}:`, error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Unexpected error deleting record ${id}:`, error);
      return false;
    }
  }
}
