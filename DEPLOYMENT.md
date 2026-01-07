# Deployment Guide for Vercel

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit - Cafe Management System"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Go to [vercel.com](https://vercel.com)** and sign in

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Configure the project**:

   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

6. **Click "Deploy"**

7. **Wait for deployment to complete** - Vercel will give you a URL!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Follow the prompts**:

   - Link to existing project? No
   - Project name: cafe (or your preferred name)
   - Directory: ./
   - Override settings? No

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Important Notes

- The app uses file-based storage (JSON files) which works on Vercel
- Data will persist during the deployment lifecycle
- For production, consider migrating to a database (PostgreSQL, MongoDB, etc.)
- The app is now fully responsive for mobile and tablet devices

## Environment Variables

No environment variables are required for basic functionality.

## Post-Deployment

After deployment, you can:

1. Access your app at the provided Vercel URL
2. Set up a custom domain (optional)
3. Configure environment variables if needed in the future

## Default Credentials

- **Admin**: `admin` / `admin123`
- **Waiter**: `waiter1` / `waiter123`

**⚠️ Important**: Change these credentials in production!
