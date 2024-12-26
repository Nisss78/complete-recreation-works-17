import { Helmet } from "react-helmet";

interface MetaTagsProps {
  title: string;
  description?: string;
  image?: string;
  type?: string;
  author?: string;
}

export const MetaTags = ({ title, description, image, type = "website", author }: MetaTagsProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      {description && <meta name="description" content={description} />}
      {author && <meta name="author" content={author} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      {description && <meta property="twitter:description" content={description} />}
      {image && <meta property="twitter:image" content={image} />}
      {author && <meta property="twitter:creator" content={author} />}
    </Helmet>
  );
};