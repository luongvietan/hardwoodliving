# Hardwood Living — Sanity CMS User Guide

**A simple, step-by-step guide for managing your website content.**

---

## Table of Contents

1. [What is Sanity CMS?](#1-what-is-sanity-cms)
2. [How to Access the Admin Panel](#2-how-to-access-the-admin-panel)
3. [Content Overview](#3-content-overview)
4. [Homepage](#4-homepage)
5. [Site Settings](#5-site-settings)
6. [Products](#6-products)
7. [Categories](#7-categories)
8. [Pages](#8-pages)
9. [Testimonials](#9-testimonials)
10. [Adding Images](#10-adding-images)
11. [Publishing Your Changes](#11-publishing-your-changes)
12. [Preview Before Publishing](#12-preview-before-publishing)
13. [Bulk Import Products](#13-bulk-import-products)
14. [Tips & Troubleshooting](#14-tips--troubleshooting)

---

## 1. What is Sanity CMS?

Sanity CMS is the **content management system** (the “back office”) for your Hardwood Living website. It lets you:

- Edit the homepage text and images
- Add, edit, or remove products
- Manage categories (e.g. Hardwood, Vinyl, Laminate)
- Create and edit pages (About, Contact, etc.)
- Add customer testimonials
- Update site settings (logo, contact info, navigation)

**You do not need to know how to code.** Everything is done through forms and menus.

---

## 2. How to Access the Admin Panel

1. Open your website in a browser (e.g. `https://your-site.com`).
2. Add `/admin` to the end of the URL:  
   `https://your-site.com/admin`
3. Log in with the username and password provided by your developer.
4. You will see the **Content** sidebar on the left with all content types.

---

## 3. Content Overview

| Item | What it controls |
|------|------------------|
| **Homepage** | Hero section, offers, testimonials, FAQ, and other homepage blocks |
| **Site Settings** | Logo, navigation menu, contact info, footer, social links |
| **Product** | Individual flooring products (name, price, images, specs) |
| **Category** | Product categories (Hardwood, Vinyl, Laminate, etc.) |
| **Page** | Custom pages like About, Contact, or any content page |
| **Testimonial** | Customer reviews and quotes |

---

## 4. Homepage

Click **Homepage** in the left sidebar. You will see several sections you can edit.

### Hero Section
- **Heading** — Main headline (e.g. “CRAFTED BY NATURE”)
- **Subheading Line 1 & 2** — Supporting text
- **Hero Slideshow Images** — Main images at the top (add at least 1)
- **CTA Link & Text** — Primary button (e.g. “Shop Now”)
- **Hero Category Bar** — Up to 5 quick links (label + URL)

### Choosing the Right Floor Section
- Headings, bullet points, result text
- Two images (person examining samples, showroom)
- CTA button text and link

### What We Offer
- Intro paragraph
- Up to 4 core collections (title, description, link)

### Our Specialty
- Intro line
- Up to 4 steps (number, title, description)
- CTA button

### Limited Time Offer
- Badge text, heading, body text
- Background image
- Primary and secondary CTA buttons

### Why Homeowners & Designers Love Us
- Heading
- Value props (title, description, optional image)

### Projects Preview
- Heading
- 3 project images (links to gallery)

### FAQ
- Section heading
- Up to 3 questions and answers (shown on homepage)

### Testimonials
- Section heading
- Select which testimonials to show (create them under **Testimonial** first)

### Book Your Showroom Visit Form
- Heading, subheading
- Primary and secondary button text

**Tip:** After editing, click **Publish** at the bottom to save changes. See [Publishing Your Changes](#11-publishing-your-changes).

---

## 5. Site Settings

Click **Site Settings** in the left sidebar.

### Site Name
The name of your business (e.g. “Hardwood Living”).

### Logo
Upload your logo. It appears in the header and footer.

### Main Navigation
Define the menu links. Each item has:
- **Link Title** — Text shown in the menu
- **Path** — URL (e.g. `/about`, `/contact`, `/products`)
- **Position** — Left or right of the logo
- **Dropdown Items** — Optional sub-menu links

**Example:**  
- Title: “Products”, Path: `/products`, Position: Left  
- Add dropdown items: “Hardwood” → `/collections/hardwood`, “Vinyl” → `/collections/luxury-vinyl-plank`

### Contact Information
- Email, Phone, Address, Toll-Free Number

### Footer
- **Footer Tagline** — Short description under the logo
- **Business Hours** — e.g. “Mon–Fri: 9:00–18:00”
- **Footer Phone** — Optional different number for footer
- **Copyright Text** — e.g. “© 2026 Hardwood Living. All rights reserved.”

### Ready to Find CTA
- Heading, subheading
- Primary and secondary button text

### Social Media Links
Add links to Facebook, Instagram, Pinterest, Twitter, YouTube, LinkedIn.

---

## 6. Products

Click **Product** in the left sidebar, then **New document** to add a product, or click an existing product to edit it.

### Required Fields
- **Title** — Product name (e.g. “White Alaska”)
- **Slug** — URL-friendly name (click **Generate** to create from title)
- **Price** — Number (e.g. 8.50)
- **Category** — Select a category (Hardwood, Vinyl, etc.)

### Core Fields
- **Description** — Short product description
- **Price Unit** — Per sq ft, per box, per piece, or per linear ft
- **Images** — Add product photos (first image = main image)

### Product Specifications
Expand **Product specifications** to add details such as:
- Species, Width, Thickness, Length
- Prefinished, Surface, Stain, Color
- Cut, Grade, Edge, Traffic, Application
- Installation, Pattern, Source, Eco
- Janka Rate, Radiant heat rated, Air moisture
- Trim & moulding, Stock, Delivery time
- Sft/box, Weight/box, Box dimensions

Leave blank if not applicable.

### Filter & Navigation
- **Material Type** — Hardwood, Engineered, Luxury Vinyl Plank, Laminate, Tile, etc. (controls where the product appears in Collections)
- **Finish** — Prefinished or Unfinished (for hardwood/engineered)
- **Commercial Product** — Check if it appears under Commercial
- **On Sale** — Check to show in “On Sale” section
- **Sale Price** — Discounted price (only when “On Sale” is checked)
- **Best Value** — Check to show in “Best Value” collection
- **Tags** — e.g. “waterproof”, “pet-friendly”, “wide-plank”

### Visibility
- **Public** — Visible to everyone
- **Wholesale Only** — Visible only to wholesale customers
- **Hidden** — Not shown on the site (for drafts)

### Other
- **Featured** — Show on homepage or featured areas
- **Sort Order** — Lower number = appears first (leave blank for alphabetical)

---

## 7. Categories

Click **Category** in the left sidebar.

### Fields
- **Title** — Category name (e.g. “Hardwood Flooring”)
- **Slug** — URL slug (click **Generate** from title)
- **Description** — Short description
- **Image** — Optional category image
- **Parent Category** — Optional (for nested categories)
- **Body** — Rich text content for the category page (headings, paragraphs, images, links)

**Important:** Create categories before adding products. Products must be linked to a category.

---

## 8. Pages

Click **Page** in the left sidebar to create or edit custom pages (About, Contact, etc.).

### Fields
- **Title** — Page title
- **Slug** — URL path (e.g. `about` → `/pages/about`)
- **Parent Page** — Optional (for nested URLs like `/pages/about/team`)
- **Body** — Main content (headings, paragraphs, images, links)
- **SEO** — Meta title, meta description, social sharing image

**URL rule:** A page with slug `about` and no parent appears at `/pages/about`.

---

## 9. Testimonials

Click **Testimonial** in the left sidebar.

### Fields
- **Author** — Customer name (required)
- **Content** — The quote or review (required)
- **Author Image** — Optional photo
- **Role / Title** — e.g. “Homeowner”, “Interior Designer”

After creating testimonials, go to **Homepage** and add them to the **Testimonials** section.

---

## 10. Adding Images

1. Click the **Upload** or **Select** button in any image field.
2. Choose a file from your computer (JPEG, PNG, WebP, GIF supported).
3. Optionally crop or adjust the **hotspot** (focus area) for better display.
4. Click **Select** to use the image.

**Tips:**
- Use clear, high-quality images (at least 1200px wide for hero images).
- Keep file sizes reasonable (under 2MB) for faster loading.
- The first product image is the main one shown in listings.

---

## 11. Publishing Your Changes

1. Make your edits in any document.
2. Click **Publish** at the bottom of the form.
3. Confirm if prompted.
4. Your changes will appear on the live site (may take a few seconds).

**Draft vs Published:**
- Unpublished changes are drafts. Only you see them in the admin.
- After **Publish**, everyone sees the changes on the website.
- You can click **Discard changes** to undo unsaved edits.

---

## 12. Preview Before Publishing

1. While editing, click the **Presentation** tab (or preview icon) if available.
2. You will see a live preview of the page.
3. Make edits and watch the preview update.
4. When satisfied, go back and click **Publish**.

---

## 13. Bulk Import Products

If you have many products in a spreadsheet, you can import them in bulk instead of adding one by one.

**Quick steps:**
1. Copy the template: `scripts/products-bulk-template.csv`
2. Fill in your product data (title, price, category, images, etc.)
3. Run: `npm run import:products -- your-file.csv --dry-run` (preview only)
4. Run: `npm run import:products -- your-file.csv` (actual import)

**Full details:** See [Bulk Import Products](./bulk-import-products.md) for the complete CSV format, required columns, and setup (API token, categories).

---

## 14. Tips & Troubleshooting

### I don’t see my changes on the website
- Make sure you clicked **Publish** (not just Save).
- Wait 10–30 seconds and refresh the page.
- Clear your browser cache if needed.

### I can’t add a product
- Ensure you have at least one **Category** created.
- Fill in **Title**, **Slug**, **Price**, and **Category** (all required).
- Click **Generate** next to Slug if it’s empty.

### Images won’t upload
- Check file format (JPEG, PNG, WebP, GIF).
- Try a smaller file size (under 5MB).
- Check your internet connection.

### I made a mistake
- If you haven’t published yet, click **Discard changes**.
- If already published, edit the document again and fix it, then **Publish**.

### I forgot my password
- Contact your developer or site administrator to reset it.

### Where do I get help?
- Contact your developer for technical issues.
- For Sanity-specific help: [sanity.io/docs](https://www.sanity.io/docs)

---

## Quick Reference: Common URLs

| Path | What it shows |
|------|---------------|
| `/` | Homepage |
| `/products` | All products |
| `/products/[slug]` | Single product |
| `/categories/[slug]` | Category page |
| `/collections/hardwood` | Hardwood collection |
| `/collections/luxury-vinyl-plank` | LVP collection |
| `/on-sale` | Products on sale |
| `/best-value` | Best value products |
| `/pages/about` | Custom page (slug: about) |
| `/admin` | Sanity admin panel |

---

*Last updated: February 2026*
