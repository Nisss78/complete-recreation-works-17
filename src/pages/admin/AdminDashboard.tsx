import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, FileText, Package, ArrowRight } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { data: newsData } = useNews();

  const { data: articlesData } = useQuery({
    queryKey: ["admin-articles-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ["admin-products-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });

  const stats = [
    {
      title: "ニュース",
      count: newsData?.length || 0,
      description: "公開中のニュース記事",
      icon: Newspaper,
      href: "/admin/news",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "記事",
      count: articlesData || 0,
      description: "公開中の記事",
      icon: FileText,
      href: "/admin/articles",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "プロダクト",
      count: productsData || 0,
      description: "登録済みのプロダクト",
      icon: Package,
      href: "/admin/products",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">
          Protoduct 管理画面へようこそ
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.count}</div>
              <CardDescription className="mt-1">
                {stat.description}
              </CardDescription>
              <Link
                to={stat.href}
                className={`inline-flex items-center gap-1 mt-3 text-sm ${stat.color} hover:underline`}
              >
                管理する
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>クイックアクション</CardTitle>
            <CardDescription>よく使う操作</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/admin/news"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-blue-50">
                <Newspaper className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-sm">ニュースを追加</div>
                <div className="text-xs text-gray-500">新しいニュース記事を作成</div>
              </div>
            </Link>
            <Link
              to="/admin/articles"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-green-50">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-sm">記事を管理</div>
                <div className="text-xs text-gray-500">記事の編集・削除</div>
              </div>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-purple-50">
                <Package className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-sm">プロダクトを管理</div>
                <div className="text-xs text-gray-500">プロダクトの編集・削除</div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>システム情報</CardTitle>
            <CardDescription>現在のシステム状態</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">バージョン</span>
                <span className="text-sm font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-gray-600">環境</span>
                <span className="text-sm font-medium">Production</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">最終更新</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("ja-JP")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
