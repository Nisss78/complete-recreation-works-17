import { useState } from "react";
import { useAdminProducts, useDeleteProduct, AdminProduct } from "@/hooks/useAdminProducts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ProductFormDialog } from "@/components/admin/forms/ProductForm";

const ProductsManagement = () => {
  const { data: products, isLoading } = useAdminProducts();
  const deleteProduct = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteProduct.mutateAsync(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">プロダクト管理</h1>
          <p className="text-gray-600 mt-1">プロダクトの作成・編集・削除</p>
        </div>
        <Button onClick={handleCreate} className="bg-[#10c876] hover:bg-[#0eb369]">
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>プロダクト一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>プロダクト</TableHead>
                  <TableHead>タグライン</TableHead>
                  <TableHead>タグ</TableHead>
                  <TableHead>作成日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-lg">
                          <AvatarImage src={product.icon_url} />
                          <AvatarFallback className="rounded-lg">
                            {product.name[0]?.toUpperCase() || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium line-clamp-1">
                            {product.name}
                          </span>
                          {product.product_links && product.product_links.length > 0 && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <ExternalLink className="h-3 w-3" />
                              {product.product_links.length}件のリンク
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {product.tagline}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.product_tags?.slice(0, 3).map((t) => (
                          <Badge key={t.id} variant="secondary" className="text-xs">
                            {t.tag}
                          </Badge>
                        ))}
                        {product.product_tags && product.product_tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.product_tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date(product.created_at).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteTarget(product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              プロダクトがありません
            </div>
          )}
        </CardContent>
      </Card>

      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        editingProduct={editingProduct}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="プロダクトの削除"
        description="このプロダクトを削除してもよろしいですか？関連するいいね、ブックマーク、コメントも削除されます。"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
};

export default ProductsManagement;
