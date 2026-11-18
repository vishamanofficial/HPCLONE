// HangingPanda API Client Service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('hp_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Generic Request Helper
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getAuthHeaders(),
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (error: any) {
      console.warn(`[API] Error on ${endpoint}:`, error.message);
      throw error;
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  async login(credentials: { email: string; password: string }) {
    return this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async getMe() {
    return this.request<{ success: boolean; user: any }>('/auth/me');
  }

  async updateProfile(profileData: any) {
    return this.request<{ success: boolean; user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // ==========================================
  // PUBLIC APIS
  // ==========================================
  async getPublicSettings() {
    return this.request<{ success: boolean; settings: any }>('/public/settings');
  }

  async getPublicHomepage() {
    return this.request<{
      success: boolean;
      page: any;
      sections: any[];
      dynamicData: {
        services: any[];
        portfolio: any[];
        testimonials: any[];
        faqs: any[];
      };
    }>('/public/homepage');
  }

  async getPublicPage(slug: string) {
    return this.request<{ success: boolean; page: any }>(`/public/pages/${slug}`);
  }

  async getPublicServices() {
    return this.request<{ success: boolean; services: any[] }>('/public/services');
  }

  async getPublicServiceBySlug(slug: string) {
    return this.request<{ success: boolean; service: any }>(`/public/services/${slug}`);
  }

  async getPublicBlogs(params?: { category?: string; tag?: string; search?: string; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; blogs: any[]; pagination: any }>(`/public/blogs${query ? `?${query}` : ''}`);
  }

  async getPublicBlogBySlug(slug: string) {
    return this.request<{ success: boolean; blog: any; related: any[] }>(`/public/blogs/${slug}`);
  }

  async getPublicPortfolio() {
    return this.request<{ success: boolean; portfolio: any[] }>('/public/portfolio');
  }

  async getPublicPortfolioBySlug(slug: string) {
    return this.request<{ success: boolean; portfolioItem: any }>(`/public/portfolio/${slug}`);
  }

  async getPublicTestimonials() {
    return this.request<{ success: boolean; testimonials: any[] }>('/public/testimonials');
  }

  async getPublicTeam() {
    return this.request<{ success: boolean; team: any[] }>('/public/team');
  }

  async getPublicFAQs(category?: string) {
    return this.request<{ success: boolean; faqs: any[] }>(`/public/faqs${category ? `?category=${category}` : ''}`);
  }

  async getPublicJobs() {
    return this.request<{ success: boolean; jobs: any[] }>('/public/jobs');
  }

  async getPublicNavigation() {
    return this.request<{ success: boolean; menus: Record<string, any[]> }>('/public/navigation');
  }

  async submitInquiry(data: any) {
    return this.request<{ success: boolean; message: string; leadId: string }>('/public/inquiries', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getPreviewData(token: string) {
    return this.request<{ success: boolean; previewType: string; data: any }>(`/public/preview/${token}`);
  }

  // ==========================================
  // ADMIN CMS APIS
  // ==========================================
  async getDashboardStats() {
    return this.request<{ success: boolean; stats: any }>('/admin/dashboard/stats');
  }

  async getAdminSettings() {
    return this.request<{ success: boolean; settings: any }>('/admin/settings');
  }

  async updateAdminSettings(settings: any) {
    return this.request<{ success: boolean; settings: any; message: string }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // Pages & Builder
  async getAdminPages() {
    return this.request<{ success: boolean; pages: any[] }>('/admin/pages');
  }

  async getAdminPage(id: string) {
    return this.request<{ success: boolean; page: any }>(`/admin/pages/${id}`);
  }

  async createAdminPage(pageData: any) {
    return this.request<{ success: boolean; page: any; message: string }>('/admin/pages', {
      method: 'POST',
      body: JSON.stringify(pageData)
    });
  }

  async updateAdminPage(id: string, pageData: any) {
    return this.request<{ success: boolean; page: any; message: string }>(`/admin/pages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pageData)
    });
  }

  async deleteAdminPage(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/pages/${id}`, {
      method: 'DELETE'
    });
  }

  async publishAdminPage(id: string) {
    return this.request<{ success: boolean; page: any; message: string }>(`/admin/pages/${id}/publish`, {
      method: 'POST'
    });
  }

  async unpublishAdminPage(id: string) {
    return this.request<{ success: boolean; page: any; message: string }>(`/admin/pages/${id}/unpublish`, {
      method: 'POST'
    });
  }

  async getPageRevisions(id: string) {
    return this.request<{ success: boolean; revisions: any[] }>(`/admin/pages/${id}/revisions`);
  }

  async restorePageRevision(id: string, revId: string) {
    return this.request<{ success: boolean; page: any; message: string }>(`/admin/pages/${id}/revisions/${revId}/restore`, {
      method: 'POST'
    });
  }

  async generatePreviewToken(type: string, id: string) {
    return this.request<{ success: boolean; previewToken: string; previewUrl: string }>('/admin/pages/preview-token', {
      method: 'POST',
      body: JSON.stringify({ type, id })
    });
  }

  // Services
  async getAdminServices() {
    return this.request<{ success: boolean; services: any[] }>('/admin/services');
  }

  async getAdminService(id: string) {
    return this.request<{ success: boolean; service: any }>(`/admin/services/${id}`);
  }

  async createAdminService(serviceData: any) {
    return this.request<{ success: boolean; service: any; message: string }>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async updateAdminService(id: string, serviceData: any) {
    return this.request<{ success: boolean; service: any; message: string }>(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    });
  }

  async deleteAdminService(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/services/${id}`, {
      method: 'DELETE'
    });
  }

  // Blogs
  async getAdminBlogs() {
    return this.request<{ success: boolean; blogs: any[] }>('/admin/blogs');
  }

  async getAdminBlog(id: string) {
    return this.request<{ success: boolean; blog: any }>(`/admin/blogs/${id}`);
  }

  async createAdminBlog(blogData: any) {
    return this.request<{ success: boolean; blog: any; message: string }>('/admin/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData)
    });
  }

  async updateAdminBlog(id: string, blogData: any) {
    return this.request<{ success: boolean; blog: any; message: string }>(`/admin/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData)
    });
  }

  async deleteAdminBlog(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/blogs/${id}`, {
      method: 'DELETE'
    });
  }

  // Portfolio
  async getAdminPortfolio() {
    return this.request<{ success: boolean; portfolio: any[] }>('/admin/portfolio');
  }

  async createAdminPortfolio(itemData: any) {
    return this.request<{ success: boolean; portfolio: any; message: string }>('/admin/portfolio', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async updateAdminPortfolio(id: string, itemData: any) {
    return this.request<{ success: boolean; portfolio: any; message: string }>(`/admin/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  }

  async deleteAdminPortfolio(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/portfolio/${id}`, {
      method: 'DELETE'
    });
  }

  // Testimonials
  async getAdminTestimonials() {
    return this.request<{ success: boolean; testimonials: any[] }>('/admin/testimonials');
  }

  async createAdminTestimonial(data: any) {
    return this.request<{ success: boolean; testimonial: any; message: string }>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateAdminTestimonial(id: string, data: any) {
    return this.request<{ success: boolean; testimonial: any; message: string }>(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteAdminTestimonial(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/testimonials/${id}`, {
      method: 'DELETE'
    });
  }

  // Team
  async getAdminTeam() {
    return this.request<{ success: boolean; team: any[] }>('/admin/team');
  }

  async createAdminTeam(data: any) {
    return this.request<{ success: boolean; member: any; message: string }>('/admin/team', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateAdminTeam(id: string, data: any) {
    return this.request<{ success: boolean; member: any; message: string }>(`/admin/team/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteAdminTeam(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/team/${id}`, {
      method: 'DELETE'
    });
  }

  // FAQs
  async getAdminFAQs() {
    return this.request<{ success: boolean; faqs: any[] }>('/admin/faqs');
  }

  async createAdminFAQ(data: any) {
    return this.request<{ success: boolean; faq: any; message: string }>('/admin/faqs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateAdminFAQ(id: string, data: any) {
    return this.request<{ success: boolean; faq: any; message: string }>(`/admin/faqs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteAdminFAQ(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/faqs/${id}`, {
      method: 'DELETE'
    });
  }

  // Navigation Menus
  async getAdminNavigation() {
    return this.request<{ success: boolean; menus: any[] }>('/admin/navigation');
  }

  async updateAdminNavigation(data: { location: string; items: any[]; title?: string }) {
    return this.request<{ success: boolean; menu: any; message: string }>('/admin/navigation', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Mini CRM & Leads
  async getCrmDashboard() {
    return this.request<{ success: boolean; crmMetrics: any }>('/admin/crm/dashboard');
  }

  async getAdminLeads(params?: { status?: string; source?: string; priority?: string; search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; leads: any[]; pagination: any }>(`/admin/crm/leads${query ? `?${query}` : ''}`);
  }

  async getAdminLead(id: string) {
    return this.request<{ success: boolean; lead: any }>(`/admin/crm/leads/${id}`);
  }

  async updateLeadStatus(id: string, status: string) {
    return this.request<{ success: boolean; lead: any; message: string }>(`/admin/crm/leads/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async updateLead(id: string, leadData: any) {
    return this.request<{ success: boolean; lead: any; message: string }>(`/admin/crm/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData)
    });
  }

  async addLeadNote(id: string, text: string) {
    return this.request<{ success: boolean; lead: any; message: string }>(`/admin/crm/leads/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  async deleteAdminLead(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/crm/leads/${id}`, {
      method: 'DELETE'
    });
  }

  getLeadExportUrl() {
    return `${API_BASE_URL}/admin/crm/export`;
  }

  // SEO Suite
  async getAdminSeoSettings() {
    return this.request<{ success: boolean; seoSettings: any }>('/admin/seo/settings');
  }

  async updateAdminSeoSettings(data: any) {
    return this.request<{ success: boolean; seoSettings: any; message: string }>('/admin/seo/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async runSeoAudit() {
    return this.request<{ success: boolean; audit: any }>('/admin/seo/audit');
  }

  async getAdminRedirects() {
    return this.request<{ success: boolean; redirects: any[] }>('/admin/seo/redirects');
  }

  async createAdminRedirect(data: any) {
    return this.request<{ success: boolean; redirect: any; message: string }>('/admin/seo/redirects', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async deleteAdminRedirect(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/seo/redirects/${id}`, {
      method: 'DELETE'
    });
  }

  // Media Library
  async getAdminMedia(params?: { folder?: string; search?: string; page?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; media: any[]; pagination: any }>(`/admin/media${query ? `?${query}` : ''}`);
  }

  async uploadMedia(formData: FormData) {
    const token = localStorage.getItem('hp_admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Media upload failed');
    return data;
  }

  async updateMedia(id: string, metadata: { altText?: string; caption?: string; folder?: string }) {
    return this.request<{ success: boolean; media: any; message: string }>(`/admin/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(metadata)
    });
  }

  async deleteMedia(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/media/${id}`, {
      method: 'DELETE'
    });
  }

  // Users & Audit Logs
  async getAdminUsers() {
    return this.request<{ success: boolean; users: any[] }>('/admin/users');
  }

  async getAdminRoles() {
    return this.request<{ success: boolean; roles: any[] }>('/admin/roles');
  }

  async createAdminUser(userData: any) {
    return this.request<{ success: boolean; user: any; message: string }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateAdminUser(id: string, userData: any) {
    return this.request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteAdminUser(id: string) {
    return this.request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  async getAuditLogs(params?: { resource?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ success: boolean; logs: any[]; pagination: any }>(`/admin/audit-logs${query ? `?${query}` : ''}`);
  }
}

export const api = new ApiService();
export default api;
