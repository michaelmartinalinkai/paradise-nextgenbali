# Paradise NextGen Bali

Luxury real estate website for NGH Bali Property Group.

## Deployment

This site auto-deploys to Vimexx hosting via GitHub Actions.

### Setup GitHub Secrets

Add these secrets in GitHub (Settings → Secrets → Actions):

| Secret Name | Value |
|-------------|-------|
| `FTP_HOST` | Your Vimexx FTP host (e.g., `ftp.yourdomain.com`) |
| `FTP_USER` | Your FTP username |
| `FTP_PASS` | Your FTP password |

### How it works

Every push to `main` branch automatically deploys to Vimexx via FTP.
