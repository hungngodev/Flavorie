export default function parseDate(createdDate: string | undefined, updatedDate?: string | undefined) {
  if (!createdDate) return new Date().toDateString();
  let date = new Date(createdDate);
  if (updatedDate) {
    const compareDate = new Date(updatedDate);
    if (compareDate > date) {
      date = compareDate;
    }
  }
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
    case diff < 1000 * 60 * 60 * 24 * 7 * 4:
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))}months ago`;
    default:
      return date.toDateString();
  }
}
