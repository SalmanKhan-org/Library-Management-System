function calculateFine(borrowDate, dueDate) {
  const borrow = new Date(borrowDate);
  const due = new Date(dueDate);
  const today = new Date();

  // If book is returned before or on due date, no fine
  if (today <= due) return 0;

  // Calculate number of days between borrow date and today
  const diffTime = Math.abs(today - borrow);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // milliseconds to days

  const allowedDays = 15;
  const finePerDay = 10;

  if (diffDays <= allowedDays) return 0;

  const extraDays = diffDays - allowedDays;
  const fine = extraDays * finePerDay;

  return fine;
}

export default calculateFine;
