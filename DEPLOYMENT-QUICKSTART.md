# Azure Deployment Quick Start

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Azure deployment"
git push origin main
```

### Step 2: Create Azure Static Web App

1. Go to [portal.azure.com](https://portal.azure.com)
2. Click "Create a resource" → Search "Static Web App"
3. Fill in:
   - **Name:** `document-accessibility-checker`
   - **Region:** East US 2
   - **Source:** GitHub
   - **Repository:** MCPAssessment
   - **Branch:** main
   - **App location:** `/web-frontend`
   - **Api location:** `/api-server`
   - **Output location:** `.next`
4. Click "Create"

### Step 3: Add GitHub Secret

1. Go to GitHub repo → Settings → Secrets
2. Add secret:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your API key

### Step 4: Add Azure Environment Variable

1. Azure Portal → Your Static Web App → Configuration
2. Add application setting:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your API key
3. Click "Save"

### Step 5: Done!

Your app will be live at:
`https://document-accessibility-checker.azurestaticapps.net`

---

## 📝 Checklist

- [ ] Code pushed to GitHub
- [ ] Azure Static Web App created
- [ ] `ANTHROPIC_API_KEY` added to GitHub Secrets
- [ ] `ANTHROPIC_API_KEY` added to Azure Configuration
- [ ] GitHub Actions workflow completed successfully
- [ ] Site is live and accessible

---

## 🔗 Important URLs

- **Azure Portal:** https://portal.azure.com
- **GitHub Repo:** https://github.com/behartless67-a11y/MCPAssessment
- **GitHub Actions:** https://github.com/behartless67-a11y/MCPAssessment/actions
- **Full Guide:** See [AZURE-DEPLOYMENT.md](./AZURE-DEPLOYMENT.md)

---

## 💰 Cost

- **Free Tier:** $0/month (100 GB bandwidth)
- **Anthropic API:** ~$0.05-0.15 per analysis
- **Total:** Pay only for API usage

---

## ❓ Need Help?

See full deployment guide: [AZURE-DEPLOYMENT.md](./AZURE-DEPLOYMENT.md)
