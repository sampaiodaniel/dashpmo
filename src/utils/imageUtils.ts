// Utilitário para trabalhar com imagens nos relatórios

/**
 * Converte uma imagem para base64
 */
export const imageToBase64 = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Não foi possível obter contexto do canvas'));
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      try {
        const dataURL = canvas.toDataURL('image/png', 1.0);
        resolve(dataURL);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Erro ao carregar imagem: ${src}`));
    };
    
    img.src = src;
  });
};

/**
 * Obtém a URL correta para uma imagem, com fallbacks
 */
export const getImageUrl = (relativePath: string): string => {
  // Tentar diferentes formatos de URL
  const baseUrl = window.location.origin;
  
  // URLs para tentar
  const urls = [
    `${baseUrl}${relativePath}`,
    `${baseUrl}/${relativePath}`,
    relativePath
  ];
  
  return urls[0]; // Retorna a primeira URL como padrão
};

/**
 * Valida se uma imagem pode ser carregada
 */
export const validateImage = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    
    img.src = src;
  });
};

/**
 * Carrega uma imagem com múltiplos fallbacks
 */
export const loadImageWithFallbacks = async (relativePath: string): Promise<string> => {
  const baseUrl = window.location.origin;
  
  const urls = [
    `${baseUrl}${relativePath}`,
    `${baseUrl}/${relativePath}`,
    relativePath
  ];
  
  for (const url of urls) {
    const isValid = await validateImage(url);
    if (isValid) {
      return url;
    }
  }
  
  throw new Error(`Não foi possível carregar a imagem: ${relativePath}`);
};

/**
 * Prepara imagens para uso em relatórios (converte para base64 se necessário)
 */
export const prepareImageForReport = async (relativePath: string): Promise<string> => {
  try {
    // Primeiro tenta carregar a imagem normalmente
    const url = await loadImageWithFallbacks(relativePath);
    
    // Se conseguir carregar, tenta converter para base64 para garantir compatibilidade
    try {
      const base64 = await imageToBase64(url);
      return base64;
    } catch {
      // Se a conversão falhar, retorna a URL normal
      return url;
    }
  } catch {
    // Se tudo falhar, retorna uma URL de fallback
    console.warn(`Não foi possível carregar a imagem: ${relativePath}`);
    return relativePath;
  }
}; 