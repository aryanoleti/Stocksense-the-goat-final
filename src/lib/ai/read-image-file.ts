export type ReadImageResult = { mimeType: string; data: string; dataUrl: string };

const MAX_BYTES = 8 * 1024 * 1024; // 8MB — generous for a screenshot, keeps requests sane

/** Reads an image File/Blob into base64 for a Gemini inlineData part. Returns null if it's not an image or too large. */
export function readImageFile(file: File): Promise<ReadImageResult | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size > MAX_BYTES) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        resolve(null);
        return;
      }
      const base64 = result.split(",")[1];
      if (!base64) {
        resolve(null);
        return;
      }
      resolve({ mimeType: file.type, data: base64, dataUrl: result });
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
