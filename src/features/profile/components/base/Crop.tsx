import React, { useState, useRef } from "react";

import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from "react-image-crop";
import { canvasPreview } from "./CanvasPreview";

import "react-image-crop/dist/ReactCrop.css";
import { useDebounceEffect } from "../../hooks/useDebounceEffect";
import { Loader } from "lucide-react";

// This to make and center a % aspect crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
type ImgCropProps = {
  handleUpload: (file: File) => Promise<void>;
  aspectRatio?: number;
};

export default function ImgCrop({ handleUpload, aspectRatio = 1 / 1 }: ImgCropProps) {
  const [imgSrc, setImgSrc] = useState("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale] = useState(1);
  const [rotate] = useState(0);
  const [aspect] = useState<number | undefined>(aspectRatio);
  const [isUploding, setIsUploading] = useState(false);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onDownloadCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height,
    );

    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    const newFile = new File(
      [blob],
      `${Date.now().toString()}-${Math.random().toString(36).substring(2, 7)}.png`,
      { type: "image/png" },
    );

    console.log(`blog`, newFile);
    try {
      setIsUploading(true);
      await handleUpload(newFile);
    } catch (error) {
      console.log("error while uploading photo", error);
    } finally {
      setIsUploading(false);
    }
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(imgRef.current, previewCanvasRef.current, completedCrop, scale, rotate);
      }
    },
    100,
    [completedCrop, scale, rotate],
  );

  return (
    <div>
      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="file:bg-pop-green/90 hover:file:bg-pop-green text-zinc-400 outline-none file:cursor-pointer file:rounded-2xl file:px-4 file:py-1 file:text-black"
        />
      </div>
      {!!imgSrc && (
        <div className="m-h-2/3 flex w-full justify-center overflow-hidden">
          <ReactCrop
            className="mt-3 object-contain"
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            minHeight={100}
            style={{
              maxHeight: "60vh", // Additional constraint for the crop container
              overflow: "hidden",
            }}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxHeight: "60vh", // Constrain image height
                objectFit: "contain",
                width: "auto",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
      )}
      {!!completedCrop && (
        <>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                objectFit: "contain",
                width: completedCrop.width,
                height: completedCrop.height,
                display: "none",
              }}
            />
          </div>
          <div className="mx-auto mt-5 w-fit">
            <button
              disabled={isUploding}
              className="bg-pop-green/80 hover:bg-pop-green flex w-28 cursor-pointer justify-center rounded-2xl px-5 py-1 disabled:cursor-not-allowed disabled:bg-zinc-400"
              onClick={onDownloadCropClick}
            >
              {isUploding ? <Loader className="animate-spin" /> : <span>upload</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
