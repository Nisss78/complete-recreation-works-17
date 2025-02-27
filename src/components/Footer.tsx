
import { Link } from "react-router-dom";
import { X, Link as LinkIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const Footer = () => {
  const isMobile = useIsMobile();

  return (
    <footer className="border-t bg-luxury-cream/50 backdrop-blur-sm mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-serif font-bold mb-3 sm:mb-4 text-luxury-navy">About Protoduct</h3>
            <p className="text-sm text-gray-600">
              A platform for uploading and sharing prototype applications we develop
            </p>
          </div>
          
          <div>
            <h3 className="font-serif font-bold mb-3 sm:mb-4 text-luxury-navy">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-luxury-navy transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-luxury-navy transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="items-center">
            <h3 className="font-serif font-bold mb-3 sm:mb-4 text-luxury-navy">Social</h3>
            <div className="flex flex-col gap-2 items-center">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-luxury-navy transition-colors p-2 rounded-full hover:bg-luxury-cream"
              >
                <X className="w-5 h-5" />
              </a>
              <a
                href="https://website.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-luxury-navy transition-colors p-2 rounded-full hover:bg-luxury-cream"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {!isMobile && (
            <div>
              <Link to="/" className="font-serif font-bold text-xl block mb-4 text-luxury-navy">
                <span className="text-gradient">Protoduct</span>
              </Link>
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-600 pt-6 sm:pt-8 border-t">
          © 2024 Protoduct. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
