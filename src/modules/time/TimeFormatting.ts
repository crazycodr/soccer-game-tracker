export default function formatTimeFromSeconds(totalSeconds: number): string {
    const seconds = Math.floor(totalSeconds % 60).toFixed(0).toString().padStart(2, '0')
    const minutes = Math.floor(totalSeconds / 60).toFixed(0).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}