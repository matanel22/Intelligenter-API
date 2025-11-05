# Project Submission Guide for Testers

## 📧 **Sending via Email as ZIP File**

### What to Include in the ZIP
```
Intelligenter-API/
├── src/                     # ✅ Include - Application source code
├── migrations/              # ✅ Include - Database migrations
├── package.json            # ✅ Include - Dependencies
├── package-lock.json       # ✅ Include - Lock file
├── tsconfig.json          # ✅ Include - TypeScript config
├── knexfile.cjs           # ✅ Include - Database config
├── docker-compose.yml     # ✅ Include - Docker orchestration
├── dockerfile             # ✅ Include - Container build
├── .env.template          # ✅ Include - Environment template
├── DOCKER-COMPOSE-SETUP.md # ✅ Include - Setup instructions
├── README.md              # ✅ Include - Project documentation
└── SUBMISSION-GUIDE.md    # ✅ Include - This file
```

### What to EXCLUDE from ZIP
```
❌ .env                    # Contains your secrets
❌ node_modules/           # Large, can be reinstalled
❌ dist/                   # Build output, will be regenerated
❌ .git/                   # Version control (unless requested)
❌ docker-compose.override.yml # Local overrides
❌ *.log                   # Log files
❌ .DS_Store              # macOS system files
❌ Thumbs.db              # Windows system files
```

## 📋 **Pre-Submission Checklist**

### 1. Clean the Project
```powershell
# Remove build artifacts and dependencies
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item *.log -ErrorAction SilentlyContinue
```

### 2. Verify Environment Template
- ✅ Check `.env.template` has placeholder values
- ✅ Ensure no real secrets in any committed files
- ✅ Verify `docker-compose.yml` uses environment variables

### 3. Test Instructions Work
```powershell
# Quick verification (optional but recommended)
docker-compose down -v
docker-compose up -d
# Follow DOCKER-COMPOSE-SETUP.md steps
```

## 📦 **Creating the ZIP File**

### Option 1: Using PowerShell
```powershell
# Navigate to parent directory
cd C:\Github

# Create ZIP excluding unwanted files
$exclude = @('node_modules', 'dist', '.git', '.env', '*.log')
Compress-Archive -Path "Intelligenter-API\*" -DestinationPath "Intelligenter-API-Submission.zip" -Force

# Alternative: More selective approach
$include = @(
    'src',
    'migrations', 
    'package.json',
    'package-lock.json',
    'tsconfig.json',
    'knexfile.cjs',
    'docker-compose.yml',
    'dockerfile',
    '.env.template',
    '*.md'
)
# Then compress only these items
```

### Option 2: Using File Explorer
1. Select the project folder
2. Right-click → "Send to" → "Compressed folder"
3. **IMPORTANT**: Open the ZIP and manually remove:
   - `node_modules/` folder
   - `dist/` folder  
   - `.env` file (if present)
   - Any `.log` files

### Option 3: Using 7-Zip (if installed)
```powershell
# Create ZIP with exclusions
7z a "Intelligenter-API-Submission.zip" "Intelligenter-API\*" -x!node_modules -x!dist -x!.env -x!*.log -x!.git
```

## 📧 **Email Template**

```
Subject: Docker Compose API Project Submission - [Your Name]

Dear [Tester Name],

Please find attached the Intelligenter API project for testing.

Project Overview:
- Node.js/TypeScript API with domain analysis functionality
- PostgreSQL database with Redis caching
- Fully containerized with Docker Compose
- Includes VirusTotal and WHOIS integration

Setup Instructions:
1. Extract the ZIP file
2. Follow the steps in DOCKER-COMPOSE-SETUP.md
3. The setup requires Docker and Docker Compose

Key Features to Test:
- Health endpoint: GET /health
- Domain analysis: POST /api/domains/post
- Domain retrieval: GET /api/domains/get

Notes:
- All sensitive data has been removed from docker-compose.yml
- Use .env.template to create your .env file
- Default setup uses PostgreSQL 16 and Redis 7

Please let me know if you encounter any issues during setup.

Best regards,
[Your Name]
```

## 🔍 **Final Verification**

Before sending, ensure:
- ✅ ZIP file size is reasonable (should be < 50MB without node_modules)
- ✅ No `.env` file with real secrets included
- ✅ `DOCKER-COMPOSE-SETUP.md` has clear instructions
- ✅ All necessary source files are present
- ✅ Docker Compose file uses environment variables

## 🚀 **Alternative: GitHub Repository**

Instead of ZIP, consider:
1. Push to a private GitHub repository
2. Add tester as collaborator
3. They can clone directly
4. Easier for ongoing feedback

```powershell
# If using GitHub
git add .
git commit -m "Prepare for tester submission"
git push origin main
```

## 📝 **Quick Size Check**
```powershell
# Check ZIP file size before sending
Get-ChildItem "Intelligenter-API-Submission.zip" | Select-Object Name, @{Name="Size(MB)";Expression={[math]::Round($_.Length/1MB,2)}}
```

The ideal submission ZIP should be **5-20MB** without node_modules and build artifacts.