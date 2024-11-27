import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Import cropper.js CSS

const EditImage = ({ imageSrc, onSave, onCancel }: { imageSrc: string, onSave: (editedImage: string) => void, onCancel: () => void }) => {
  const cropperRef = useRef<any>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [imageData, setImageData] = useState<string | null>(null);

  const applyFilters = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCroppedCanvas();
      const img = canvas.toDataURL(); // Get the cropped image as base64
      setImageData(img);
    }
  };

  const handleBrightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(Number(e.target.value));
  };

  const handleContrastChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContrast(Number(e.target.value));
  };

  const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaturation(Number(e.target.value));
  };

  const handleSave = () => {
    if (imageData) {
      onSave(imageData); // Save the edited image
    }
  };

  const handleCancel = () => {
    onCancel(); // Reset changes and cancel
  };

  return (
    <div className="edit-image-container">
      <div className="cropper-container">
        <Cropper
          src={imageSrc}
          style={{ height: 400, width: '100%' }}
          initialAspectRatio={1}
          aspectRatio={1}
          guides={false}
          ref={cropperRef}
        />
      </div>

      <div className="controls-container">
        <div className="filter-controls">
          <label>
            Brightness:
            <input
              type="range"
              min="0"
              max="200"
              value={brightness}
              onChange={handleBrightnessChange}
            />
          </label>
          <label>
            Contrast:
            <input
              type="range"
              min="0"
              max="200"
              value={contrast}
              onChange={handleContrastChange}
            />
          </label>
          <label>
            Saturation:
            <input
              type="range"
              min="0"
              max="200"
              value={saturation}
              onChange={handleSaturationChange}
            />
          </label>
        </div>

        <div className="buttons-container">
          <button onClick={handleSave} className="save-button">
            Save
          </button>
          <button onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>

      <div className="preview-container">
        {imageData && (
          <div>
            <h4>Edited Image:</h4>
            <img src={imageData} alt="Edited Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'contain' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditImage;
