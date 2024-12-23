import { Upload } from "lucide-react";

interface ImageUploadProps {
  title: string;
  description: string[];
}

export const ImageUpload = ({ title, description }: ImageUploadProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{title}</label>
      <div className="border-2 border-dashed border-[#333333] rounded-lg p-8 text-center bg-[#221F26]">
        <div className="flex flex-col items-center">
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-400">
            {description.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};