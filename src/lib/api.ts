// HangingPanda Client-Safe API Client
// For use in React Client Components ('use client')

export const nextApi = {
  // Client-Side Inquiries submission with user-friendly error normalization
  async submitInquiry(data: any) {
    try {
      const res = await fetch('/api/v1/public/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.message || 'Unable to submit your inquiry at this moment. Please try again.');
      }
      return json;
    } catch (err: any) {
      if (err.name === 'AbortError' || err.message?.includes('timeout') || err.message?.includes('signal')) {
        throw new Error('Request timed out. Please check your internet connection and try again.');
      }
      if (err.message === 'Failed to fetch' || err.message?.includes('NetworkError')) {
        throw new Error('Network error: unable to reach the server. Please check your connection.');
      }
      throw err;
    }
  }
};
