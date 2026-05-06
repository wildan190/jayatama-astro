import mongoose from 'mongoose';

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Media Schema (Base64 storage)
const MediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: String, required: true }, // Base64 string
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
}, { timestamps: true });

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  image: { type: String }, // URL or Base64 ID or path
  description: { type: String }, // HTML from Quill
  keywords: { type: [String] },
  tags: { type: [String] },
}, { timestamps: true });

// Web Config Schema
const WebConfigSchema = new mongoose.Schema({
  webName: String,
  logo: String,
  favicon: String,
  vision: String,
  mission: String,
  whatsapp: String,
  email: String,
  instagram: String,
  facebook: String,
  tiktok: String,
  navbar: [
    { label: String, url: String }
  ]
});

// Custom Page Schema (Page Builder)
const CustomPageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  isHome: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  blocks: [
    {
      type: { type: String, required: true }, // hero, richText, split, faq, cta
      data: mongoose.Schema.Types.Mixed
    }
  ],
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const MediaAsset = mongoose.models.MediaAsset || mongoose.model('MediaAsset', MediaSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const WebConfig = mongoose.models.WebConfig || mongoose.model('WebConfig', WebConfigSchema);
export const CustomPage = mongoose.models.CustomPage || mongoose.model('CustomPage', CustomPageSchema);
