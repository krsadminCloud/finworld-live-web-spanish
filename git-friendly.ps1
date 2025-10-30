# @"
# node_modules/
# dist/
# .env
# .DS_Store
# *.log
# "@ | Out-File -Encoding utf8 ".gitignore"

# git add .
# git commit -m "Initial FinWorld Live production commit"


# ===================================================================
# Script: create-gitignore.ps1
# Purpose: Generate a clean .gitignore for Azure Static Web App projects
# Author: KRSTechPro FinWorld
# ===================================================================

# Define the file path
$gitignorePath = ".\.gitignore"

# Define entries to ignore
$ignoreEntries = @"
# ==============================
# Node / Vite / Azure Defaults
# ==============================
node_modules/
dist/
.env
*.log

# Ignore local helper scripts
git-friendly.ps1

# VSCode and IDE settings
.vscode/
.idea/
*.code-workspace

# OS files
.DS_Store
Thumbs.db

# Build artifacts
*.cache
*.temp
*.tmp

# Azure Static Web App temporary files
.azure/
swa-db/

# ==============================
# End of File
# ==============================
"@

# Create or overwrite the file
Set-Content -Path $gitignorePath -Value $ignoreEntries -Encoding UTF8

Write-Host "✅ .gitignore file created/updated successfully at $gitignorePath"
