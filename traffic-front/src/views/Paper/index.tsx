import React, { useEffect, useState } from 'react'
import PaperModel from './components/PaperModel'
import PaperList from './components/PaperList'
import { PDFRender } from './components/PDFRender'
import { getPaper } from '@/utils/paper'

const Paper = () => {
    const pdfFilePath = require('../../assets/pdf/paper1.pdf')
    const [pdfUrl, setPdfUrl] = useState<string>('')
    useEffect(() => {
        const fetchPdf = async () => {
            try {
                const response = await getPaper(1)
                console.log(response)

                const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
                const pdfUrl = URL.createObjectURL(pdfBlob)
                console.log(typeof pdfUrl)

                setPdfUrl(pdfUrl)
                console.log(pdfUrl)
            } catch (error) {
                console.error('Error fetching PDF:', error)
            }
        }

        fetchPdf()
    }, [])
    return (
        <div>
            <PaperList></PaperList>
            <PaperModel></PaperModel>
            {/* <PDFRender src={pdfFilePath} /> */}
            {/* <embed className=" w-full h-screen" src={pdfFilePath} type="application/pdf"></embed> */}
            <div>
                {pdfUrl && (
                    <embed
                        className="w-full"
                        src={pdfUrl}
                        width="100%"
                        height="500px"
                        title="PDF Viewer"
                    />
                )}
            </div>
        </div>
    )
}

export default Paper
