import html2canvas from 'html2canvas';

async function imageToDataUrl(src: string): Promise<string | null> {
  if (!src || src.startsWith('data:')) return src;

  try {
    const response = await fetch(src);
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function preloadImages(
  element: HTMLElement,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const images = element.querySelectorAll('img');

  await Promise.all(
    Array.from(images).map(async (img) => {
      const src = img.currentSrc || img.src;
      if (!src || map.has(src)) return;
      const dataUrl = await imageToDataUrl(src);
      if (dataUrl) map.set(src, dataUrl);
    }),
  );

  return map;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}

export async function captureCardAsImage(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const imageMap = await preloadImages(element);

  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a0a',
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
    onclone: (clonedDoc, clonedElement) => {
      const style = clonedDoc.createElement('style');
      style.textContent = `
        .gradient-border::before { display: none !important; }
        .gradient-border {
          border: 1px solid #f97316 !important;
          background: #111111 !important;
        }
        .avatar-skeleton { display: none !important; }
        img { opacity: 1 !important; }
      `;
      clonedDoc.head.appendChild(style);

      clonedElement.querySelectorAll('img').forEach((img) => {
        const src = img.currentSrc || img.src;
        const dataUrl = imageMap.get(src);
        if (dataUrl) {
          img.removeAttribute('crossorigin');
          img.src = dataUrl;
        }
      });
    },
  });

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });

  if (!blob) {
    throw new Error('Failed to generate image');
  }

  downloadBlob(blob, filename);
}
