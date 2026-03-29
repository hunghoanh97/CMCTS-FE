import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RefreshCw, Loader2, Search, Image as ImageIcon } from 'lucide-react';
import { uploadImage, getImages, deleteImage, UploadedImage as ApiUploadedImage } from '../services/api';

// Đổi tên interface để không bị trùng với type trả về từ API
interface LocalUploadedImage extends ApiUploadedImage {
    // Local state có thể cần thêm các field nếu cần thiết
}

const AdminImageUpload: React.FC = () => {
    const [images, setImages] = useState<LocalUploadedImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState<LocalUploadedImage | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const IMAGES_PER_PAGE = 20;

    useEffect(() => {
        // Load images from API
        const loadImages = async () => {
            try {
                const apiImages = await getImages();
                if (apiImages && apiImages.length > 0) {
                    setImages(apiImages);
                    localStorage.setItem('admin_gallery_images', JSON.stringify(apiImages));
                } else {
                    setImages([]);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách ảnh từ API:", error);
                // Fallback to local storage
                const savedImages = localStorage.getItem('admin_gallery_images');
                if (savedImages) {
                    setImages(JSON.parse(savedImages));
                }
            }
        };

        loadImages();
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Validation
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước file vượt quá 5MB.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP.');
            return;
        }

        // Hỏi thêm mô tả
        let description: string | undefined;
        try {
            const result = window.prompt("Nhập mô tả cho ảnh (không bắt buộc):", "");
            description = result !== null ? result : undefined;
        } catch (e) {
            // Fallback for environments where prompt is not supported
            console.warn("Prompt is not supported in this environment");
            description = undefined;
        }

        // Auto upload
        setIsUploading(true);
        try {
            const newImage = await uploadImage(file, description);
            
            const updatedImages = [newImage, ...images];
            setImages(updatedImages);
            localStorage.setItem('admin_gallery_images', JSON.stringify(updatedImages));
            
            // Set as active banner automatically for backward compatibility
            localStorage.setItem('admin_section_image', newImage.url);
            // Kích hoạt sự kiện storage để Home page cập nhật
            window.dispatchEvent(new Event('storage'));
            
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra khi upload ảnh.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
            try {
                // Gọi API xóa trên backend
                await deleteImage(id);

                const updatedImages = images.filter(img => img.id !== id);
                setImages(updatedImages);
                localStorage.setItem('admin_gallery_images', JSON.stringify(updatedImages));
                
                // If we deleted the active image, clear it
                const activeImage = localStorage.getItem('admin_section_image');
                const deletedImage = images.find(img => img.id === id);
                if (activeImage === deletedImage?.url) {
                    localStorage.removeItem('admin_section_image');
                    window.dispatchEvent(new Event('storage'));
                }
                
                if (selectedImage?.id === id) {
                    setSelectedImage(null);
                }
            } catch (err: any) {
                setError(err.message || 'Lỗi khi xóa ảnh');
            }
        }
    };
    
    const setAsBanner = (url: string, e: React.MouseEvent) => {
        e.stopPropagation();
        localStorage.setItem('admin_section_image', url);
        window.dispatchEvent(new Event('storage'));
        alert('Đã đặt làm ảnh hiển thị chính!');
    };

    // Filtering & Pagination
    const filteredImages = images.filter(img => 
        img.fileName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (img.description && img.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
    const paginatedImages = filteredImages.slice(
        (currentPage - 1) * IMAGES_PER_PAGE, 
        currentPage * IMAGES_PER_PAGE
    );

    return (
        <div className="w-full h-full flex flex-col">
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center justify-between text-sm">
                    <span className="font-medium">{error}</span>
                    <button onClick={() => setError(null)}><X size={16} /></button>
                </div>
            )}

            {/* Upload Area */}
            <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-white mb-6 relative overflow-hidden"
                onClick={() => !isUploading && fileInputRef.current?.click()}
            >
                {isUploading ? (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 text-cmc-blue animate-spin mb-2" />
                        <span className="text-cmc-blue font-semibold">Đang tải lên...</span>
                    </div>
                ) : null}
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Tải ảnh lên</h3>
                <p className="text-gray-500 text-xs">PNG, JPG, WEBP (Tối đa 5MB)</p>
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative flex-1 mr-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm hình ảnh..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-sm text-gray-500 font-medium">
                    {filteredImages.length} ảnh
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
                {paginatedImages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                        <p>Không có hình ảnh nào</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {paginatedImages.map(img => (
                            <div 
                                key={img.id} 
                                className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                            >
                                <div className="aspect-square w-full bg-gray-100 overflow-hidden relative">
                                    <img 
                                        src={img.url} 
                                        alt={img.fileName} 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setAsBanner(img.url, e);
                                            }}
                                            className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            title="Đặt làm banner"
                                        >
                                            <RefreshCw size={16} />
                                        </button>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(img.id, e);
                                            }}
                                            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"
                                            title="Xóa"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-800 truncate" title={img.fileName}>{img.fileName}</p>
                                    <p className="text-[10px] text-gray-500">{new Date(img.uploadedAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-2 py-1 text-sm border rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span className="text-sm font-medium text-gray-600">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-2 py-1 text-sm border rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            )}

            {/* Full size preview modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <button 
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X size={32} />
                    </button>
                    <div className="relative max-w-full max-h-[90vh] flex flex-col items-center">
                        <img 
                            src={selectedImage.url} 
                            alt={selectedImage.fileName} 
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="mt-4 bg-black/60 text-white px-6 py-3 rounded-lg text-center max-w-2xl">
                            <p className="font-semibold text-lg">{selectedImage.fileName}</p>
                            {selectedImage.description && (
                                <p className="text-sm text-gray-300 mt-1">{selectedImage.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB • {new Date(selectedImage.uploadedAt).toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png, image/webp"
                className="hidden"
                data-testid="file-upload"
            />
        </div>
    );
};

export default AdminImageUpload;