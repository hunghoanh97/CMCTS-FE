import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminImageUpload from './AdminImageUpload';
import * as api from '../services/api';
import '@testing-library/jest-dom';

vi.mock('../services/api', () => ({
    uploadImage: vi.fn(),
    getImages: vi.fn().mockResolvedValue([])
}));

describe('AdminImageUpload', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.URL.createObjectURL = vi.fn(() => 'blob:preview');
        // Mock window.confirm
        window.confirm = vi.fn(() => true);
    });

    it('renders upload area initially', () => {
        render(<AdminImageUpload />);
        expect(screen.getByText('Tải ảnh lên')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Tìm kiếm hình ảnh...')).toBeInTheDocument();
    });

    it('shows error when file size is too large', async () => {
        render(<AdminImageUpload />);
        const input = screen.getByTestId('file-upload');
        
        const file = new File([''], 'large.jpg', { type: 'image/jpeg' });
        Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('Kích thước file vượt quá 5MB.')).toBeInTheDocument();
        });
    });

    it('shows error when file type is invalid', async () => {
        render(<AdminImageUpload />);
        const input = screen.getByTestId('file-upload');
        
        const file = new File([''], 'doc.pdf', { type: 'application/pdf' });

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('Định dạng file không hợp lệ. Chỉ chấp nhận JPG, PNG, WEBP.')).toBeInTheDocument();
        });
    });

    it('handles successful upload and adds to gallery', async () => {
        const mockUrl = 'blob:http://localhost/fake-url';
        (api.uploadImage as any).mockResolvedValue(mockUrl);

        render(<AdminImageUpload />);
        const input = screen.getByTestId('file-upload');
        
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        fireEvent.change(input, { target: { files: [file] } });

        // Should show loading
        expect(screen.getByText('Đang tải lên...')).toBeInTheDocument();

        // Wait for upload to complete and check if image is in gallery
        await waitFor(() => {
            expect(screen.getByAltText('test.png')).toBeInTheDocument();
        });
        
        // Check local storage updates
        expect(localStorage.getItem('admin_section_image')).toBe(mockUrl);
        const gallery = JSON.parse(localStorage.getItem('admin_gallery_images') || '[]');
        expect(gallery.length).toBe(1);
        expect(gallery[0].url).toBe(mockUrl);
    });

    it('can delete uploaded image from gallery', async () => {
        // Mock the initial API call
        (api.getImages as any).mockResolvedValueOnce(['blob:saved']);
        
        render(<AdminImageUpload />);
        
        // Wait for images to load
        await waitFor(() => {
            expect(screen.getByAltText('saved')).toBeInTheDocument();
        });
        
        // Find and click delete button (needs to hover first in real DOM, but we can just find the button by title)
        const deleteButton = screen.getByTitle('Xóa');
        fireEvent.click(deleteButton);
        
        // Confirm dialog should be called
        expect(window.confirm).toHaveBeenCalled();
        
        // Image should be removed
        await waitFor(() => {
            expect(screen.queryByAltText('saved')).not.toBeInTheDocument();
        });
    });
    
    it('can filter images by search term', async () => {
        (api.getImages as any).mockResolvedValue(['url1/apple.jpg', 'url2/banana.png']);
        
        render(<AdminImageUpload />);
        
        await waitFor(() => {
            expect(screen.getByAltText('apple.jpg')).toBeInTheDocument();
            expect(screen.getByAltText('banana.png')).toBeInTheDocument();
        });
        
        const searchInput = screen.getByPlaceholderText('Tìm kiếm hình ảnh...');
        fireEvent.change(searchInput, { target: { value: 'apple' } });
        
        expect(screen.getByAltText('apple.jpg')).toBeInTheDocument();
        expect(screen.queryByAltText('banana.png')).not.toBeInTheDocument();
    });
});