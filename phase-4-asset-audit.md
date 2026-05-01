# Phase 4 Asset-Prep Audit

Date: 2026-05-01

Scope: audit only. No images, logos, icons, videos, CSS, or generated HTML were optimized, replaced, removed, or pruned.

## Scan Basis

- Runtime deployment files scanned: `index.html`, `about.html`, `services.html`, `projects.html`, `project-details.html`, `contact.html`, `styles.css`, and `script.js`.
- Build-time files excluded from deployment-reference counts: `build-pages.js` and `templates/**`.
- Asset references missing from scanned deployment files: 0.
- Files under `assets/`: 166.
- Referenced files under `assets/`: 30.
- Not referenced by scanned deployment files: 136.
- `favicon.ico` is referenced separately outside `assets/`.

## Phase 5 Optimization Candidates

### Highest Priority Raster Images

Convert these to responsive WebP and AVIF variants in Phase 5, keeping the original files until references are updated and verified:

- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f7e0b317dbdb8e3231_02. Khyber Restaurant.png` - 543.1 KB
- `assets/project-elegant-retreat.png` - 336.9 KB
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8eeb18c917589f966d7_01. Khyber Restaurant_Hero.jpeg` - 300.3 KB
- `assets/project-modern-marvel.png` - 264.6 KB
- `assets/project-grand-vista.png` - 247.9 KB
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/1.jpg` - 146.7 KB
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/4077486C-8922-41F5-B621-1B6DB225E5DA.jpeg` - 132.3 KB
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae232f4cf2e75b202122a_02.BK115.jpg` - 128.4 KB
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23ab7cefcc49aedc3fe_10.BK115.jpg` - 119.4 KB
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/8.jpg` - 102.9 KB
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69ce946be65481932970df49_69cae22c68939cf61015796d_01.BK115_Hero-p-1080.jpg` - 99.8 KB
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/1.jpg` - 82.5 KB
- `assets/bg/bg-dark.jpg` - 81.0 KB
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/2.jpg` - 62.9 KB
- `assets/team/team-bg-01-634x763.jpg` - 48.1 KB
- `assets/team/team-bg-02-634x763.jpg` - 34.1 KB
- `assets/team/team-bg-03-634x763.jpg` - 22.7 KB
- `assets/bg/video_bg.jpg` - 6.6 KB

### Logos And Icons

- `assets/casa-elegance-logo.png` - 272.8 KB. Optimize PNG; consider adding WebP only if transparency and sharpness remain acceptable. An SVG source would be preferable if available.
- `assets/casa-elegance-icon.png` - 140.2 KB. Optimize PNG; consider a small WebP/AVIF fallback only after transparent-edge QA.
- `favicon.ico` - keep as ICO unless a full favicon set is generated in Phase 5.
- `assets/partner/*.svg` - run SVG optimization only. Do not convert SVG partner marks to WebP/AVIF.

## WebP And AVIF Recommendations

- Convert referenced `.jpg`, `.jpeg`, and photo-like `.png` files to both WebP and AVIF.
- Keep original JPEG/PNG files during rollout as fallback or rollback assets.
- Do not convert SVG files to WebP/AVIF.
- Do not convert `favicon.ico` unless replacing it with a complete favicon manifest and fallback set.
- The unused `.webp` files under commercial retail projects are already in a modern format, but they are not referenced by the current six-page deployment.

## Referenced Assets By Type

- `.jpg`: 12
- `.jpeg`: 2
- `.png`: 6
- `.svg`: 10

## Unused In Current Deployment

These files are not referenced by the scanned runtime deployment files. Treat the large project-photo groups as content-library candidates: exclude from deployment only after confirming they are not needed by future project/detail pages.

- `assets/about-house.png`
- `assets/bg/about_bg.jpg`
- `assets/blog-embracing-minimalism.png`
- `assets/brand-1.png`
- `assets/brand-2.png`
- `assets/brand-3.png`
- `assets/brand-4.png`
- `assets/brand-5.png`
- `assets/fact-1.png`
- `assets/fact-2.png`
- `assets/fact-3.png`
- `assets/fact-4.png`
- `assets/hero-left.png`
- `assets/hero-main.png`
- `assets/hero-right.png`
- `assets/icon_box/d1.svg`
- `assets/logo.png`
- `assets/services-chair.png`
- `assets/team/1.jpg`
- `assets/team/2.jpg`
- `assets/team/3.jpg`
- `assets/team/4.jpg`
- `assets/team/5.jpg`
- `assets/testimonial-avatar.png`
- `assets/testimonial-bg.png`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23210a0972b4251a42d_07.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae2326cb6c959f6414b24_03.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae2327d5e361906d4748c_05.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae232f786a1b90e67dd0e_06.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23a0ba1c86e132b862e_13.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23aed2599b3f6e57e8a_08.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23af730619e43ccc8b1_12.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Burj115 Premium Office (Burj Khalifa)/69cae23b40db479137f95322_11.BK115.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/10.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/3.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/4.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/5.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/6.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/7.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Office Space/Genetec Office & Experience Center (Business Bay)/9.jpg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7dbf4c5cf5cdd28b4f9_ABLMDM-3-p-2000.jpeg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7df976273b96db64c8f_ABLMDM-15-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7e2976273b96db64e2a_ABLMDM-16-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7e548be3056ec3af7b5_ABLMDM-17-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7e86d60db8cb8af2175_ABLMDM-5-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7ecaf42e1fae9e5167c_ABLMDM-11-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Armani Bloomingdales (Dubai Mall)/67ceb7ef387d44fee65ee126_ABLMDM-8-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Gucci Rose (Dubai Mall) PopUp/67d7cba7c53fbbae3baa4b91_GR-2-min-p-2000.jpeg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Gucci Rose (Dubai Mall) PopUp/67d7cbab67dead48cd1b2ef2_GR-3-min-p-2000.jpeg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Gucci Rose (Dubai Mall) PopUp/67d7cbaf6e24ede427cfe16d_GR-4-min-p-2000.jpeg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Gucci Rose (Dubai Mall) PopUp/67d7cbb3c53fbbae3baa56fd_GR-5-min-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93ab0c85b0e40bb84d5bd_SE-5-p-2000.jpeg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93abb56a19e20ef1b82e5_SE-8-p-2000.jpeg`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93abb7212e23ea6271b3a_SE-7-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93abba8218a0c4fdecbc3_SE-6-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93abfa3584f0c8f0aab10_SE-9-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93abfa5181a589e482f6d_SE-10-p-2000.webp`
- `assets/Website Photos & Videos/Commercial Projects/Retail & PopUp Stores/Swarovski x Ariana Grande (MOE) PopUp/67c93ac56ad562dd6fda4b08_SE-11-p-2000.webp`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f7012ca62b32402d58_05. Khyber Restaurant.png`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f75b055248e51875a6_03. Khyber Restaurant.png`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f78787e14e57ef767d_06. Khyber Restaurant.png`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf8f7b6a0fce658630fd5_04. Khyber Restaurant.png`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf90503622d92b85d2134_07. Khyber Restaurant.png`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Khyber Restaurant (Palm Jumeirah)/69caf90517124b8f591ed7ea_08. Khyber Restaurant.png`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf47e5704673b187ee7fb_01. Sur Dubai_Hero.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf483062ce1259c1a47f6_03. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf4839174a3321475da93_04. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf483b3f378687320a7c8_05. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf483db02c4151728a640_02. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf48f6ed2d420765ceb02_06. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf49708decc8b7c872a8c_09. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf497698395b8fd2b9402_08. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Hospitality Projects/Restaurants/Sur Dubai (Uptown JLT)/69caf497ba8d9447e5aea19e_07. Sur Dubai.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/2.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/3.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/3BHK Apartment - Blue Waters.mp4`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/4.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/5.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Bluewaters)/6.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/0225EE21-A690-4A9A-8DE1-499D0AFF4602.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/3092DBD6-49C9-437C-B332-B5C080AE8D03.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/919F9928-611F-4458-A310-54DE75A3EDB5.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/929DE6BE-6696-4DE7-B9F3-D993C53EE025.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/9DF0F1CA-FEEB-454F-AEF2-B342474C4F5D.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/C0D38F66-DFB3-4722-BDDB-C7AC023078FB.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/C0D5B365-F99B-4C4E-8575-BE0440726027.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/2BHK Apartment (Dubai Creek Harbor)/CDE150F0-0CB3-417B-8C09-F989A8FBE464.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/1.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/2.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/3.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/4.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/5.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/6.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/7.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/8.jpg`
- `assets/Website Photos & Videos/Residential Projects/Apartments/3BHK Apartment (Royal Atlantis)/9.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/1.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/10.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/11.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/12.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/2.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/3.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/4.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/5.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/6.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/7.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Beachfront Villas (Palm Jumeirah)/9.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/08F94F0F-5A7A-453A-AEF1-7EE0634A6F1D.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/415D857B-76E7-4164-B9AB-0CB8FFF8B645.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/469D6E50-8816-4165-99E7-946F345D307E.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/5C0FD170-9677-4084-B7D5-8E8EBD071E68.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/758C36A7-42F1-4D60-8544-3AD999D080BC.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/944DEEAF-43CD-43B3-8778-F3A72881A015.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/9FC66E15-9325-4719-8EFD-2BD341B0D65F.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/A2046A68-E62C-4AF3-B740-34BAC8BFDD48.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/A8A3C007-981C-4715-904F-64753AB776CA.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/AB992C9A-2224-4E5D-9277-D9FF6B6706C5.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/DFA267C4-E176-43F6-81C5-C32AD4A2DF70.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/E43511B6-261A-4B78-9C74-946B5B586229.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/E8DF5CD3-0295-48A3-9BF9-A8E6F6CE315A.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Emaar Golf Grove (Dubai Hills Estate)/F44AD65A-22BC-437E-8CC3-85DB1F1B8850.jpeg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/Image.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/IMG_4068.JPG`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502365-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502388-HDR-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502394-HDR-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502440-HDR-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502456-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502473-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502743-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502748-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502762-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502791-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502811-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502880-HDR-scaled.jpg`
- `assets/Website Photos & Videos/Residential Projects/Villas/Palm Hills (Dubai Hills Estate)/SR502901-HDR-scaled.jpg`

## Build-Time Only

These are needed to regenerate pages but do not need to be served as runtime static deployment files:

- `build-pages.js`
- `templates/layout.html`
- `templates/partials/**`
- `templates/data/**`
