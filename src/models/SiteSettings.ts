import mongoose, { Schema, Document } from 'mongoose';
import { siteConfig } from '@/config/site';

export interface ISiteSettings extends Document {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentOrange: string;
  contactEmail: string;
  contactPhone: string;
  whatsappNumber: string;
  officeAddress: string;
  officeLocations: Array<{
    city: string;
    type: string;
    address: string;
  }>;
  socialLinks: {
    facebook: string;
    twitter: string;
    linkedin: string;
    instagram: string;
    github?: string;
  };
  announcementBar: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    badge?: string;
  };
  footerText: string;
  copyrightText: string;
  defaultCta: {
    headline: string;
    subheadline: string;
    buttonText: string;
    buttonUrl: string;
    secondaryButtonText?: string;
    secondaryButtonUrl?: string;
  };
  customHeadScripts?: string;
  customBodyScripts?: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: siteConfig.name },
    tagline: { type: String, default: siteConfig.tagline },
    logoUrl: { type: String, default: siteConfig.assets.logo },
    faviconUrl: { type: String, default: siteConfig.assets.favicon },
    primaryColor: { type: String, default: '#ef4444' },
    secondaryColor: { type: String, default: '#dc2626' },
    accentOrange: { type: String, default: '#dc2626' },
    contactEmail: { type: String, default: siteConfig.emails.contact },
    contactPhone: { type: String, default: siteConfig.phone },
    whatsappNumber: { type: String, default: siteConfig.phone.replace(/[^0-9]/g, '') },
    officeAddress: { type: String, default: siteConfig.address.full },
    officeLocations: [
      {
        city: { type: String },
        type: { type: String },
        address: { type: String }
      }
    ],
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      github: { type: String, default: '' }
    },
    announcementBar: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
      linkUrl: { type: String, default: '' },
      badge: { type: String, default: '' }
    },
    footerText: {
      type: String,
      default:
        'AI-powered Software Development Company for Startups & Enterprises. Re-imagining software architectures with security, accessibility, and high performance.'
    },
    copyrightText: {
      type: String,
      default: `© {year} ${siteConfig.legalName}. All rights reserved.`
    },
    defaultCta: {
      headline: { type: String, default: 'Ready to bring your software vision to life?' },
      subheadline: {
        type: String,
        default:
          'Connect with our engineering leads today for a confidential architecture consultation and sprint cost breakdown.'
      },
      buttonText: { type: String, default: 'Schedule a Tech Consultation' },
      buttonUrl: { type: String, default: '/contact' },
      secondaryButtonText: { type: String, default: 'Explore Cost Wizard' },
      secondaryButtonUrl: { type: String, default: '/app-cost-calculator' }
    },
    customHeadScripts: { type: String, default: '' },
    customBodyScripts: { type: String, default: '' }
  },
  { timestamps: true }
);

export const SiteSettings = (mongoose.models.SiteSettings as mongoose.Model<ISiteSettings>) || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
