import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const AddFileEntryToDb=mutation({
  args:{
    fileId: v.string(),
    storageId: v.string(),
    fileName: v.string(),
    createdBy: v.string(),
    fileUrl: v.string()
  },
  handler:async(ctx,args)=>{
    const result = await ctx.db.insert('pdfFiles',{
      fileId: args.fileId,
      fileName: args.fileName,
      storageId: args.storageId,
      createdBy: args.createdBy,
      fileUrl: args.fileUrl
    })
    return 'Inserted'
  }
})

export const getFileUrl = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    // In JavaScript, we don't need explicit type casting
    return await ctx.storage.getUrl(args.storageId);
  },
});
