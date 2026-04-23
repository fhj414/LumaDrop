import { UploadDropzone } from "@/components/upload/upload-dropzone";

export default function UploadPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-muted-foreground">Upload</p>
        <h1 className="text-3xl font-semibold tracking-normal">上传照片</h1>
      </div>
      <UploadDropzone />
    </div>
  );
}
