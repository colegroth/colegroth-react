import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "o0lkpygl",
  dataset: "production",
  useCdn: true, 
  apiVersion: "2025-12-31",
});