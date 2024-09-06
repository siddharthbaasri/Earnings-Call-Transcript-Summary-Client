"use client"; 

import React, { useState } from 'react';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


function FileUpload() {
    const [isFirstUpload, setIsFirstUpload] = useState(true);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const fileUploadClass = classNames (
        'flex flex-col items-center w-full',
        {
          'justify-center min-h-screen': isFirstUpload, // Center the content vertically and horizontally
          'justify-end h-screen pb-20': !isFirstUpload, // Align content to the bottom with some padding
        }
    );

    function getSummary() {
        if (!file) {
            alert('Please select a file first');
            return;
        }
        setIsFirstUpload(false);
        getResponse()
    }

    function updateFile(event: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = event.target.files != null ? event.target.files[0] : null;
        setFile(selectedFile);
        console.log("file updated")
    }

    async function getResponse() {
        setLoading(true);

        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }

        try {
            const response1 = await fetch("https://pdf-summary-app-server-h3fpb7c0fmgpbefr.centralus-01.azurewebsites.net");
            // const response = await fetch(process.env.NEXT_PUBLIC_API_URL + 'upload', {
            //     method: 'POST',
            //     body: formData,
            // });
            if (!response1.ok) {
                throw new Error('Network response was not ok ' + response1.statusText);
            }
            let responseText = await response1.text()
            setResponse(responseText)
        }
        catch (error) {
            console.error('There was a problem with the summary operation:', error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className = "">
            {!loading ? <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm sm:prose">
              {response}
            </ReactMarkdown> :
            <><Skeleton height={30} width={200} />
            <Skeleton height={20} count={3} /></>}
            <div className = {fileUploadClass}>
                <label className="block text-sm font-medium text-gray-900" htmlFor="file_input">
                    Upload an Earnings Call Transcript Here
                </label>
                <div className="flex space-x-4">
                    <input
                        className="block w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        id="file_input"
                        type="file"
                        accept=".pdf" 
                        onChange = {updateFile}
                    />
                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={getSummary}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FileUpload;  