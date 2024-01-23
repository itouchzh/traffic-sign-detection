/**
 * 转换时间
 */

export function formatTime(time: string) {
    const iso = new Date(time).toISOString()
    // 使用正则表达式进行匹配
    const matchResult = iso.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/)

    // 如果匹配成功，提取匹配的部分
    if (matchResult && matchResult.length > 1) {
        const extractedDateTime = matchResult[1].replace('T', ' ')
        return extractedDateTime
    } else {
        console.log('未匹配到日期时间部分')
        return null
    }
}
