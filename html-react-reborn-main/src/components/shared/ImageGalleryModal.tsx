import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: Array<{ url: string; title: string }>;
  initialIndex?: number;
}

export function ImageGalleryModal({ isOpen, onClose, images, initialIndex = 0 }: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, currentIndex, images.length]);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-7xl max-h-screen">
        {/* Área principal da imagem */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Título da imagem acima da imagem */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
            <h2 className="text-xl font-semibold text-white mb-1 bg-black/70 px-4 py-2 rounded-lg">
              {currentImage?.title || "Imagem"}
            </h2>
            <p className="text-gray-300 text-sm bg-black/50 px-3 py-1 rounded">
              {currentIndex + 1} de {images.length}
            </p>
          </div>

          {/* Botão fechar */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Botão anterior */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-10 text-white hover:bg-white/20"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Imagem */}
          {currentImage && (
            <div className="flex items-center justify-center w-full h-full p-8">
              <img
                src={currentImage.url}
                alt={currentImage.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}

          {/* Botão próximo */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-10 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}