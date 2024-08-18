export default function debounce<T extends any[]>(limit: number, callback: (...args: T) => void): (...args: T) => void {
    let timeoutId: NodeJS.Timeout | undefined;
    return (...args: T) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback(...args);
        }, limit);
    };
}
