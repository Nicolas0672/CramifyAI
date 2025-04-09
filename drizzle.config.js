import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
    dbCredentials:{
        url: 'postgresql://AI-Mocker_owner:npg_Lrb1utPN9EMI@ep-red-grass-a8ipkofo-pooler.eastus2.azure.neon.tech/CramifyAI?sslmode=require'
    }
    // REMEMER TO REMOVE LINK BEFORE GIT SAVE
});
