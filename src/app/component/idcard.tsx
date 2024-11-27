'use client'
import { useState, ChangeEvent } from "react";
import DragAndDrop from "./DragAndDrop"; // Import the DragAndDrop component

const CNICPrint = () => {
  const [frontImages, setFrontImages] = useState<string[]>([]);
  const [backImages, setBackImages] = useState<string[]>([]);
  const [numCopies, setNumCopies] = useState<number>(1);

  const handleUpload = (
    event: ChangeEvent<HTMLInputElement>,
    setImages: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleDrop = (
    files: FileList,
    setImages: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (
    index: number,
    setImages: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePrintPages = (images: string[], isBack: boolean) => {
    const repeatedImages = Array(numCopies)
      .fill(images)
      .flat();

    const pages: string[][] = [];
    let currentPage: string[] = [];

    repeatedImages.forEach((img, index) => {
      currentPage.push(img);
      if ((index + 1) % 8 === 0) {
        pages.push(currentPage);
        currentPage = [];
      }
    });

    if (currentPage.length > 0) {
      while (currentPage.length < 8) {
        currentPage.push("");
      }
      pages.push(currentPage);
    }

    return isBack
      ? pages.map((page) => {
          const reorderedPage = [];
          for (let i = 0; i < page.length; i += 2) {
            if (i + 1 < page.length) {
              reorderedPage.push(page[i + 1]);
            }
            reorderedPage.push(page[i]);
          }
          return reorderedPage;
        })
      : pages;
  };

  const frontPages = generatePrintPages(frontImages, false);
  const backPages = generatePrintPages(backImages, true);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">CNIC Printing Tool</h1>
        <p className="text-gray-600 mt-2">
          Upload CNIC images and print with ease.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
        <h2 className="font-bold text-lg">Tips for Uploading and Printing</h2>
        <ul className="list-disc list-inside">
          <li>Ensure that the images are cropped properly for accurate printing.</li>
          <li>Use high-resolution images for better print quality.</li>
          <li>Uploaded images should match the size and aspect ratio of CNICs.</li>
          <li>Double-check the number of copies before printing to avoid errors.</li>
        </ul>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* Front CNIC Upload using Drag and Drop */}
          <DragAndDrop
            onDrop={(files) => handleDrop(files, setFrontImages)}
            onBrowse={(e) => handleUpload(e, setFrontImages)}
            label="Front CNIC Upload:"
            acceptedFileTypes="image/*"
          />

          {/* Back CNIC Upload using Drag and Drop */}
          <DragAndDrop
            onDrop={(files) => handleDrop(files, setBackImages)}
            onBrowse={(e) => handleUpload(e, setBackImages)}
            label="Back CNIC Upload:"
            acceptedFileTypes="image/*"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="num-copies" className="block text-sm font-semibold">
            Number of Copies:
          </label>
          <input
            type="number"
            id="num-copies"
            value={numCopies}
            onChange={(e) => setNumCopies(Number(e.target.value))}
            min="1"
            className="w-50 p-2 border rounded-md"
          />
          <div className="flex justify-end space-x-4 mb-8">
          <button onClick={handlePrint} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Print Preview
          </button>
        </div>
        </div>

        
{/* Preview */}
<div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Preview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Front Sides</h3>
              <div className="grid grid-cols-2 gap-4">
                {frontImages.map((img, index) => (
                  <div key={index} className="relative border p-2">
                    <img src={img} alt={`Front ${index}`} className="w-full h-auto object-contain" />
                    <button
                      onClick={() => handleRemoveImage(index, setFrontImages)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Back Sides</h3>
              <div className="grid grid-cols-2 gap-4">
                {backImages.map((img, index) => (
                  <div key={index} className="relative border p-2">
                    <img src={img} alt={`Back ${index}`} className="w-full h-auto object-contain" />
                    <button
                      onClick={() => handleRemoveImage(index, setBackImages)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
          {/* Display Front CNIC images */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-2">Front CNIC Images:</h3>
            {frontImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Front CNIC ${index}`}
                  className="w-full h-auto rounded-lg mb-2"
                />
                <button
                  onClick={() => handleRemoveImage(index, setFrontImages)}
                  className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div> */}

          {/* Display Back CNIC images */}
          {/* <div>
            <h3 className="font-semibold text-lg mb-2">Back CNIC Images:</h3>
            {backImages.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img}
                  alt={`Back CNIC ${index}`}
                  className="w-full h-auto rounded-lg mb-2"
                />
                <button
                  onClick={() => handleRemoveImage(index, setBackImages)}
                  className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-2 py-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          
          </div> */}
          {/* Printable Area */}
        <div id="printable" className="hidden print:block">
          {frontPages.map((page, pageIndex) => (
            <div
              key={`front-page-${pageIndex}`}
              className="w-[210mm] h-[297mm] mx-auto grid grid-cols-2 grid-rows-4 gap-4"
            >
              {page.map((img, idx) => (
                <div key={`front-${pageIndex}-${idx}`} className="w-[98mm] h-[72mm] flex justify-center items-center">
                  {img && <img src={img} alt="Front Side" className="w-full h-full object-contain" />}
                </div>
              ))}
            </div>
          ))}
          {backPages.map((page, pageIndex) => (
            <div
              key={`back-page-${pageIndex}`}
              className="w-[210mm] h-[297mm] mx-auto grid grid-cols-2 grid-rows-4 gap-4"
            >
              {page.map((img, idx) => (
                <div key={`back-${pageIndex}-${idx}`} className="w-[98mm] h-[72mm] flex justify-center items-center">
                  {img && <img src={img} alt="Back Side" className="w-full h-full object-contain" />}
                </div>
              ))}
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CNICPrint;
