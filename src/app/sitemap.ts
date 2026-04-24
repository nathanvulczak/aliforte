import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aliforte.vercel.app";

  return [
    {
      url: `${baseUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/contato`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/produtos`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trabalhe-conosco`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/admin`,
      changeFrequency: "weekly",
      priority: 0.3,
    },
  ];
}
