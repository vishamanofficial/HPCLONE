'use client';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Image,
  Upload,
  Search,
  Trash2,
  Copy,
  ExternalLink,
  Folder,
  File,
  Check,
  RefreshCw,
  X
} from 'lucide-react';

export default function MediaLibraryPage() {
  const { success, error } = useToast();

  const [mediaList, setMediaList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Selected media for inspector
  const [selectedMedia, setSelectedMedia] = useState<any>(null);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = async () => {
    setIsLoading(true);
    try {
      const res = await api.getAdminMedia({ folder: selectedFolder, search: searchTerm });
      if (res.success) setMediaList(res.media);
    } catch (err: any) {
      error(err.message || 'Failed to fetch media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder, searchTerm]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        formData.append('folder', selectedFolder !== 'all' ? selectedFolder : 'general');
        await api.uploadMedia(formData);
      }
      success('Files uploaded successfully!');
      fetchMedia();
    } catch (err: any) {
      error(err.message || 'Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    success('Media URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.deleteMedia(deleteTarget._id);
      success('Media file removed');
      setDeleteTarget(null);
      if (selectedMedia && selectedMedia._id === deleteTarget._id) {
        setSelectedMedia(null);
      }
      fetchMedia();
    } catch (err: any) {
      error(err.message || 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Centralized Media Library
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Upload, optimize, organize folders, inspect alt tags, and verify image usage across pages.
          </p>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 transform active:scale-95 shadow-sm px-6 py-3 text-sm bg-gradient-to-r from-primary to-accent-orange text-white hover:brightness-110 gap-2">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
          </div>
        </label>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2">
          {['all', 'general', 'services', 'blogs', 'portfolio', 'team'].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFolder(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${
                selectedFolder === f
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Search media files by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-text-muted" />}
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaList.length > 0 ? (
          mediaList.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedMedia(item)}
              className={`group relative rounded-2xl bg-card border overflow-hidden cursor-pointer transition-all aspect-square flex flex-col justify-between ${
                selectedMedia?._id === item._id ? 'border-primary ring-2 ring-primary/40' : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="w-full h-full flex items-center justify-center bg-surface overflow-hidden">
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <File className="w-10 h-10 text-text-muted" />
                )}
              </div>

              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-[10px]">
                <span className="truncate max-w-[90px] font-medium">{item.originalName}</span>
                <span className="font-mono">{(item.size / 1024).toFixed(0)}KB</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-xs text-text-muted">
            No media files uploaded yet. Click "Upload Media" above to add images.
          </div>
        )}
      </div>

      {/* Selected Media Detail Drawer */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md h-full bg-card border-l border-border p-6 sm:p-8 flex flex-col justify-between overflow-y-auto text-left shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-base font-black text-text-primary">File Details</h3>
                <button onClick={() => setSelectedMedia(null)} className="p-1.5 text-text-muted hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full aspect-video rounded-2xl bg-surface border border-border overflow-hidden flex items-center justify-center">
                <img src={selectedMedia.url} alt={selectedMedia.altText} className="w-full h-full object-contain" />
              </div>

              <div className="flex flex-col gap-3 text-xs">
                <div>
                  <span className="text-text-muted uppercase font-bold text-[10px]">Original Filename</span>
                  <div className="font-bold text-text-primary mt-0.5">{selectedMedia.originalName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-text-muted uppercase font-bold text-[10px]">File Size</span>
                    <div className="font-bold text-text-primary mt-0.5">{(selectedMedia.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <div>
                    <span className="text-text-muted uppercase font-bold text-[10px]">MIME Type</span>
                    <div className="font-mono text-text-primary mt-0.5">{selectedMedia.mimeType}</div>
                  </div>
                </div>

                <div>
                  <span className="text-text-muted uppercase font-bold text-[10px]">Public URL</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Input value={window.location.origin + selectedMedia.url} readOnly />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyUrl(selectedMedia.url, selectedMedia._id)}
                    >
                      {copiedId === selectedMedia._id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="text-text-muted uppercase font-bold text-[10px]">Alt Text (Accessibility & SEO)</span>
                  <Input
                    value={selectedMedia.altText || ''}
                    onChange={async (e) => {
                      const val = e.target.value;
                      setSelectedMedia({ ...selectedMedia, altText: val });
                      await api.updateMedia(selectedMedia._id, { altText: val });
                    }}
                    placeholder="Descriptive image alt text"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                onClick={() => setDeleteTarget(selectedMedia)}
                className="text-xs font-bold text-rose-500 hover:underline flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete Permanently
              </button>

              <Button variant="secondary" size="sm" onClick={() => setSelectedMedia(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Media File?"
        message="This will delete this image file from the server. Any pages referencing it will no longer display it."
        confirmLabel="Yes, Delete File"
        isDestructive
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

