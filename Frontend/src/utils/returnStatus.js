export default function getBookStatus(dueDateStr, currentDateStr = new Date().toISOString()) {
  const dueDate = new Date(dueDateStr);
  const currentDate = new Date(currentDateStr);

  // Calculate time difference in days
  const diffInMs = dueDate - currentDate;
  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays < 0) {
    return 'Overdue';
  } else if (diffInDays <= 2) {
    return 'Due_Soon';
  } else {
    return 'Borrowed';
  }
}
