# Deploying to Vercel

This guide will help you deploy your React application to Vercel.

## Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

## Option 1: Deploy via Vercel CLI

1. Open a terminal in the project directory (`frontendd`)
2. Log in to Vercel:
   ```
   vercel login
   ```
3. Deploy the application:
   ```
   vercel
   ```
4. Follow the prompts:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: Choose a name (or accept the default)
   - In which directory is your code located: `.` (current directory)
   - Want to override settings: `N`

5. Your app will be deployed and a URL will be provided.

## Option 2: Deploy via Vercel Dashboard

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New..." > "Project"
4. Import your Git repository
5. Configure your project:
   - Framework Preset: Vite
   - Root Directory: `frontendd` (if your repo contains multiple projects)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click "Deploy"

## Configuring Environment Variables (if needed)

If your application uses environment variables:

1. Go to your project in the Vercel Dashboard
2. Click "Settings" > "Environment Variables"
3. Add your environment variables
4. Click "Save"

## Custom Domain (optional)

1. Go to your project in the Vercel Dashboard
2. Click "Settings" > "Domains"
3. Add your domain and follow the instructions

## Troubleshooting

If you encounter issues with client-side routing:

1. Ensure the `vercel.json` file is properly configured with rewrites to handle client-side routing
2. The configuration has already been added to your project

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Deployment Notes

- Vercel automatically detects Vite projects and sets up the appropriate build configuration
- Each time you push to your connected Git repository, Vercel will automatically redeploy your site
- Preview deployments are created for pull requests 