
export class ImageProcessor {
  // Função melhorada para converter imagem para base64
  imageToBase64(img: HTMLImageElement): Promise<string> {
    return new Promise((resolve) => {
      try {
        // Se a imagem já é base64, retorna como está
        if (img.src.startsWith('data:')) {
          resolve(img.src);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(img.src);
          return;
        }

        // Aguardar o carregamento da imagem se necessário
        if (!img.complete) {
          img.onload = () => this.processImage(img, canvas, ctx, resolve);
          img.onerror = () => resolve(img.src);
        } else {
          this.processImage(img, canvas, ctx, resolve);
        }
      } catch (e) {
        console.warn('Erro no processamento da imagem:', e);
        resolve(img.src);
      }
    });
  }

  private processImage(img: HTMLImageElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, resolve: (value: string) => void) {
    canvas.width = img.naturalWidth || img.width || 100;
    canvas.height = img.naturalHeight || img.height || 100;
    
    try {
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png', 1.0);
      resolve(dataURL);
    } catch (e) {
      console.warn('Erro ao converter imagem:', e);
      resolve(img.src);
    }
  }

  async processAllImages(clonedElement: HTMLElement, originalElement: HTMLElement): Promise<void> {
    const images = clonedElement.querySelectorAll('img');
    const originalImages = originalElement.querySelectorAll('img');
    
    for (let i = 0; i < images.length && i < originalImages.length; i++) {
      try {
        const originalImg = originalImages[i] as HTMLImageElement;
        const clonedImg = images[i] as HTMLImageElement;
        
        const base64 = await this.imageToBase64(originalImg);
        clonedImg.src = base64;
      } catch (e) {
        console.warn('Erro ao processar imagem:', e);
      }
    }
  }
}
