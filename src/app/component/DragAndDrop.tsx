import { useState } from 'react';

interface DragAndDropProps {
  onDrop: (files: FileList) => void;
  onBrowse: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  acceptedFileTypes: string;
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onDrop, onBrowse, label, acceptedFileTypes }) => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onDrop(files);
    }
  };

  return (
    <div
      className={`border-2 border-dashed ${dragging ? 'border-blue-500' : 'border-gray-400'} p-4 rounded-md`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="block text-lg font-medium text-gray-700 mb-2">{label}</label>
      <div className="text-center">
        <p className="text-sm text-gray-600">Drag and drop files here or</p>
        <input
          type="file"
          accept={acceptedFileTypes}
          multiple
          onChange={onBrowse}
          className="mt-2 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default DragAndDrop;
