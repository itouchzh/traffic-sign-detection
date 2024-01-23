export default function generateUniqueID() {
    return `error-${Date.now()}-${Math.floor(Math.random() * (9e12 - 1)) + 1e12}`
}
