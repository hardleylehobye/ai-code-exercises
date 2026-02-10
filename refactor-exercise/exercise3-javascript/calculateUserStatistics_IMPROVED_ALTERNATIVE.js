// ALTERNATIVE - Same behavior using reduce + Math.max (functional style).
// Good for teams comfortable with reduce; one-liner stats per field.

function calculateUserStatistics(userData) {
  if (!userData || userData.length === 0) {
    return emptyStats();
  }

  const n = userData.length;
  const avg = (field) => userData.reduce((sum, u) => sum + u[field], 0) / n;
  const max = (field) => Math.max(...userData.map((u) => u[field]));

  return {
    age: { average: avg('age'), highest: max('age') },
    income: { average: avg('income'), highest: max('income') },
    score: { average: avg('score'), highest: max('score') }
  };
}

function emptyStats() {
  return {
    age: { average: 0, highest: 0 },
    income: { average: 0, highest: 0 },
    score: { average: 0, highest: 0 }
  };
}
