import { Bookmark } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useNavigate } from "react-router-dom";

export function BookmarkSidebar() {
  const { bookmarks, isLoading } = useBookmarks();
  const navigate = useNavigate();

  return (
    <Sidebar side="right" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ブックマーク</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="p-4 text-sm text-gray-500">読み込み中...</div>
            ) : bookmarks.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">
                ブックマークはまだありません
              </div>
            ) : (
              <SidebarMenu>
                {bookmarks.map((bookmark) => (
                  <SidebarMenuItem key={bookmark.id}>
                    <SidebarMenuButton
                      onClick={() => {
                        const productSlug = bookmark.name
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        navigate(`/posts/${productSlug}`);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={bookmark.icon_url}
                          alt={bookmark.name}
                          className="w-6 h-6 rounded"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium">{bookmark.name}</span>
                          <span className="text-xs text-gray-500 truncate">
                            {bookmark.tagline}
                          </span>
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}