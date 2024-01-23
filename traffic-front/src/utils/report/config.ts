type Config = {
    url: string
    [key: string]: any
}

const config: Config = {
    url: '',
}

export default config

export function setConfig(value: string): void {
    config.url = value
}
