/**
 * Optimizes an Unsplash URL by appending specific formatting and sizing parameters.
 * If the URL already contains query parameters, it correctly appends additional ones using '&'.
 * It also checks to avoid duplicate parameters.
 */
export const optimizeImage = (url: string | null | undefined): string => {
  if (!url) return "/fallback.webp";
  
  // If it's a local path or doesn't look like a URL with params, treat it simply
  if (!url.startsWith('http')) return url;

  // If parameters are already present, don't append them again to avoid Unsplash issues
  if (url.includes("w=") && url.includes("fm=webp")) return url;

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=400&h=300&fit=crop&q=70&fm=webp`;
};
