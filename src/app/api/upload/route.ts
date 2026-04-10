import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Нет файла" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "altosh-travel" },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(NextResponse.json({ url: result.secure_url }));
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Нет URL" }, { status: 400 });
    }

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1]; // public_id.jpg
    const publicIdWithExt = lastPart;
    const publicId = publicIdWithExt.split(".")[0];
    const folderMatch = url.match(/\/v\d+\/(.+)\/[^/]+$/);
    const folder = folderMatch && folderMatch[1] !== "upload" ? folderMatch[1] : "altosh-travel";

    const fullPublicId = `${folder}/${publicId}`;

    await cloudinary.uploader.destroy(fullPublicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
