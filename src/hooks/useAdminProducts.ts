import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AdminProduct {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon_url: string;
  URL: string | null;
  created_at: string;
  product_images?: { id: number; image_url: string }[];
  product_tags?: { id: number; tag: string }[];
}

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (id, image_url),
          product_tags (id, tag)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AdminProduct[];
    },
  });
};

export const useAdminProductById = (id: number) => {
  return useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_images (id, image_url),
          product_tags (id, tag)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as AdminProduct;
    },
    enabled: !!id,
  });
};

interface CreateProductData {
  name: string;
  tagline: string;
  description: string;
  icon_url: string;
  URL?: string | null;
  images?: string[];
  tags?: string[];
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ images, tags, ...productData }: CreateProductData) => {
      // Create product
      const { data: product, error: productError } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();

      if (productError) throw productError;

      // Insert images if provided
      if (images && images.length > 0) {
        const { error: imagesError } = await supabase
          .from("product_images")
          .insert(
            images.map((image_url) => ({
              product_id: product.id,
              image_url,
            }))
          );
        if (imagesError) throw imagesError;
      }

      // Insert tags if provided
      if (tags && tags.length > 0) {
        const { error: tagsError } = await supabase
          .from("product_tags")
          .insert(
            tags.map((tag) => ({
              product_id: product.id,
              tag,
            }))
          );
        if (tagsError) throw tagsError;
      }

      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "成功",
        description: "プロダクトが作成されました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

interface UpdateProductData {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon_url: string;
  URL?: string | null;
  images?: string[];
  tags?: string[];
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, images, tags, ...updates }: UpdateProductData) => {
      // Update product
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      // Update images: delete existing and insert new ones
      if (images !== undefined) {
        await supabase.from("product_images").delete().eq("product_id", id);
        if (images.length > 0) {
          const { error: imagesError } = await supabase
            .from("product_images")
            .insert(
              images.map((image_url) => ({
                product_id: id,
                image_url,
              }))
            );
          if (imagesError) throw imagesError;
        }
      }

      // Update tags: delete existing and insert new ones
      if (tags !== undefined) {
        await supabase.from("product_tags").delete().eq("product_id", id);
        if (tags.length > 0) {
          const { error: tagsError } = await supabase
            .from("product_tags")
            .insert(
              tags.map((tag) => ({
                product_id: id,
                tag,
              }))
            );
          if (tagsError) throw tagsError;
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-product"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "成功",
        description: "プロダクトが更新されました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      // Delete related data first
      await supabase.from("product_images").delete().eq("product_id", id);
      await supabase.from("product_tags").delete().eq("product_id", id);
      await supabase.from("product_likes").delete().eq("product_id", id);
      await supabase.from("product_bookmarks").delete().eq("product_id", id);
      await supabase.from("product_comments").delete().eq("product_id", id);

      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast({
        title: "成功",
        description: "プロダクトが削除されました",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
