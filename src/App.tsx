import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Skeleton from "./components/ui/Skeleton";

const Home = React.lazy(() => import("./pages/Home"));
const About = React.lazy(() => import("./pages/About"));
const PandaNextAI = React.lazy(() => import("./pages/PandaNextAI"));
const ServiceDetail = React.lazy(() => import("./pages/ServiceDetail"));
const CaseStudies = React.lazy(() => import("./pages/CaseStudies"));
const Blog = React.lazy(() => import("./pages/Blog"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Career = React.lazy(() => import("./pages/Career"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const CookiesPolicy = React.lazy(() => import("./pages/CookiesPolicy"));
const Calculator = React.lazy(() => import("./pages/Calculator"));
const ThankYou = React.lazy(() => import("./pages/ThankYou"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

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
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="pandanextai" element={<PandaNextAI />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="case-studies" element={<CaseStudies />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
            <Route path="career" element={<Career />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="cookies-policy" element={<CookiesPolicy />} />
            <Route path="app-cost-calculator" element={<Calculator />} />
            <Route path="thank-you" element={<ThankYou />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
