import api from '../utils/api';

export interface UploadedImage {
  id: number;
  url: string;
  fileName: string;
  description?: string;
  size: number;
  uploadedAt: string;
}

export const uploadImage = async (file: File, description?: string): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append('file', file);
  if (description) {
    formData.append('description', description);
  }

  try {
    const response = await api.post('/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Ở FE không cần ghép thêm baseURL nữa vì BE (FileService) đã tự ghép Request.Scheme + Request.Host rồi
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi upload file.');
  }
};

export const getImages = async (): Promise<UploadedImage[]> => {
  try {
    const response = await api.get('/file/images');
    
    // Ở FE không cần ghép thêm baseURL nữa vì BE (FileService) đã tự ghép Request.Scheme + Request.Host rồi
    // Việc này tránh trường hợp ghép thừa (thành dạng http://localhost:5000http://localhost:5284/...)
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi lấy danh sách ảnh.');
  }
};

export const deleteImage = async (id: number): Promise<void> => {
  try {
    await api.delete(`/file/images/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa ảnh.');
  }
};