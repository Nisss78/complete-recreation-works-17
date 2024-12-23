import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          Solomaker
        </Link>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            記事
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            ログイン
          </Button>
        </div>
      </div>
    </header>
  );
};