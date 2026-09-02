// js/core/courseSdk.js - Modular Course SDK & Progress Manager

const STORAGE_KEY_COMPLETED = "learn_py_completed_topics";
const STORAGE_KEY_TOPIC_CODE_PREFIX = "learn_py_code_topic_";
const STORAGE_KEY_LAST_TOPIC = "learn_py_last_topic";

export class CourseSdk {
  constructor(topics = []) {
    this.topics = Array.isArray(topics) ? topics : [];
  }

  setTopics(topics) {
    if (Array.isArray(topics)) {
      this.topics = topics;
    }
  }

  getTopics() {
    if (this.topics.length === 0 && typeof window !== 'undefined' && Array.isArray(window.TOPICS)) {
      this.topics = window.TOPICS;
    }
    return this.topics;
  }

  getTopicById(id) {
    const all = this.getTopics();
    return all.find((t) => t.id === id) || null;
  }

  searchTopics(query = '') {
    const q = String(query).trim().toLowerCase();
    const all = this.getTopics();
    if (!q) return all;

    return all.filter((topic) => {
      const matchTitle = topic.title && topic.title.toLowerCase().includes(q);
      const matchCategory = topic.category && topic.category.toLowerCase().includes(q);
      const matchSummary = Array.isArray(topic.summary) && topic.summary.some((s) => s.toLowerCase().includes(q));
      return matchTitle || matchCategory || matchSummary;
    });
  }

  getCompletedTopicIds() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COMPLETED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  isTopicCompleted(id) {
    return this.getCompletedTopicIds().includes(id);
  }

  toggleTopicCompleted(id) {
    const completed = this.getCompletedTopicIds();
    const index = completed.indexOf(id);
    let isNowCompleted = false;

    if (index >= 0) {
      completed.splice(index, 1);
      isNowCompleted = false;
    } else {
      completed.push(id);
      isNowCompleted = true;
    }

    try {
      localStorage.setItem(STORAGE_KEY_COMPLETED, JSON.stringify(completed));
    } catch (e) {
      console.warn('Failed to save progress to localStorage:', e);
    }

    return isNowCompleted;
  }

  getProgress() {
    const all = this.getTopics();
    const total = all.length;
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };

    const completedIds = this.getCompletedTopicIds();
    const completedCount = all.filter((t) => completedIds.includes(t.id)).length;
    const percentage = Math.round((completedCount / total) * 100);

    return {
      completed: completedCount,
      total,
      percentage
    };
  }

  getSavedTopicCode(id) {
    try {
      return localStorage.getItem(STORAGE_KEY_TOPIC_CODE_PREFIX + id) || null;
    } catch {
      return null;
    }
  }

  saveTopicCode(id, code) {
    try {
      localStorage.setItem(STORAGE_KEY_TOPIC_CODE_PREFIX + id, code);
    } catch (e) {
      console.warn('Failed to save topic code:', e);
    }
  }

  clearSavedTopicCode(id) {
    try {
      localStorage.removeItem(STORAGE_KEY_TOPIC_CODE_PREFIX + id);
    } catch (e) {
      console.warn('Failed to clear saved topic code:', e);
    }
  }

  getLastActiveTopicId() {
    try {
      return localStorage.getItem(STORAGE_KEY_LAST_TOPIC);
    } catch {
      return null;
    }
  }

  setLastActiveTopicId(id) {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_TOPIC, id);
    } catch (e) {
      console.warn('Failed to set last active topic:', e);
    }
  }
}

export const courseSdk = new CourseSdk();
if (typeof window !== 'undefined') {
  window.courseSdk = courseSdk;
}
