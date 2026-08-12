# Ranz Panel
TypeScript full-stack starter for a Pterodactyl panel store.

Stack: Express + Prisma + PostgreSQL, Next.js + Tailwind, Docker.

Configure Pterodactyl and AksesPG credentials from Admin Settings. Never commit real secrets.

## Auto provisioning
Payment webhook: `POST /api/payments/aksespg/webhook`.
After a successful payment, the backend creates the Pterodactyl application user and server.
Configure Pterodactyl/AksesPG from Admin Settings. The exact AksesPG webhook field names/signature must match the gateway documentation; the adapter accepts common invoice/reference/status fields and should be adjusted if AksesPG uses different names.

Required settings:
- PTERO_URL
- PTERO_API_KEY
- PTERO_NODE_ID
- PTERO_NEST_ID
- PTERO_EGG_ID
- PTERO_LOCATION_ID (optional)
- PTERO_DOCKER_IMAGE / PTERO_STARTUP / PTERO_STARTUP_CMD (optional)
- AKSESPG_BASE_URL
- AKSESPG_API_KEY
- APP_ENCRYPTION_KEY

AksesPG Base URL resmi dari dokumentasi dashboard: `https://sobat.aksespg.qzz.io`.
