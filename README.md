# Bitespeed Backend Task: Identity Reconciliation

## Tech stack used

- Node.js
- Typescript
- Postgres
- Docker

## To run directly on OS

Run these two commands from separate terminals

```
First run - `yarn compile:watch`
then from second terminal - `yarn dev`
```

## To deploy using Docker

```
chmod +x db/init.sh
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
