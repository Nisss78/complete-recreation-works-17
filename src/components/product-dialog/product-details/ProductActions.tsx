import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import {
  Star,
  MessageCircle,
  Share2,
  ExternalLink,
  ChevronDown,
  Globe,
  Apple,
  Smartphone,
  Clock,
  Github,
  MessageSquare,
  Link as LinkIcon,
} from "lucide-react";
import { SparkleEffect } from "@/components/ui/sparkle-effect";

interface ProductLink {
  id?: number;
  link_type: string;
  url: string;
  label?: string | null;
  display_order?: number;
}

const LINK_TYPE_ICONS: Record<string, React.ReactNode> = {
  website: <Globe className="w-4 h-4" />,
  app_store: <Apple className="w-4 h-4" />,
  play_store: <Smartphone className="w-4 h-4" />,
  waitlist: <Clock className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  twitter: <MessageSquare className="w-4 h-4" />,
  discord: <MessageSquare className="w-4 h-4" />,
  other: <LinkIcon className="w-4 h-4" />,
};

const LINK_TYPE_LABELS: Record<string, string> = {
  website: "公式サイト",
  app_store: "App Store",
  play_store: "Play Store",
  waitlist: "Waitlist",
  github: "GitHub",
  twitter: "X (Twitter)",
  discord: "Discord",
  other: "その他",
};

interface ProductActionsProps {
  productId: number;
  productName: string;
  productUrl?: string | null;
  productLinks?: ProductLink[];
  totalLikes: number;
  hasLiked: boolean;
  commentCount: number;
  isBookmarked: boolean;
  isMobile: boolean;
  onLike: () => Promise<boolean>;
  onBookmark: () => Promise<boolean>;
}

export const ProductActions = ({
  productId,
  productName,
  productUrl,
  productLinks = [],
  totalLikes,
  hasLiked,
  commentCount,
  isBookmarked,
  isMobile,
  onLike,
  onBookmark,
}: ProductActionsProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  // productLinksが空の場合、productUrlからリンクを作成
  const allLinks: ProductLink[] = productLinks.length > 0
    ? productLinks
    : productUrl
      ? [{ link_type: "website", url: productUrl }]
      : [];

  const hasLinks = allLinks.length > 0;
  const hasMultipleLinks = allLinks.length > 1;

  const handleVisit = (url: string) => {
    // URLにプロトコルがない場合はhttps://を追加
    const finalUrl = url.startsWith('http://') || url.startsWith('https://')
      ? url
      : `https://${url}`;
    window.open(finalUrl, '_blank');
  };

  const handleShare = async () => {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    const shareUrl = `${window.location.origin}/products/${slug}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: t('product.details.linkCopied'),
        description: t('product.details.linkCopiedDesc'),
      });
    } catch (err) {
      console.error('Failed to copy URL:', err);
      toast({
        title: "エラー",
        description: "URLのコピーに失敗しました",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {hasMultipleLinks ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4 rounded-full"
            >
              <ExternalLink className="w-4 h-4" />
              {t('product.details.visit')}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {allLinks.map((link, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleVisit(link.url)}
                className="gap-2 cursor-pointer"
              >
                {LINK_TYPE_ICONS[link.link_type] || <LinkIcon className="w-4 h-4" />}
                <span>{link.label || LINK_TYPE_LABELS[link.link_type] || link.link_type}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          variant="outline"
          className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4 rounded-full"
          onClick={() => hasLinks && handleVisit(allLinks[0].url)}
          disabled={!hasLinks}
        >
          <ExternalLink className="w-4 h-4" />
          {t('product.details.visit')}
        </Button>
      )}
      
      <SparkleEffect>
        <Button 
          variant={hasLiked ? "like-button" : "like-button-outline"}
          className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4 rounded-full"
          onClick={onLike}
        >
          <Star className="w-4 h-4" />
          {totalLikes}
        </Button>
      </SparkleEffect>
      
      <Button 
        variant="outline" 
        className="flex-1 sm:flex-none gap-2 h-9 px-3 sm:px-4 rounded-full"
      >
        <MessageCircle className="w-4 h-4" />
        {commentCount}
      </Button>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleShare}
        className="h-9 w-9 rounded-full"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
