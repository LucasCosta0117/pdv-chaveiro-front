import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import imageCompression from 'browser-image-compression';

/**
 * Realiza o upload de um arquivo e retorna sua URL pública.
 * @param {File} file - Arquivo binário selecionado.
 * @param {String} folder - Pasta de destino (ex: 'products', 'jobs').
 */
export const uploadFile = async (file, folder = 'general') => {
  if (!file) return null;

  try {
    const fileName = `${Date.now()}_${file.name}`;
    const fileRef = ref(storage, `${folder}/${fileName}`);
    const snapshot = await uploadBytes(fileRef, file);

    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error("Erro no uploadFile:", error);
    throw error;
  }
};

/**
 * Remove um arquivo do storage através da sua URL.
 * @param {String} fileUrl - URL completa do arquivo.
 */
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Erro no deleteFile:", error);
    throw error;
  }
};

/**
 * Realiza a compressão e o redimensionamento de um arquivo de imagem.
 * 
 * @param {File} file - O arquivo de imagem original selecionado pelo usuário.
 * @returns {Promise<File>} Uma Promise que resolve com o arquivo comprimido (Blob/File).
 */
export const compressImage = async (file) => {
  try {
    const options = {
      maxSizeMB: 1,            // Tenta reduzir o arquivo para menos de 1MB
      maxWidthOrHeight: 1024,  // Limita a maior dimensão (largura ou altura) a 1024px
      useWebWorker: true,      // Utiliza Web Workers para evitar travar a interface do usuário
      fileType: 'image/webp'   // Converte para WebP para melhor eficiência de compressão
    };
    const compressedFile = await imageCompression(file, options);
    
    return compressedFile;
  } catch (error) {
    console.error("Erro ao comprimir imagem:", error);
    this.$store.dispatch('ui/notify', {
      message: 'Erro ao processar a imagem. Tente um arquivo menor.',
      color: 'error'
    }, { root: true });
    throw error;
  }
};