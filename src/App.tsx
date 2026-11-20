import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Skeleton from "./components/ui/Skeleton";
import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import { ToastProvider } from "./admin/components/Toast";

// Public Pages
const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const PandaNextAI = React.lazy(() => import("./pages/PandaNextAI"));
const ServiceDetail = React.lazy(() => import("./pages/ServiceDetail"));
const CaseStudies = React.lazy(() => import("./pages/CaseStudies"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Career = React.lazy(() => import("./pages/Career"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const CookiesPolicy = React.lazy(() => import("./pages/CookiesPolicy"));
const Calculator = React.lazy(() => import("./pages/Calculator"));
const ThankYou = React.lazy(() => import("./pages/ThankYou"));
const LivePreview = React.lazy(() => import("./pages/LivePreview"));
const DynamicPage = React.lazy(() => import("./pages/DynamicPage"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Admin CMS Pages
const AdminLogin = React.lazy(() => import("./admin/pages/AdminLogin"));
const AdminLayout = React.lazy(() => import("./admin/layouts/AdminLayout"));
const DashboardOverview = React.lazy(() => import("./admin/pages/DashboardOverview"));
const PagesManager = React.lazy(() => import("./admin/pages/PagesManager"));
const VisualPageBuilder = React.lazy(() => import("./admin/pages/VisualPageBuilder"));
const ServicesManager = React.lazy(() => import("./admin/pages/ServicesManager"));
const BlogsManager = React.lazy(() => import("./admin/pages/BlogsManager"));
const PortfolioManager = React.lazy(() => import("./admin/pages/PortfolioManager"));
const CrmPipeline = React.lazy(() => import("./admin/pages/CrmPipeline"));
const SeoSuite = React.lazy(() => import("./admin/pages/SeoSuite"));
const MediaLibrary = React.lazy(() => import("./admin/pages/MediaLibrary"));
const TestimonialsManager = React.lazy(() => import("./admin/pages/TestimonialsManager"));
const TeamManager = React.lazy(() => import("./admin/pages/TeamManager"));
const FaqManager = React.lazy(() => import("./admin/pages/FaqManager"));
const NavigationManager = React.lazy(() => import("./admin/pages/NavigationManager"));
const JobsManager = React.lazy(() => import("./admin/pages/JobsManager"));
const SettingsManager = React.lazy(() => import("./admin/pages/SettingsManager"));
const UsersManager = React.lazy(() => import("./admin/pages/UsersManager"));
const AuditLogsViewer = React.lazy(() => import("./admin/pages/AuditLogsViewer"));

const PageLoader = () => (
  <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-8">
    <Skeleton variant="rectangular" className="h-[280px]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton variant="rectangular" className="h-[180px]" />
      <Skeleton variant="rectangular" className="h-[180px]" />
      <Skeleton variant="rectangular" className="h-[180px]" />
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ToastProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Tokenized Live Preview (Isolated preview shell) */}
              <Route path="/preview/:type/:token" element={<LivePreview />} />

              {/* Admin CMS Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin CMS Panel */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="pages" element={<PagesManager />} />
                <Route path="builder/:id" element={<VisualPageBuilder />} />
                <Route path="crm" element={<CrmPipeline />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="blogs" element={<BlogsManager />} />
                <Route path="portfolio" element={<PortfolioManager />} />
                <Route path="seo" element={<SeoSuite />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="testimonials" element={<TestimonialsManager />} />
                <Route path="team" element={<TeamManager />} />
                <Route path="faqs" element={<FaqManager />} />
                <Route path="navigation" element={<NavigationManager />} />
                <Route path="jobs" element={<JobsManager />} />
                <Route path="settings" element={<SettingsManager />} />
                <Route path="users" element={<UsersManager />} />
                <Route path="audit-logs" element={<AuditLogsViewer />} />
              </Route>

              {/* Public Website Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="pandanextai" element={<PandaNextAI />} />
                <Route path="services/:slug" element={<ServiceDetail />} />
                <Route path="case-studies" element={<CaseStudies />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<BlogDetail />} />
                <Route path="contact" element={<Contact />} />
                <Route path="career" element={<Career />} />
                <Route path="privacy-policy" element={<PrivacyPolicy />} />
                <Route path="cookies-policy" element={<CookiesPolicy />} />
                <Route path="app-cost-calculator" element={<Calculator />} />
                <Route path="thank-you" element={<ThankYou />} />
                <Route path=":slug" element={<DynamicPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}

export default App;
