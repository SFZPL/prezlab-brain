# Deployment Guide for AI Design Analyzer

## Quick Deploy Options

### 1. **Heroku (Recommended for beginners)**

**Prerequisites:**
- Heroku account
- Git repository
- Heroku CLI installed

**Steps:**
```bash
# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-app-name

# Add environment variables
heroku config:set OPENAI_API_KEY=your_openai_api_key

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open the app
heroku open
```

### 2. **Railway**

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variable: `OPENAI_API_KEY`
4. Deploy automatically

### 3. **Render**

**Steps:**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`
5. Add environment variable: `OPENAI_API_KEY`

## Environment Variables

Set these in your deployment platform:

```bash
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=production
```

## Frontend Deployment

For the React frontend, you have several options:

### 1. **Netlify (Recommended)**

**Steps:**
1. Build the React app:
```bash
cd frontend  # if you separate frontend/backend
npm run build
```

2. Deploy to Netlify:
   - Drag and drop the `build` folder to Netlify
   - Or connect your GitHub repository

3. Update API calls to point to your backend URL:
   - Change `http://localhost:5000` to your deployed backend URL
   - Update `src/components/SlideAnalysis.jsx` and `src/services/fileParser.js`

### 2. **Vercel**

**Steps:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### 3. **GitHub Pages**

**Steps:**
1. Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/your-repo",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

2. Install: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

## Combined Deployment (Backend + Frontend)

### Option 1: Single Platform (Heroku/Railway)

1. Build the React app:
```bash
npm run build
```

2. Copy the `build` folder contents to a `static` folder in your backend
3. Update Flask to serve static files:

```python
# In app.py
from flask import Flask, send_from_directory

@app.route('/')
def serve_frontend():
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)
```

### Option 2: Separate Deployments

1. Deploy backend to Heroku/Railway
2. Deploy frontend to Netlify/Vercel
3. Update frontend API calls to point to backend URL

## Production Checklist

- [ ] Set `FLASK_ENV=production`
- [ ] Set `OPENAI_API_KEY`
- [ ] Update CORS settings for production domain
- [ ] Test file upload limits
- [ ] Monitor memory usage
- [ ] Set up logging
- [ ] Configure error handling
- [ ] Test all features in production

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Update CORS configuration for your domain
2. **File Upload Limits**: Check platform limits (Heroku: 100MB)
3. **Memory Issues**: Monitor with `MemoryManager.check_memory_usage()`
4. **API Key Issues**: Ensure environment variables are set correctly

### Debug Commands:

```bash
# Check Heroku logs
heroku logs --tail

# Check Railway logs
railway logs

# Check Render logs
# Available in dashboard
```

## Scaling Considerations

- **File Size**: Consider using cloud storage (AWS S3) for large files
- **Memory**: Monitor memory usage, consider upgrading dynos
- **Database**: Add PostgreSQL for persistent storage
- **Caching**: Implement Redis for better performance
- **CDN**: Use Cloudflare for static assets

## Security Notes

- Never commit API keys to Git
- Use environment variables for all secrets
- Enable HTTPS in production
- Set up proper CORS policies
- Consider rate limiting for public deployments
