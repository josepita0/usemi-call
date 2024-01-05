import { auth } from "@clerk/nextjs"
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth()

    if(!userId) throw new Error("No autorizado")

    return { userId }
}
 
// const auth = (req: Request) => ({ id: "fakeId" }); 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {

    serverImage: f({ image: {maxFileSize: "4MB", maxFileCount:1} })
        .middleware(() => handleAuth())
        .onUploadComplete(() => {}),

    messageFile: f(["image", "pdf"] )
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})




//   // Define as many FileRoutes as you like, each with a unique routeSlug
//   imageUploader: f({ image: { maxFileSize: "4MB" } })
//     // Set permissions and file types for this FileRoute
//     .middleware(async ({ req }) => {
//       // This code runs on your server before upload
//       const user = await auth(req);
 
//       // If you throw, the user will not be able to upload
//       if (!user) throw new Error("Unauthorized");
 
//       // Whatever is returned here is accessible in onUploadComplete as `metadata`
//       return { userId: user.id };
//     })
//     .onUploadComplete(async ({ metadata, file }) => {
//       // This code RUNS ON YOUR SERVER after upload
//       console.log("Upload complete for userId:", metadata.userId);
 
//       console.log("file url", file.url);
 
//       // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
//       return { uploadedBy: metadata.userId };
//     }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;