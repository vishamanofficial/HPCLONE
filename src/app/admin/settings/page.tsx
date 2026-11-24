'use client';
import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useToast } from '@/components/admin/Toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { siteConfig } from '@/config/site';
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Palette,
  Sparkles,
  Link as LinkIcon,
  Bell,
  RefreshCw
} from 'lucide-react';

export default function SettingsManagerPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<any>({
    siteName: siteConfig.name,
    tagline: siteConfig.tagline,
    logoUrl: siteConfig.assets.logo,
    faviconUrl: siteConfig.assets.favicon,
    primaryColor: '#ef4444',
    secondaryColor: '#dc2626',
    contactEmail: siteConfig.emails.contact,
    contactPhone: siteConfig.phone,
    whatsappNumber: siteConfig.phone.replace(/[^0-9]/g, ''),
    officeAddress: siteConfig.address.full,
    socialLinks: {
      facebook: siteConfig.socialLinks.facebook,
      twitter: siteConfig.socialLinks.twitter,
      linkedin: siteConfig.socialLinks.linkedin,
      instagram: siteConfig.socialLinks.instagram
    },
    announcementBar: {
      enabled: false,
      text: '',
      linkUrl: '',
      badge: ''
    },
    footerText: '',
    copyrightText: siteConfig.getCopyright('{year}'),
    defaultCta: {
      headline: 'Ready to bring your software vision to life?',
      subheadline: 'Connect with our engineering leads today for a confidential architecture consultation.',
      buttonText: 'Schedule a Tech Consultation',
      buttonUrl: '/contact'
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getAdminSettings();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err: any) {
        error(err.message || 'Failed to fetch site settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (field: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  const handleAnnouncementChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      announcementBar: { ...prev.announcementBar, [field]: value }
    }));
  };

  const handleCtaChange = (field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      defaultCta: { ...prev.defaultCta, [field]: value }
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.updateAdminSettings(settings);
      if (res.success) {
        success('Global site settings updated successfully!');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8 text-left max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Global Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Configure site identity, brand tokens, contact info, header announcement, and footer parameters.
          </p>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="md"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>

      {/* 1. Brand Identity */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-text-primary">Website Identity & Branding</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Website Name
            </label>
            <Input
              value={settings.siteName || ''}
              onChange={(e) => handleChange('siteName', e.target.value)}
              placeholder={siteConfig.name}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Website Tagline
            </label>
            <Input
              value={settings.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
              placeholder="AI-Powered Software & Mobile App Development"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Logo URL or Path
            </label>
            <Input
              value={settings.logoUrl || ''}
              onChange={(e) => handleChange('logoUrl', e.target.value)}
              placeholder="/favicon.svg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Favicon URL or Path
            </label>
            <Input
              value={settings.faviconUrl || ''}
              onChange={(e) => handleChange('faviconUrl', e.target.value)}
              placeholder="/favicon.svg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor || '#ef4444'}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-border bg-transparent p-1"
              />
              <Input
                value={settings.primaryColor || '#ef4444'}
                onChange={(e) => handleChange('primaryColor', e.target.value)}
                placeholder="#ef4444"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Secondary Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.secondaryColor || '#dc2626'}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-border bg-transparent p-1"
              />
              <Input
                value={settings.secondaryColor || '#dc2626'}
                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                placeholder="#dc2626"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Official Contact Coordinates */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Phone className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-text-primary">Contact Coordinates & Addresses</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Official Email
            </label>
            <Input
              type="email"
              value={settings.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="vishamanofficial.business@gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Primary Phone
            </label>
            <Input
              value={settings.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
              placeholder="+91-8887024887"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              WhatsApp Integration Number
            </label>
            <Input
              value={settings.whatsappNumber || ''}
              onChange={(e) => handleChange('whatsappNumber', e.target.value)}
              placeholder="918887024887"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Corporate Headquarters Address
            </label>
            <Input
              value={settings.officeAddress || ''}
              onChange={(e) => handleChange('officeAddress', e.target.value)}
              placeholder="B-64, B Block, Sector 63, Noida, Uttar Pradesh, India, 201301"
            />
          </div>
        </div>
      </div>

      {/* 3. Social Media Links */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <LinkIcon className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-text-primary">Social Media Profiles</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              LinkedIn URL
            </label>
            <Input
              value={settings.socialLinks?.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              placeholder={siteConfig.socialLinks.linkedin}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Twitter / X URL
            </label>
            <Input
              value={settings.socialLinks?.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              placeholder={siteConfig.socialLinks.twitter}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Facebook URL
            </label>
            <Input
              value={settings.socialLinks?.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              placeholder={siteConfig.socialLinks.facebook}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Instagram URL
            </label>
            <Input
              value={settings.socialLinks?.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              placeholder={siteConfig.socialLinks.instagram}
            />
          </div>
        </div>
      </div>

      {/* 4. Global Announcement Bar */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-base font-black text-text-primary">Top Announcement Bar</h2>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.announcementBar?.enabled || false}
              onChange={(e) => handleAnnouncementChange('enabled', e.target.checked)}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="text-xs font-bold text-text-primary">Enable Top Bar</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Announcement Text
            </label>
            <Input
              value={settings.announcementBar?.text || ''}
              onChange={(e) => handleAnnouncementChange('text', e.target.value)}
              placeholder="We just launched PandaNext AI Labs! Deploy autonomous agents today."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Badge Label
            </label>
            <Input
              value={settings.announcementBar?.badge || ''}
              onChange={(e) => handleAnnouncementChange('badge', e.target.value)}
              placeholder="NEW"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Click Destination URL
            </label>
            <Input
              value={settings.announcementBar?.linkUrl || ''}
              onChange={(e) => handleAnnouncementChange('linkUrl', e.target.value)}
              placeholder="/pandanextai"
            />
          </div>
        </div>
      </div>

      {/* 5. Footer & Copyright */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-base font-black text-text-primary">Footer Information</h2>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
            Footer Bio Paragraph
          </label>
          <Textarea
            rows={3}
            value={settings.footerText || ''}
            onChange={(e) => handleChange('footerText', e.target.value)}
            placeholder="AI-powered Software Development Company for Startups & Enterprises..."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
            Copyright Line Text
          </label>
          <Input
            value={settings.copyrightText || ''}
            onChange={(e) => handleChange('copyrightText', e.target.value)}
            placeholder={siteConfig.getCopyright('{year}')}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </Button>
      </div>
    </form>
  );
};

