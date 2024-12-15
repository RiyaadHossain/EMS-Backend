export const formatString = (str:string) => {
    if (!str) return "";
  
    // Replace hyphens with spaces and capitalize each word
    return str
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};
  