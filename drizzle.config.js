import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgresql://carmarketplace_owner:Ln1D2HlMYcrx@ep-small-block-a5uv42ub.us-east-2.aws.neon.tech/ai-short-video-generator-db?sslmode=require",
  }
});