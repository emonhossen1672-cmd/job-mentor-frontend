import axios from 'axios'

const BASE_URL = 'https://job-mentor.onrender.com/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jobMentorToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.message)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export const fetchMCQs = async () => {
  try {
    const res = await api.get('/mcqs/')
    return res.data
  } catch (err) {
    console.error('Failed to fetch MCQs:', err)
    throw err
  }
}

export const fetchTopics = async () => {
  try {
    const res = await api.get('/topics')
    return res.data
  } catch (err) {
    console.error('Failed to fetch topics:', err)
    throw err
  }
}

export const fetchSubtopics = async (topicId) => {
  try {
    const res = await api.get(`/topics/${topicId}/subtopics`)
    return res.data
  } catch (err) {
    console.error('Failed to fetch subtopics:', err)
    throw err
  }
}

export const fetchSubtopicMCQs = async (subtopicId) => {
  try {
    const res = await api.get(`/subtopics/${subtopicId}/mcqs`)
    return res.data
  } catch (err) {
    console.error('Failed to fetch subtopic MCQs:', err)
    throw err
  }
}
export const fetchWrittenQuestions = async () => {
  try {
    const res = await api.get('/written-questions')
    return res.data
  } catch (err) {
    console.error('Failed to fetch written questions:', err)
    throw err
  }
}

export const fetchExamPapers = async () => {
  try {
    const res = await api.get('/exam-papers')
    return res.data
  } catch (err) {
    console.error('Failed to fetch exam papers:', err)
    throw err
  }
}

export const fetchExamPapersByInstitution = async (institutionName) => {
  try {
    const res = await api.get(`/exam-papers/institution/${encodeURIComponent(institutionName)}`)
    return res.data
  } catch (err) {
    console.error('Failed to fetch institution papers:', err)
    throw err
  }
}
export const fetchSubmissions = async () => {
  try {
    const res = await api.get('/submissions')
    return res.data
  } catch (err) {
    console.error('Failed to fetch submissions:', err)
    throw err
  }
}

export const submitWrittenAnswer = async (payload) => {
  try {
    const res = await api.post('/submissions', payload)
    return res.data
  } catch (err) {
    console.error('Failed to submit answer:', err)
    throw err
  }
}

export default api
