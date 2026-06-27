# Cary Grant Clothing — Production Website

Premium e-commerce website for Cary Grant Clothing (CGC), Est. 2002, Barrie, Ontario 🇨🇦

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called "cary-grant-clothing"
3. Enable these services:
   - **Authentication** → Email/Password
   - **Firestore Database** → Start in production mode
   - **Storage** → Start in production mode
4. Go to Project Settings → General → Your apps → Web app
5. Copy your config keys

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local` and fill in your Firebase keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Create Admin Account
In Firebase Console → Authentication → Users → Add User:
- Email: cary@carygrantclothing.com
- Password: (set a strong password)

### 5. Set Up Firestore Rules
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{document} {
      allow read, write: if true;
    }
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /newsletters/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
    match /messages/{document} {
      allow write: if true;
      allow read: if request.auth != null;
    }
  }
}
```

### 6. Set Up Storage Rules
In Firebase Console → Storage → Rules:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 7. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Homepage | / | Hero video, featured products, collections |
| Shop | /shop | All products with filters |
| Product | /product/[id] | Product detail page |
| Cart | /cart | Shopping cart |
| Checkout | /checkout | Multi-step checkout |
| About | /about | Brand story |
| Contact | /contact | Contact form |
| Admin Login | /admin/login | Owner login |
| Admin Dashboard | /admin | Overview stats |
| Admin Products | /admin/products | Add/edit/delete products |
| Admin Orders | /admin/orders | View & manage orders |
| Admin Categories | /admin/categories | Manage categories |

---

## 🔐 Admin Access

The owner can access the admin dashboard at:
```
yourdomain.com/admin
```
Login with the Firebase Authentication credentials you set up.

---

## 🚀 Deployment (Vercel)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

---

## 📞 Brand Info
- **Address:** 54 Dunlop Street West, Main Floor, Barrie, ON
- **Phone:** +1 705-717-1073
- **Email:** cary@carygrantclothing.com
- **Instagram:** @cgclthn
- **Twitter:** @CG021
