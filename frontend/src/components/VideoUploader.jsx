import { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, FolderOpen, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoUploader = ({ onUploadComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        if (!file.type.startsWith('video/')) {
            setError('Please upload a valid video file.');
            return;
        }

        setError(null);
        setUploading(true);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:8000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            setTimeout(() => {
                setUploading(false);
                onUploadComplete(response.data);
            }, 600);

        } catch (err) {
            console.error(err);
            setError('Connection failed. Server inactive.');
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`
                    relative group border-[3px] border-dashed rounded-[20px] p-12 transition-all duration-300 cursor-pointer 
                    flex flex-col items-center justify-center gap-6 text-center bg-surface-off
                    ${isDragging
                        ? 'border-brand-secondary bg-brand-primary/5 scale-[1.02]'
                        : 'border-brand-primary/50 hover:border-brand-secondary hover:bg-brand-primary/5'}
                    ${uploading ? 'cursor-default pointer-events-none' : ''}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileSelect}
                />

                <AnimatePresence mode='wait'>
                    {!uploading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 py-8"
                        >
                            <div className="text-brand-primary mb-4">
                                <FolderOpen className="w-20 h-20 drop-shadow-md" strokeWidth={1.5} />
                            </div>

                            <h2 className="text-2xl font-bold text-text-main">
                                Drop your Video file here or click to browse
                            </h2>
                            <p className="text-text-muted">
                                Supports .mp4, .avi, .mov files with surveillance footage
                            </p>

                            <button className="mt-6 px-10 py-3 rounded-full text-white font-semibold text-lg bg-btn-gradient shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                Select File
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-6 w-full max-w-sm py-8"
                        >
                            <div className="relative">
                                <Video className="w-16 h-16 text-brand-primary animate-pulse" />
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-sm font-semibold text-text-muted uppercase tracking-wider">
                                    <span>Uploading...</span>
                                    <span className="text-brand-secondary">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-btn-gradient"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ ease: "linear" }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 text-sm font-medium flex items-center justify-center gap-2"
                >
                    <span className="font-bold">Error:</span> {error}
                </motion.div>
            )}
        </div>
    );
};

export default VideoUploader;
