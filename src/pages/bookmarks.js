const STORAGE_KEY = 'jobMentorWrongQuestions'

export function getBookmarkedQuestions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addBookmarkedQuestion(question) {
  try {
    const existing = getBookmarkedQuestions()
    if (existing.some((q) => q.id === question.id)) return
    const updated = [...existing, { ...question, savedAt: Date.now() }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save bookmark:', err)
  }
}

export function removeBookmarkedQuestion(id) {
  try {
    const existing = getBookmarkedQuestions()
    const updated = existing.filter((q) => q.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to remove bookmark:', err)
  }
}

export function clearBookmarkedQuestions() {
  localStorage.removeItem(STORAGE_KEY)
}
