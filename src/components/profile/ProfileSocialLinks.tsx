
import { Twitter, Instagram, Github, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileSocialLinksProps {
  profile: {
    twitter_url?: string;
    instagram_url?: string;
    github_url?: string;
    other_url?: string;
  };
}

export const ProfileSocialLinks = ({ profile }: ProfileSocialLinksProps) => {
  const socialLinks = [
    {
      url: profile.twitter_url,
      icon: Twitter,
      name: "Twitter",
      color: "text-blue-400 hover:text-blue-500",
    },
    {
      url: profile.instagram_url,
      icon: Instagram,
      name: "Instagram",
      color: "text-pink-500 hover:text-pink-600",
    },
    {
      url: profile.github_url,
      icon: Github,
      name: "GitHub",
      color: "text-gray-700 hover:text-gray-900",
    },
    {
      url: profile.other_url,
      icon: Globe,
      name: "Website",
      color: "text-purple-500 hover:text-purple-600",
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <TooltipProvider>
        {socialLinks.map((link, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-9 w-9"
                onClick={() => window.open(link.url, "_blank")}
              >
                <link.icon className={`h-4 w-4 ${link.color}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{link.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};
