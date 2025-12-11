# Deployment Guide: BDC Messenger

This guide will walk you through deploying your full-stack chat application with the backend on **Render.com** and the frontend on **Vercel.com**.

---

## 📋 Prerequisites

Before you begin, make sure you have:

1. A [GitHub](https://github.com) account with your code pushed to a repository
2. A [Render.com](https://render.com) account (free tier available)
3. A [Vercel.com](https://vercel.com) account (free tier available)
4. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account or other MongoDB hosting service
5. A [Cloudinary](https://cloudinary.com) account for image uploads (free tier available)

---

## 🚀 Part 1: Deploy Backend on Render.com

### Step 1: Prepare Your Backend

Your backend is already configured with the `render.yaml` file. Make sure your code is committed and pushed to GitHub.

### Step 2: Create a New Web Service on Render

1. Log in to [Render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository and branch

### Step 3: Configure the Web Service

Render will auto-detect your `render.yaml` configuration, but verify:

- **Name**: `bdc-messenger-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or your preferred plan)

### Step 4: Add Environment Variables

In the Render dashboard, go to **Environment** section and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render uses port 10000 |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `JWT_SECRET` | (generate secure random string) | Use a strong random string |
| `FRONTEND_URL` | (wait for Vercel URL) | Add after deploying frontend |
| `CLOUDINARY_CLOUD_NAME` | (your Cloudinary cloud name) | From Cloudinary dashboard |
| `CLOUDINARY_API_KEY` | (your Cloudinary API key) | From Cloudinary dashboard |
| `CLOUDINARY_API_SECRET` | (your Cloudinary API secret) | From Cloudinary dashboard |

**Important**: For `FRONTEND_URL`, you'll add this after deploying your frontend to Vercel (e.g., `https://your-app.vercel.app`)

### Step 5: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the deployment to complete (this may take a few minutes)
3. Once deployed, you'll see your backend URL: `https://your-app-name.onrender.com`
4. **Copy this URL** - you'll need it for the frontend configuration

### Step 6: Test Your Backend

Visit `https://your-app-name.onrender.com/api` in your browser. You should see a response from your API.

---

## 🎨 Part 2: Deploy Frontend on Vercel.com

### Step 1: Prepare Your Frontend

Your frontend is already configured with `vercel.json`. Make sure your code is committed and pushed to GitHub.

### Step 2: Create a New Project on Vercel

1. Log in to [Vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Select your repository

### Step 3: Configure the Project

Vercel will auto-detect your Vite configuration. Configure:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 4: Add Environment Variables

In the Vercel project settings, add the environment variable:

| Key | Value | Notes |
|-----|-------|-------|
| `VITE_BACKEND_URL` | `https://your-backend.onrender.com` | Your Render backend URL (without trailing slash) |

**Important**: Use the exact backend URL from Step 5 of Part 1 (without `/api` at the end).

### Step 5: Deploy Frontend

1. Click **"Deploy"**
2. Wait for the deployment to complete (usually takes 1-2 minutes)
3. Once deployed, you'll see your frontend URL: `https://your-app.vercel.app`
4. **Copy this URL**

---

## 🔗 Part 3: Connect Frontend and Backend

### Step 1: Update Backend Environment Variables

1. Go back to your Render.com dashboard
2. Navigate to your backend web service
3. Go to **Environment** section
4. Update the `FRONTEND_URL` variable with your Vercel URL:
   - Value: `https://your-app.vercel.app`
5. Save the changes
6. Render will automatically redeploy your backend

### Step 2: Verify CORS Configuration

Make sure your backend's CORS configuration accepts your frontend URL. The code is already configured in `backend/src/index.js` and `backend/src/lib/socket.js` to use the `FRONTEND_URL` environment variable.

---

## ✅ Part 4: Test Your Deployment

### Step 1: Test Authentication

1. Visit your Vercel frontend URL
2. Try to sign up for a new account
3. Verify you can log in
4. Check that authentication persists on page refresh

### Step 2: Test Real-time Features

1. Open your app in two different browsers or incognito windows
2. Log in with different accounts
3. Send messages between users
4. Verify real-time message delivery works
5. Test online/offline status indicators

### Step 3: Test File Uploads

1. Try updating your profile picture
2. Send messages with image attachments
3. Verify images load correctly from Cloudinary

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not connecting to MongoDB
- **Solution**: Check your `MONGODB_URI` in Render environment variables
- Make sure your MongoDB Atlas cluster allows connections from all IPs (0.0.0.0/0) or specifically from Render's IP range

**Problem**: CORS errors in browser console
- **Solution**: Verify `FRONTEND_URL` is set correctly in Render (should match your Vercel URL exactly)
- Make sure there's no trailing slash in `FRONTEND_URL`

**Problem**: Backend keeps spinning down (Render free tier)
- **Solution**: Render's free tier spins down after 15 minutes of inactivity. The first request after spin-down will take longer. Consider upgrading to a paid plan for production.

### Frontend Issues

**Problem**: "Network Error" or "Cannot connect to backend"
- **Solution**: Verify `VITE_BACKEND_URL` is set correctly in Vercel (should match your Render URL)
- Check browser console for CORS errors
- Make sure backend is deployed and running

**Problem**: Authentication not persisting
- **Solution**: Check that `withCredentials: true` is set in axios configuration
- Verify cookies are being set (check browser dev tools → Application → Cookies)
- Make sure `FRONTEND_URL` matches your actual Vercel domain

**Problem**: Socket.io connection fails
- **Solution**: Check that Socket.io CORS is configured correctly in `backend/src/lib/socket.js`
- Verify WebSocket connections aren't being blocked by a firewall or proxy

### Image Upload Issues

**Problem**: Image uploads fail
- **Solution**: Verify all Cloudinary environment variables are set correctly in Render
- Check Cloudinary dashboard for usage limits (free tier has limits)
- Verify image size isn't exceeding limits (backend is configured for 10mb max)

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to your repository
2. **Use strong JWT secrets** - generate random strings at least 32 characters long
3. **Keep environment variables secure** - don't share them publicly
4. **Enable HTTPS** - Both Render and Vercel provide HTTPS by default
5. **Regularly update dependencies** - Run `npm audit` and fix vulnerabilities
6. **Monitor your logs** - Check Render and Vercel logs for errors or suspicious activity

---

## 📊 Monitoring and Logs

### Render Logs

View backend logs in Render:
1. Go to your web service dashboard
2. Click on **"Logs"** tab
3. Monitor real-time logs for errors or issues

### Vercel Logs

View frontend deployment logs in Vercel:
1. Go to your project dashboard
2. Click on a deployment
3. View build logs and runtime logs

---

## 🔄 Redeployment

### Backend Updates

1. Push changes to your GitHub repository
2. Render automatically detects changes and redeploys
3. Or manually redeploy from Render dashboard

### Frontend Updates

1. Push changes to your GitHub repository
2. Vercel automatically detects changes and redeploys
3. Or manually redeploy from Vercel dashboard

---

## 💰 Cost Considerations

### Free Tier Limits

**Render.com Free Tier:**
- Backend spins down after 15 minutes of inactivity
- 750 hours per month
- Shared CPU
- 512 MB RAM

**Vercel.com Free Tier:**
- Unlimited personal projects
- 100 GB bandwidth per month
- Serverless functions with 10-second timeout

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared cluster
- No credit card required

**Cloudinary Free Tier:**
- 25 monthly credits
- 25 GB storage
- 25 GB bandwidth

### Upgrade Paths

Consider upgrading if you need:
- Backend always running (Render paid plans start at $7/month)
- More bandwidth or storage (Vercel Pro at $20/month)
- Larger database (MongoDB Atlas paid plans)
- More image processing (Cloudinary paid plans)

---

## 🎉 Success!

Your BDC Messenger application should now be fully deployed and running! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Share your frontend URL with users to start chatting!

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Socket.io Documentation](https://socket.io/docs/v4/)

---

## 🆘 Need Help?

If you encounter issues not covered in this guide:

1. Check the logs on Render and Vercel
2. Review the browser console for errors
3. Verify all environment variables are set correctly
4. Test your backend API endpoints directly using Postman or curl
5. Check that your MongoDB and Cloudinary services are running

---

**Happy Deploying! 🚀**
