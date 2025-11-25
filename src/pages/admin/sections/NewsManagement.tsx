import { useState } from "react";
import { useNews, useDeleteNews } from "@/hooks/useNews";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { NewsFormDialog } from "@/components/admin/forms/NewsForm";
import { News } from "@/types/database";

const categoryLabels: Record<string, string> = {
  announcement: "お知らせ",
  event: "イベント",
  media: "メディア",
  other: "その他",
};

const NewsManagement = () => {
  const { data: news, isLoading } = useNews();
  const deleteNews = useDeleteNews();
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteNews.mutateAsync(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingNews(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingNews(null);
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
          <h1 className="text-2xl font-bold text-gray-900">ニュース管理</h1>
          <p className="text-gray-600 mt-1">ニュース記事の作成・編集・削除</p>
        </div>
        <Button onClick={handleCreate} className="bg-[#10c876] hover:bg-[#0eb369]">
          <Plus className="h-4 w-4 mr-2" />
          新規作成
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ニュース一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {news && news.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>日付</TableHead>
                  <TableHead>タイトル</TableHead>
                  <TableHead>カテゴリ</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(item.date).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.title_ja}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {categoryLabels[item.category] || item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteTarget(item.id)}
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
              ニュースがありません
            </div>
          )}
        </CardContent>
      </Card>

      <NewsFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        editingNews={editingNews}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="ニュースの削除"
        description="このニュース記事を削除してもよろしいですか？"
        isLoading={deleteNews.isPending}
      />
    </div>
  );
};

export default NewsManagement;
