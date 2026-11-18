import mongoose, { Schema, Document } from 'mongoose';

export interface ISeoSettings extends Document {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  defaultOgTitle?: string;
  defaultOgDescription?: string;
  siteUrl: string;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
  bingVerification?: string;
  defaultRobots: string;
  organizationSchema: {
    name: string;
    legalName?: string;
    url: string;
    logo: string;
    contactPoint: {
      telephone: string;
      contactType: string;
      email: string;
      areaServed?: string;
    };
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    sameAs: string[];
  };
  customRobotsTxt?: string;
  updatedAt: Date;
}

const SeoSettingsSchema = new Schema<ISeoSettings>(
  {
    defaultMetaTitle: {
      type: String,
      default: 'HangingPanda | AI-Powered Custom Software & Mobile App Development'
    },
    defaultMetaDescription: {
      type: String,
      default:
        'HangingPanda designs and engineers enterprise software, Android & iOS mobile apps, and custom web platforms. Get your development quote using our App Cost Calculator.'
    },
    defaultOgImage: { type: String, default: '/favicon.svg' },
    defaultOgTitle: { type: String, default: '' },
    defaultOgDescription: { type: String, default: '' },
    siteUrl: { type: String, default: 'https://hangingpanda.com' },
    googleAnalyticsId: { type: String, default: '' },
    googleSearchConsoleVerification: { type: String, default: '' },
    bingVerification: { type: String, default: '' },
    defaultRobots: { type: String, default: 'index, follow' },
    organizationSchema: {
      name: { type: String, default: 'HangingPanda Software Labs' },
      legalName: { type: String, default: 'HangingPanda Pvt Ltd' },
      url: { type: String, default: 'https://hangingpanda.com' },
      logo: { type: String, default: 'https://hangingpanda.com/favicon.svg' },
      contactPoint: {
        telephone: { type: String, default: '+91-8887024887' },
        contactType: { type: String, default: 'Customer Support' },
        email: { type: String, default: 'vishamanofficial.business@gmail.com' },
        areaServed: { type: String, default: 'Global' }
      },
      address: {
        streetAddress: { type: String, default: 'B-64, B Block, Sector 63' },
        addressLocality: { type: String, default: 'Noida' },
        addressRegion: { type: String, default: 'Uttar Pradesh' },
        postalCode: { type: String, default: '201301' },
        addressCountry: { type: String, default: 'India' }
      },
      sameAs: [
        { type: String, default: 'https://facebook.com' },
        { type: String, default: 'https://twitter.com' },
        { type: String, default: 'https://linkedin.com' },
        { type: String, default: 'https://instagram.com' }
      ]
    },
    customRobotsTxt: { type: String, default: '' }
  },
  { timestamps: true }
);

export const SeoSettings = mongoose.model<ISeoSettings>('SeoSettings', SeoSettingsSchema);
