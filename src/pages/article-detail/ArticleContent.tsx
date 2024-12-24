import ReactMarkdown from "react-markdown";

interface ArticleContentProps {
  content: string;
}

export const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};