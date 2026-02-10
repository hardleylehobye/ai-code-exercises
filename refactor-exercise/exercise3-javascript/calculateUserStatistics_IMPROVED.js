// IMPROVED - Exercise 3: Code Duplication Detection (JavaScript)
// Single pass with generic helpers; readable for junior devs.

function calculateUserStatistics(userData) {
  if (!userData || userData.length === 0) {
    return {
      age: { average: 0, highest: 0 },
      income: { average: 0, highest: 0 },
      score: { average: 0, highest: 0 }
    };
  }

  const age = statsForField(userData, 'age');
  const income = statsForField(userData, 'income');
  const score = statsForField(userData, 'score');

  return { age, income, score };
}

/**
 * Returns { average, highest } for the given numeric field across all users.
 */
function statsForField(userData, fieldName) {
  let sum = 0;
  let max = userData[0][fieldName];

  for (let i = 0; i < userData.length; i++) {
    const value = userData[i][fieldName];
    sum += value;
    if (value > max) max = value;
  }

  return {
    average: sum / userData.length,
    highest: max
  };
}
