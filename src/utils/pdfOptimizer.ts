import { PDFDocument } from 'pdf-lib';

/**
 * Comprime um PDF já gerado usando pdf-lib
 */
export async function compressPdf(pdfBytes: Uint8Array): Promise<Uint8Array> {
  try {
    console.log('Iniciando compressão do PDF...');
    console.log('Tamanho original:', Math.round(pdfBytes.length / 1024), 'KB');
    
    // Carregar o PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Aplicar compressão básica
    const compressedBytes = await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });
    
    console.log('Tamanho comprimido:', Math.round(compressedBytes.length / 1024), 'KB');
    console.log('Redução:', Math.round((1 - compressedBytes.length / pdfBytes.length) * 100), '%');
    
    return compressedBytes;
  } catch (error) {
    console.warn('Erro na compressão, retornando PDF original:', error);
    return pdfBytes;
  }
}

/**
 * Configurações básicas e seguras para html2canvas
 */
export function getBasicHtml2CanvasConfig(element: HTMLElement) {
  return {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    logging: false,
    removeContainer: true,
    imageTimeout: 0,
    foreignObjectRendering: true,
    letterRendering: true,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  };
}

/**
 * Configurações básicas e seguras para jsPDF
 */
export function getBasicJsPDFConfig(orientation: 'portrait' | 'landscape' = 'landscape') {
  return {
    unit: 'in',
    format: 'a4',
    orientation,
    compress: true
  };
}

/**
 * Configurações básicas para imagens
 */
export function getBasicImageConfig() {
  return {
    type: 'jpeg' as const,
    quality: 0.8
  };
} 