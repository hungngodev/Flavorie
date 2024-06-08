export default function parseDate(date: Date) {
  const diff = Date.now() - date.getTime();
  switch (true) {
    case diff < 1000 * 60:
      return 'Just now';
    case diff < 1000 * 60 * 60:
      return `${Math.floor(diff / (1000 * 60))}m ago`;
    case diff < 1000 * 60 * 60 * 24:
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    case diff < 1000 * 60 * 60 * 24 * 7:
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
    default:
      return date.toDateString();
  }
}
