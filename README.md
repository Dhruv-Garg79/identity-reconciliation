# Bitespeed Backend Task: Identity Reconciliation

## Tech stack used

- Node.js v18.14.0
- Typescript
- Postgres
- Docker

## To run using docker

```
chmod +x db/init.sh
docker-compose build --no-cache
docker-compose up
```

## API

Endpoint: `/identify`

Request Format:

```tsx
{
	"email"?: string,
	"phoneNumber"?: number
}
```

Response Format:

```tsx
	{
		"contact":{
			"primaryContatctId": number,
			"emails": string[], // first element being email of primary contact
			"phoneNumbers": string[], // first element being phoneNumber of primary contact
			"secondaryContactIds": number[] // Array of all Contact IDs that are "secondary" to the primary contact
		}
	}
```

My Resume Link - https://drive.google.com/file/d/10WdE5BJKVAz1TG9PMG6snosZEvapHuar/view?usp=sharing
