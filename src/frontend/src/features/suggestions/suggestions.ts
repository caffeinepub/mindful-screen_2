const SUGGESTIONS = [
  'Talk with a friend or family member',
  'Read a book or article',
  'Take a walk outside',
  'Practice deep breathing or meditation',
  'Stretch or do light exercise',
  'Write in a journal',
  'Listen to calming music',
  'Drink a glass of water',
  'Organize your workspace',
  'Practice gratitude - list three things you are thankful for',
  'Do a creative activity like drawing or crafting',
  'Prepare a healthy snack'
];

export function getRandomSuggestion(exclude?: string): string {
  const available = exclude ? SUGGESTIONS.filter((s) => s !== exclude) : SUGGESTIONS;
  return available[Math.floor(Math.random() * available.length)];
}
