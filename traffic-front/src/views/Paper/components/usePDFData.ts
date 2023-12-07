import * as pdf from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.js'
import { useEffect, useRef, useState } from "react";

pdf.GlobalWorkerOptions.workerSrc = pdfWorker;

export const usePDFData = (options: { src: string, scale?: number }) => {
    const previewUrls = useRef<string[]>([])
    const urls = useRef<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        urls.current = []
        setLoading(true)
            ; (async () => {
                // 这里千万别解构，会导致 this 指向错误
                const pdfDocument = await pdf.getDocument(options.src).promise
                const task = new Array(pdfDocument.numPages).fill(null)
                await Promise.all(task.map(async (_, i) => {
                    const page = await pdfDocument.getPage(i + 1)
                    const viewport = page.getViewport({ scale: options.scale || 2 })
                    const canvas = document.createElement('canvas')

                    canvas.width = viewport.width
                    canvas.height = viewport.height
                    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
                    const renderTask = page.render({
                        canvasContext: ctx,
                        viewport,
                    });
                    await renderTask.promise;
                    // 分别获取不同尺寸的图片，一个用来预览一个用来展示
                    urls.current[i] = canvas.toDataURL('image/jpeg', 1)
                    previewUrls.current[i] = canvas.toDataURL('image/jpeg', 0.5)
                }))
                setLoading(false)
            })()
    }, [options.src])

    return {
        loading,
        urls: urls.current,
        previewUrls: previewUrls.current,
    }
}