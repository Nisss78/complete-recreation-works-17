import { Link } from "react-router-dom";
import { X, Link as LinkIcon } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Productoについて</h3>
            <p className="text-sm text-gray-600">
              私たちが開発するものをプロトタイプのアプリをアップロードするプラットフォーム
            </p>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">リンク</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  利用規約
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">ソーシャル</h3>
            <div className="flex gap-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <X className="w-5 h-5" />
              </a>
              <a href="https://website.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">
                <LinkIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <Link to="/" className="font-bold text-xl block mb-4">
              Producto
            </Link>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-600 pt-8 border-t">
          © 2024 protoduct. All rights reserved.
        </div>
      </div>
    </footer>
  );
};