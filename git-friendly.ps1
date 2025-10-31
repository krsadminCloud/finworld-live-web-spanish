# # @"
# # node_modules/
# # dist/
# # .env
# # .DS_Store
# # *.log
# # "@ | Out-File -Encoding utf8 ".gitignore"

# # git add .
# # git commit -m "Initial FinWorld Live production commit"


# # ===================================================================
# # Script: create-gitignore.ps1
# # Purpose: Generate a clean .gitignore for Azure Static Web App projects
# # Author: KRSTechPro FinWorld
# # ===================================================================

# # Define the file path
# $gitignorePath = ".\.gitignore"

# # Define entries to ignore
# $ignoreEntries = @"
# # ==============================
# # Node / Vite / Azure Defaults
# # ==============================
# node_modules/
# dist/
# .env
# *.log

# # Ignore local helper scripts
# git-friendly.ps1

# # VSCode and IDE settings
# .vscode/
# .idea/
# *.code-workspace

# # OS files
# .DS_Store
# Thumbs.db

# # Build artifacts
# *.cache
# *.temp
# *.tmp

# # Azure Static Web App temporary files
# .azure/
# swa-db/

# # ==============================
# # End of File
# # ==============================
# "@

# # Create or overwrite the file
# Set-Content -Path $gitignorePath -Value $ignoreEntries -Encoding UTF8

# Write-Host "✅ .gitignore file created/updated successfully at $gitignorePath"
# az staticwebapp secrets list --name finworld-live-website-prd-eus --query "properties.apiKey"
# az staticwebapp secrets list `
#   --name finworld-live-website-prd-eus `
#   --resource-group rg-finword-live-prd-eus `
#   --query "properties.apiKey" `
#   --output tsv
# 9eea79e97d70b0e998c60240aa0333be73b504bf3407e4673ca3871d55262c8403-5cee6b18-a367-4e06-9661-0d9bcc7b81b800f180504c44e30f
# az staticwebapp secrets list `
#   --name finworld-live-website-prd-eus `
#   --resource-group rg-finword-live-prd-eus `
#   --query "properties.apiKey" `
#   -o tsv
# 9eea79e97d70b0e998c60240aa0333be73b504bf3407e4673ca3871d55262c8403-5cee6b18-a367-4e06-9661-0d9bcc7b81b800f180504c44e30f
# 9eea79e97d70b0e998c60240aa0333be73b504bf3407e4673ca3871d55262c8403-5cee6b18-a367-4e06-9661-0d9bcc7b81b800f180504c44e30f
az staticwebapp secrets regenerate `
  --name finworld-live-website-prd-eus `
  --resource-group rg-finword-live-prd-eus `
  --query "properties.apiKey" -o tsv
