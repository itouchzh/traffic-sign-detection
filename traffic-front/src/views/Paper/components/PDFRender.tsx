import React, { useEffect, useMemo, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { usePDFData } from './usePDFData'
import { Page } from './Page'

const Box = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Sidebar = styled.div`
    position: fixed;
    height: 100vh;
    box-sizing: border-box;
    padding: 40px 0 20px;
    background: rgb(34, 38, 45);
    overflow-y: auto;
    left: 0;
    top: 0;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`

const Preview = styled.div`
    width: 50vw;
    padding-left: 300px;
`

const Image = styled.img`
    margin-top: 20px;
    width: 100px;
    border: 6px solid transparent;
    cursor: pointer;

    &.active {
        border-color: rgb(121, 162, 246);
    }
`

const PageNumber = styled.span`
    background: transparent;
    font-size: 14px;
    margin-top: 4px;
    color: #fff;
`

export const PDFRender: React.FC<{ src: string }> = (props) => {
    const { loading, urls, previewUrls } = usePDFData({
        src: props.src,
    })
    const [currentPage, setCurrentPage] = useState(0)
    const io = useRef(
        new IntersectionObserver(
            (entries) => {
                entries.forEach((item) => {
                    item.intersectionRatio >= 0.5 &&
                        setCurrentPage(Number(item.target.getAttribute('index')))
                })
            },
            {
                threshold: [0.5],
            }
        )
    )
    const goPage = (i: number) => {
        setCurrentPage(i)
        document.querySelectorAll('.page')[i]!.scrollIntoView({ behavior: 'smooth' })
    }
    if (loading) {
        return <div>loading...</div>
    }
    return (
        <Box>
            <Sidebar>
                {previewUrls.map((item, i) => (
                    <React.Fragment key={item}>
                        <Image
                            src={item}
                            className={currentPage === i ? 'active' : ''}
                            onClick={() => goPage(i)}
                        />
                        <PageNumber>{i + 1}</PageNumber>
                    </React.Fragment>
                ))}
            </Sidebar>
            <Preview>
                {urls.map((item, i) => (
                    <Page index={i} io={io.current} src={item} key={item} />
                ))}
            </Preview>
        </Box>
    )
}
