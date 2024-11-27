'use client';
import { useState, ChangeEvent } from "react";
import Image from "next/image";
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700">
          CNIC Printing Tool
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Easily upload, preview, and print CNIC images.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <h2 className="font-bold text-xl text-yellow-700">
            Tips for Uploading and Printing
          </h2>
          <ul className="list-disc list-inside text-yellow-800 mt-2 space-y-1">
            <li>Crop images properly for accurate printing.</li>
            <li>Use high-resolution images for better quality.</li>
            <li>Ensure images match CNIC size and aspect ratio.</li>
            <li>Double-check the number of copies before printing.</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <DragAndDrop
            onDrop={(files) => handleDrop(files, setFrontImages)}
            onBrowse={(e) => handleUpload(e, setFrontImages)}
            label="Upload Front CNIC:"
            acceptedFileTypes="image/*"
          />
          <DragAndDrop
            onDrop={(files) => handleDrop(files, setBackImages)}
            onBrowse={(e) => handleUpload(e, setBackImages)}
            label="Upload Back CNIC:"
            acceptedFileTypes="image/*"
          />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label
            htmlFor="num-copies"
            className="block text-sm font-semibold text-gray-700"
          >
            Number of Copies:
          </label>
          <input
            type="number"
            id="num-copies"
            value={numCopies}
            onChange={(e) => setNumCopies(Math.max(1, Number(e.target.value)))}
            min="1"
            className="w-20 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right mb-8">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg shadow-md transition duration-300"
          >
            Print Preview
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Preview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Front Sides
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {frontImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md"
                  >
                    <Image
                      src={img}
                      alt={`Front ${index}`}
                      className="object-cover"
                      width={200}
                      height={150}
                      unoptimized
                    />
                    <button
                      onClick={() => handleRemoveImage(index, setFrontImages)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Back Sides
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {backImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md"
                  >
                    <Image
                      src={img}
                      alt={`Back ${index}`}
                      className="object-cover"
                      width={200}
                      height={150}
                      unoptimized
                    />
                    <button
                      onClick={() => handleRemoveImage(index, setBackImages)}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="printable" className="hidden print:block mt-8">
          {frontPages.map((page, pageIndex) => (
            <div
              key={`front-page-${pageIndex}`}
              className="w-[210mm] h-[297mm] mx-auto grid grid-cols-2 grid-rows-4 gap-4"
            >
              {page.map((img, idx) => (
                <div
                  key={`front-${pageIndex}-${idx}`}
                  className="w-[98mm] h-[72mm] flex justify-center items-center"
                >
                  {img && (
                    <Image
                      src={img}
                      alt="Front Side"
                      className="w-full h-full object-contain"
                      width={200}
                      height={150}
                      unoptimized
                    />
                  )}
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
                <div
                  key={`back-${pageIndex}-${idx}`}
                  className="w-[98mm] h-[72mm] flex justify-center items-center"
                >
                  {img && (
                    <Image
                      src={img}
                      alt="Back Side"
                      className="w-full h-full object-contain"
                      width={200}
                      height={150}
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <footer className="text-center mt-10 text-gray-600">
        <p>
          © {new Date().getFullYear()} CNIC Printing Tool. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CNICPrint;
