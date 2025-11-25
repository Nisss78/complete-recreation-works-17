import { useState } from "react";
import { useArticles, useDeleteArticle, Article } from "@/hooks/useArticles";
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
import { Pencil, Trash2, Loader2, ExternalLink } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ArticleFormDialog } from "@/components/admin/forms/ArticleForm";
import { Link } from "react-router-dom";

const ArticlesManagement = () => {
  const { data: articles, isLoading } = useArticles();
  const deleteArticle = useDeleteArticle();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteArticle.mutateAsync(deleteTarget);
      setDeleteTarget(null);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
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
          <h1 className="text-2xl font-bold text-gray-900">記事管理</h1>
          <p className="text-gray-600 mt-1">ユーザーが投稿した記事の管理</p>
        </div>
        <Link to="/articles/new" target="_blank">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            新規作成（別タブ）
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>記事一覧</CardTitle>
        </CardHeader>
        <CardContent>
          {articles && articles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>タイトル</TableHead>
                  <TableHead>著者</TableHead>
                  <TableHead>作成日</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {article.thumbnail_url && (
                          <img
                            src={article.thumbnail_url}
                            alt=""
                            className="h-10 w-16 object-cover rounded"
                          />
                        )}
                        <span className="font-medium line-clamp-1">
                          {article.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={article.profiles?.avatar_url || ""} />
                          <AvatarFallback>
                            {article.profiles?.username?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {article.profiles?.username || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Date(article.created_at).toLocaleDateString("ja-JP")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteTarget(article.id)}
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
              記事がありません
            </div>
          )}
        </CardContent>
      </Card>

      <ArticleFormDialog
        open={isFormOpen}
        onOpenChange={handleFormClose}
        editingArticle={editingArticle}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="記事の削除"
        description="この記事を削除してもよろしいですか？関連するいいねやブックマークも削除されます。"
        isLoading={deleteArticle.isPending}
      />
    </div>
  );
};

export default ArticlesManagement;
