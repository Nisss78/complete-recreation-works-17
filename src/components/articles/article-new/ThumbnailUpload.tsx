import { useLanguage } from "@/contexts/LanguageContext";

interface ThumbnailUploadProps {
  thumbnailUrl: string;
  onThumbnailUpload: (file: File) => Promise<void>;
}

export const ThumbnailUpload = ({ thumbnailUrl, onThumbnailUpload }: ThumbnailUploadProps) => {
  const { t } = useLanguage();

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('articles.new.thumbnailTitle')}
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onThumbnailUpload(file);
              }}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
              <p className="text-sm text-gray-600">
                {t('articles.new.thumbnailDescription')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('articles.new.thumbnailSize')}
              </p>
            </div>
          </div>
        </div>
        {thumbnailUrl && (
          <div className="w-48">
            <img 
              src={thumbnailUrl} 
              alt={t('articles.new.thumbnailTitle')} 
              className="w-full aspect-[1.91/1] object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};