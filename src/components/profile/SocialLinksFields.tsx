
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandTwitter, BrandInstagram, BrandGithub, Globe } from "tabler-icons-react";

interface SocialLinksFieldsProps {
  twitterUrl: string;
  setTwitterUrl: (url: string) => void;
  instagramUrl: string;
  setInstagramUrl: (url: string) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  otherUrl: string;
  setOtherUrl: (url: string) => void;
}

export const SocialLinksFields = ({
  twitterUrl,
  setTwitterUrl,
  instagramUrl,
  setInstagramUrl,
  githubUrl,
  setGithubUrl,
  otherUrl,
  setOtherUrl,
}: SocialLinksFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">SNSリンク</h3>
      
      <div className="grid gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-500 rounded-md">
            <BrandTwitter size={20} />
          </div>
          <div className="flex-1">
            <Label htmlFor="twitter" className="sr-only">Twitter</Label>
            <Input
              id="twitter"
              placeholder="Twitter URL"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="focus-blue"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-pink-50 text-pink-500 rounded-md">
            <BrandInstagram size={20} />
          </div>
          <div className="flex-1">
            <Label htmlFor="instagram" className="sr-only">Instagram</Label>
            <Input
              id="instagram"
              placeholder="Instagram URL"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="focus-blue"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 rounded-md">
            <BrandGithub size={20} />
          </div>
          <div className="flex-1">
            <Label htmlFor="github" className="sr-only">GitHub</Label>
            <Input
              id="github"
              placeholder="GitHub URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="focus-blue"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-teal-50 text-teal-500 rounded-md">
            <Globe size={20} />
          </div>
          <div className="flex-1">
            <Label htmlFor="other" className="sr-only">その他</Label>
            <Input
              id="other"
              placeholder="その他のURL"
              value={otherUrl}
              onChange={(e) => setOtherUrl(e.target.value)}
              className="focus-blue"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
