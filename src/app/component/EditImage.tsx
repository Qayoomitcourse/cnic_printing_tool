'use client';

import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import ReactCropper from "react-cropper"; // Import ReactCropper
import "cropperjs/dist/cropper.css"; // CropperJS styles
import Cropper from "cropperjs"; // Import CropperJS class from cropperjs library

interface EditImageProps {
  imageSrc: string;
  onSave: (editedImage: string) => void;
  onCancel: () => void;
}

// Use forwardRef to expose methods to the parent
const EditImage = forwardRef(({ imageSrc, onSave, onCancel }: EditImageProps, ref) => {
  const [filter, setFilter] = useState<string>("none");

  // Create a ref for the ReactCropper component
  const cropperRef = useRef<HTMLImageElement | null>(null); // This ref will be linked to the image element

  // Initialize the Cropper instance using useImperativeHandle
  useImperativeHandle(ref, () => ({
    getCroppedCanvas: () => {
      if (cropperRef.current) {
        const cropperInstance = (cropperRef.current as any).cropper as Cropper;
        return cropperInstance.getCroppedCanvas();
      }
      return null;
    }
  }));

  const applyFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value);
  };

  const handleSave = () => {
    if (cropperRef.current) {
      const croppedCanvas = (cropperRef.current as any).cropper.getCroppedCanvas(); // Get the cropped image as a canvas
      if (croppedCanvas) {
        const croppedImage = croppedCanvas.toDataURL(); // Convert canvas to base64 string
        onSave(croppedImage); // Pass the cropped image to the parent
      }
    }
  };

  return (
    <div className="edit-image-container">
      <h2 className="text-xl font-semibold mb-4">Edit Image</h2>
      <div className="image-edit-area mb-4">
        <ReactCropper
          ref={cropperRef} // Use ref directly with ReactCropper component
          src={imageSrc}
          style={{ height: "400px", width: "100%" }}
          aspectRatio={1} // Maintain square aspect ratio for cropping
          autoCropArea={1}
          guides={false}
          minCropBoxWidth={100}
          minCropBoxHeight={100}
          background={true}
        />
      </div>
      <div className="filters mb-4">
        <label htmlFor="filter" className="mr-2">Select Filter:</label>
        <select id="filter" value={filter} onChange={applyFilter}>
          <option value="none">None</option>
          <option value="grayscale(100%)">Grayscale</option>
          <option value="sepia(100%)">Sepia</option>
          <option value="invert(100%)">Invert</option>
        </select>
      </div>
      <div className="actions flex justify-between">
        <button
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Save
        </button>
      </div>
    </div>
  );
});

EditImage.displayName = "EditImage";

export default EditImage;
