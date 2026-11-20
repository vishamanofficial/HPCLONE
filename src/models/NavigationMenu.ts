import mongoose, { Schema, Document } from 'mongoose';

export interface INavItem {
  id: string;
  label: string;
  url: string;
  target?: '_self' | '_blank';
  isExternal?: boolean;
  badge?: string;
  icon?: string;
  order: number;
  children?: INavItem[];
}

export interface INavigationMenu extends Document {
  location: 'header' | 'footer_company' | 'footer_recent_work' | 'footer_key_offerings';
  title: string;
  items: INavItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NavItemSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    target: { type: String, default: '_self' },
    isExternal: { type: Boolean, default: false },
    badge: { type: String, default: '' },
    icon: { type: String, default: '' },
    order: { type: Number, default: 0 },
    children: [Schema.Types.Mixed]
  },
  { _id: false }
);

const NavigationMenuSchema = new Schema<INavigationMenu>(
  {
    location: {
      type: String,
      required: true,
      unique: true,
      enum: ['header', 'footer_company', 'footer_recent_work', 'footer_key_offerings']
    },
    title: { type: String, required: true },
    items: [NavItemSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const NavigationMenu = (mongoose.models.NavigationMenu as mongoose.Model<INavigationMenu>) || mongoose.model<INavigationMenu>('NavigationMenu', NavigationMenuSchema);
