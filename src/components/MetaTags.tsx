interface MetaTagsProps {
  title: string;
  description?: string;
  image?: string;
}

export const MetaTags = ({ title, description, image }: MetaTagsProps) => {
  return (
    <>
      <title>{title}</title>
      <meta name="title" content={title} />
      {description && <meta name="description" content={description} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      {description && <meta property="twitter:description" content={description} />}
      {image && <meta property="twitter:image" content={image} />}
    </>
  );
};