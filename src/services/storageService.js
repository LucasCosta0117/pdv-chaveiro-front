import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Realiza o upload de um arquivo e retorna sua URL pública.
 * @param {File} file - Arquivo binário selecionado.
 * @param {String} folder - Pasta de destino (ex: 'products', 'jobs').
 */
export const uploadFile = async (file, folder = 'general') => {
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;
  const fileRef = ref(storage, `${folder}/${fileName}`);
  const snapshot = await uploadBytes(fileRef, file);

  return await getDownloadURL(snapshot.ref);
};

/**
 * Remove um arquivo do storage através da sua URL.
 * @param {String} fileUrl - URL completa do arquivo.
 */
export const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;
  
  const fileRef = ref(storage, fileUrl);

  return await deleteObject(fileRef);
};