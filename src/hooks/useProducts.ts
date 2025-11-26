import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  URL: string | null;
  created_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_links (id, link_type, url, label, display_order)
        `)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as (Product & { product_links?: { id: number; link_type: string; url: string; label?: string | null; display_order?: number }[] })[];
    },
  });
};