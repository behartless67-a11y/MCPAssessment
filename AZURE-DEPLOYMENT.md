# Azure Static Web App Deployment Guide

This guide will walk you through deploying the Document Accessibility Checker to Azure Static Web Apps.

## Prerequisites

Before you begin, ensure you have:
- ✅ Azure account ([Create free account](https://azure.microsoft.com/free/))
- ✅ GitHub account
- ✅ GitHub repository with this code
- ✅ Anthropic API key

## Architecture

```
┌─────────────────────────────────────┐
│   Azure Static Web App              │
│                                      │
│  ┌──────────────────────────────┐  │
│  │   Frontend (Next.js)         │  │
│  │   Static Files on CDN        │  │
│  └──────────────────────────────┘  │
│                                      │
│  ┌──────────────────────────────┐  │
│  │   API (Azure Functions)      │  │
│  │   /api/analyze               │  │
│  │   /api/remediate             │  │
│  └──────────────────────────────┘  │
│                                      │
└─────────────────────────────────────┘
           │
           ↓
    Anthropic Claude API
```

## Step 1: Push Code to GitHub

If you haven't already, push your code to GitHub:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Document Accessibility Checker"

# Add your GitHub repository as remote
git remote add origin https://github.com/behartless67-a11y/MCPAssessment.git

# Push to GitHub
git push -u origin main
```

## Step 2: Create Azure Static Web App

### Option A: Using Azure Portal (Recommended)

1. **Go to Azure Portal**
   - Visit [portal.azure.com](https://portal.azure.com)
   - Sign in with your Microsoft account

2. **Create Static Web App**
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

3. **Configure Basic Settings:**
   - **Subscription:** Select your subscription
   - **Resource Group:** Create new or select existing
   - **Name:** `document-accessibility-checker` (or your preferred name)
   - **Plan type:** Free (for development) or Standard (for production)
   - **Region:** Choose closest to your users (e.g., East US 2)

4. **Deployment Details:**
   - **Source:** GitHub
   - **Organization:** Your GitHub username
   - **Repository:** MCPAssessment
   - **Branch:** main

5. **Build Details:**
   - **Build Presets:** Custom
   - **App location:** `/web-frontend`
   - **Api location:** `/api-server`
   - **Output location:** `.next`

6. **Review + Create**
   - Review your settings
   - Click "Create"
   - Wait for deployment (2-3 minutes)

### Option B: Using Azure CLI

```bash
# Install Azure CLI if not already installed
# Windows: https://aka.ms/installazurecliwindows

# Login to Azure
az login

# Create resource group
az group create --name accessibility-checker-rg --location eastus2

# Create static web app
az staticwebapp create \
  --name document-accessibility-checker \
  --resource-group accessibility-checker-rg \
  --source https://github.com/behartless67-a11y/MCPAssessment \
  --location eastus2 \
  --branch main \
  --app-location "/web-frontend" \
  --api-location "/api-server" \
  --output-location ".next" \
  --login-with-github
```

## Step 3: Configure GitHub Secrets

Azure will automatically create a GitHub Actions workflow. You need to add your API key as a secret:

1. **Go to your GitHub repository**
   - Navigate to https://github.com/behartless67-a11y/MCPAssessment

2. **Add Secrets:**
   - Click "Settings" → "Secrets and variables" → "Actions"
   - Click "New repository secret"

3. **Add ANTHROPIC_API_KEY:**
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (starts with `sk-ant-`)
   - Click "Add secret"

4. **Verify AZURE_STATIC_WEB_APPS_API_TOKEN:**
   - This should already exist (created by Azure)
   - If not, get it from Azure Portal → Static Web App → "Manage deployment token"

## Step 4: Configure Environment Variables in Azure

1. **Go to Azure Portal**
   - Navigate to your Static Web App resource

2. **Configuration:**
   - Click "Configuration" in the left menu
   - Click "Application settings"

3. **Add Environment Variables:**
   - Click "+ Add"
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key
   - Click "OK"
   - Click "Save"

## Step 5: Update API URLs in Code

The frontend needs to use relative URLs for Azure deployment:

**File: `web-frontend/app/components/FileUpload.tsx`**

Change from:
```typescript
const response = await axios.post('http://localhost:3002/api/analyze', formData, {
```

To:
```typescript
const response = await axios.post('/api/analyze', formData, {
```

**File: `web-frontend/app/components/RemediationPanel.tsx`**

Change any `http://localhost:3002/api/remediate` to `/api/remediate`

## Step 6: Deploy

Once you've made the changes, commit and push:

```bash
git add .
git commit -m "Configure for Azure Static Web Apps deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build your Next.js frontend
2. Deploy static files to Azure CDN
3. Deploy API functions to Azure
4. Make your site live!

## Step 7: Monitor Deployment

1. **GitHub Actions:**
   - Go to your repository on GitHub
   - Click "Actions" tab
   - Watch the "Azure Static Web Apps CI/CD" workflow
   - Should complete in 3-5 minutes

2. **Azure Portal:**
   - Go to your Static Web App
   - Click "Overview"
   - Find your URL (e.g., `https://document-accessibility-checker.azurestaticapps.net`)

## Step 8: Test Your Deployment

Once deployment is complete:

1. **Visit your site:**
   - Go to the URL from Azure Portal
   - You should see "Document Accessibility Checker"

2. **Test file upload:**
   - Upload a test document
   - Verify analysis completes
   - Check results display correctly

3. **Check logs:**
   - Azure Portal → Static Web App → "Application Insights"
   - Monitor API calls and errors

## Configuration Files

### staticwebapp.config.json
Located at project root. Configures routing and headers:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ]
}
```

### .github/workflows/azure-static-web-apps.yml
Automated deployment workflow. Update if needed:
- Change `app_location` if frontend moves
- Change `api_location` if API moves
- Add additional environment variables

## Troubleshooting

### Deployment Fails

**Check GitHub Actions logs:**
```bash
# View in browser
https://github.com/behartless67-a11y/MCPAssessment/actions
```

Common issues:
- Missing secrets (ANTHROPIC_API_KEY)
- Wrong app/api locations
- Build errors in Next.js
- Missing dependencies

### API Not Working

**Check:**
1. Environment variables in Azure Portal
2. API location setting (`/api-server`)
3. Logs in Application Insights
4. CORS settings if needed

**View API logs:**
- Azure Portal → Static Web App → "Application Insights" → "Logs"

### Frontend Not Loading

**Check:**
1. Output location is `.next`
2. App location is `/web-frontend`
3. Build completed successfully
4. staticwebapp.config.json is in root

## Custom Domain (Optional)

### Add Custom Domain:

1. **Azure Portal:**
   - Static Web App → "Custom domains"
   - Click "+ Add"
   - Enter domain: `accessibility.yourdomain.com`

2. **DNS Configuration:**
   - Add CNAME record:
     - Name: `accessibility`
     - Value: `[your-app].azurestaticapps.net`

3. **Validate:**
   - Click "Validate" in Azure Portal
   - Wait for SSL certificate (automatic)

## Cost Estimation

### Free Tier
- **Bandwidth:** 100 GB/month
- **API Requests:** 1M free requests
- **Custom domains:** Unlimited
- **SSL:** Free
- **Cost:** $0/month

### Standard Tier
- **Bandwidth:** Starts at $0.20/GB
- **API Requests:** Pay per execution
- **Custom domains:** Unlimited
- **SSL:** Free
- **Private endpoints:** Available
- **Estimated cost:** ~$10-50/month for moderate use

### Anthropic API Costs (Separate)
- ~$0.05-$0.15 per analysis
- 100 analyses/month: ~$5-15
- 1000 analyses/month: ~$50-150

**Total estimated monthly cost:** $10-65 for moderate usage

## Scaling Considerations

### Performance:
- **Global CDN:** Frontend cached worldwide
- **Auto-scaling:** API scales automatically
- **No server management:** Fully managed

### Limits:
- **Free tier:** 100 GB bandwidth/month
- **Function timeout:** 10 minutes (max)
- **File upload:** 100 MB (increase if needed)

## Security Best Practices

### 1. API Key Protection
```bash
# Never commit .env files
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### 2. CORS Configuration
If needed, add to `staticwebapp.config.json`:
```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "https://yourdomain.com"
  }
}
```

### 3. Rate Limiting
Add to API functions:
```typescript
// api-server/src/middleware/rateLimiter.ts
export async function rateLimiter(req) {
  // Implement rate limiting logic
}
```

### 4. Authentication (Optional)
For private use, enable Azure AD authentication:
- Azure Portal → Static Web App → "Authentication"
- Configure authentication provider

## Monitoring & Analytics

### Application Insights:
1. **Automatically enabled** with Static Web Apps
2. **View metrics:**
   - Response times
   - Error rates
   - API usage
3. **Set up alerts:**
   - Azure Portal → Static Web App → "Alerts"

### Custom Analytics:
Add Google Analytics or similar:
```html
<!-- web-frontend/app/layout.tsx -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
```

## Continuous Deployment

### Automatic Deployments:
- **Push to `main`:** Deploys to production
- **Pull Requests:** Creates preview deployments
- **Staging environment:** Use separate branch

### Preview Deployments:
Every PR automatically gets a preview URL:
```
https://[unique-name].[your-app].azurestaticapps.net
```

## Backup & Disaster Recovery

### Code Backup:
- Stored in GitHub (version controlled)
- Create tags for stable releases

### Configuration Backup:
```bash
# Export configuration
az staticwebapp show \
  --name document-accessibility-checker \
  --resource-group accessibility-checker-rg \
  > azure-config-backup.json
```

## Support & Resources

### Azure Documentation:
- [Static Web Apps Docs](https://docs.microsoft.com/azure/static-web-apps/)
- [Pricing Details](https://azure.microsoft.com/pricing/details/app-service/static/)
- [Quickstart Guide](https://docs.microsoft.com/azure/static-web-apps/getting-started)

### GitHub Actions:
- [Actions Documentation](https://docs.github.com/actions)
- [Static Web Apps Deploy](https://github.com/Azure/static-web-apps-deploy)

### Support:
- **Azure Support:** [portal.azure.com](https://portal.azure.com) → Support
- **Community:** [Microsoft Q&A](https://aka.ms/AzureStaticWebAppsQnA)
- **Issues:** [GitHub Issues](https://github.com/behartless67-a11y/MCPAssessment/issues)

## Next Steps

After successful deployment:

1. ✅ Test all functionality
2. ✅ Set up custom domain (optional)
3. ✅ Configure monitoring alerts
4. ✅ Document API endpoints
5. ✅ Share with users!

---

**Deployment checklist:**
- [ ] Code pushed to GitHub
- [ ] Azure Static Web App created
- [ ] GitHub secrets configured
- [ ] Environment variables set in Azure
- [ ] API URLs updated to relative paths
- [ ] Deployment successful
- [ ] Site tested and working
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled

**Your app will be live at:**
`https://[your-app-name].azurestaticapps.net`

Congratulations! Your Document Accessibility Checker is now deployed globally! 🎉
