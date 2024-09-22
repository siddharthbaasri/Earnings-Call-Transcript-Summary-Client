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
        'bg-white p-4 flex justify-center',
        {
          'flex-grow flex-col items-center': isFirstUpload, 
          'sticky bottom-0 w-full': !isFirstUpload
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
        //let str = "**What is a U-pass?** \n\n A U-pass is a transportation pass that allows students to ride public transportation without needing to buy individual tickets or passes. This pass is typically offered by universities or colleges to their students as a way to make commuting easier and more affordable. The pass usually provides unlimited rides on buses, trains, or other public transportation systems within a specific area or region. [1]\n\nThe pass can be purchased as a semester-long or annual pass, and the cost is often included in tuition or can be added to student fees. Some U-pass programs also offer discounts or promotions for students who use the pass regularly. [2]\n\nOverall, the U-pass is a convenient and budget-friendly option for students who rely on public transportation to get to school or travel around the community.";
        //let str = "Here is the summarized report:\n\n\n**Financial Performance**\nThe Hershey Company has reported a strong start to 2024, with net sales growth of 8.9% in Q1. Adjusted Gross Margin was 44.9%, ahead of expectations.\n\n\n**Key Business Highlights**\n* The company has driven consumer engagement and improved market share performance across segments through investments in innovation, marketing, and in-store execution.\n* Category growth for Confection and Salty Snacks outperformed broader food and other snack category trends in Q1.\n* Seasons performed well, with Valentine's category growth up 6.5% and Hershey's double-digit growth during the Valentine's season resulting in strong share gains.\n\n**Strategic Initiatives**\n* The company plans to build on its momentum this summer with its first-ever Summer Seasonal Shape, commemorating its ongoing partnership with Team USA ahead of the Olympics.\n* Reece's Medals will be available for a limited time, in concert with a new campaign featuring Olympic Legends and Newcomers, and 360-degree activation across advertising, social media, and in-store displays.\n\n**FY Guidance**\n* The company expects full-year net sales growth of mid-single digits, in line with its long-term algorithm.\n* Adjusted gross margin outlook remains below prior year, with expected full-year declines of approximately 200 basis points.\n\n**Q&A Session**\n* Factors affecting cocoa market volatility and Hershey's response to mitigate its impact were discussed.\n* Expectations of continued high single-digit sales declines in the second quarter.\n* The company remains committed to long-term sustainability and has the strategies, portfolio, and teams to deliver leading performance over the long term.\n\n\n**Additional Key Points**\n\n* The company has successfully implemented a new ERP system, a major milestone towards achieving agility and efficiency targets.\n* The company remains committed to investing in its brands to drive long-term growth, as evidenced by its strong increase in advertising spend across all segments in Q1.\n* A replay of the webcast and corresponding transcript will be available on the Investor Relations section of the company's website."
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }

        try {
            const response = await fetch('https://pdf-summary-app-server-h3fpb7c0fmgpbefr.centralus-01.azurewebsites.net/upload', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            let responseText = await response.text()
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
        <div className = "flex flex-col min-h-screen">
            {!isFirstUpload && <div className="flex-grow overflow-auto pb-24">
                <div className = 'max-w-3xl mx-auto'>
                    {!loading ? <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm sm:prose">
                        {response}
                    </ReactMarkdown> :
                    <><Skeleton height={30} width={200} />
                    <Skeleton height={20} count={3} /></>}
                </div>
            </div>}
            



            <div className = {fileUploadClass}>
                <div className = "w-full max-w-xl flex flex-col items-center">
                    <label className="text-center text-[#009900] block text-sm font-large" htmlFor="file_input">
                        Upload an Earnings Call Transcript Here
                    </label>
                    <div className="w-full max-w-3xl flex justify-center">
                        <input
                            className="block w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            id="file_input"
                            type="file"
                            accept=".pdf" 
                            onChange = {updateFile}
                        />
                        <button className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        onClick={getSummary}>
                            Submit
                        </button>
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default FileUpload;  