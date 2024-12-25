import { Link } from "react-router-dom";
import { UserMenu } from "./header/UserMenu";
import { useLanguage } from "@/contexts/LanguageContext";

export const Header = () => {
  const { t } = useLanguage();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/75 backdrop-blur-sm">
      <div className="mx-auto px-3 sm:container sm:px-4">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="font-bold text-xl">
            Protoduct
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};