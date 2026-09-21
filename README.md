*This project has been created as part of the 42 curriculum by tle-pape, macolomi, aeherve, rdestruh.*

# ft_transcendance

This project was created as part of the 42 curriculum by tle-pape, macolomi, aeherve, and rdestruh.

## Description

Transcendance is the last project of 42 curriculum. This is a group web project consisting of an open-source website. Members are free to create one or more applications.

### Goal

- Real-time Pong with remote multiplayer support.
- AI opponent for solo play.
- Chat, profiles, and friends management.
- Shop, wallet, and cosmetic skin customization.
- Match history and player statistics.
- Separate services for the website, API, game server, and chat server.


## Instructions

### Prerequisites

- Docker.
- Make.

### Environment Configuration

Copy the provided example files and replace value inside with valid values before starting the project:

```bash
cp srcs/database/.env.example srcs/database/.env
cp srcs/website/srcs/.env.example srcs/website/srcs/.env
cp srcs/api/srcs/.env.example srcs/api/srcs/.env
cp srcs/chat-server/srcs/.env.example srcs/chat-server/srcs/.env
cp srcs/game-server/srcs/.env.example srcs/game-server/srcs/.env
```
If multiple `.env` have the same field, use the same value.

Required variables by service:

- `srcs/database/.env`
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `ADMIN_USERNAME`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
- `srcs/website/srcs/.env`
  - `DATABASE_URL`
  - `SECRET_KEY_JWT`
- `srcs/api/srcs/.env`
  - `DATABASE_URL`
  - `ADMIN_USERNAME`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
- `srcs/chat-server/srcs/.env`
  - `DATABASE_URL`
  - `SECRET_KEY_JWT`
- `srcs/game-server/srcs/.env`
  - `DATABASE_URL`

`DATABASE_URL` must point to the PostgreSQL instance used by the project. A typical format is:

```text
postgres://user:password@host:port/database
user is `POSTGRES_USER`
password is `POSTGRES_PASSWORD`
database is `POSTGRES_DB`
```

`SECRET_KEY_JWT` must be the same in every .env that contain it.
It must be at least 32 character long.


### Installation

1. Clone the repository.
2. Create the `.env` files from the examples and fill in the values.
3. Start the development stack.

### Run the Project

The main development command is:

```bash
make up
```

This runs the Docker Compose development stack with watch mode.

Useful companion commands:

```bash
make down
make re
make fclean
```

Once the stack is running, open:

- `https://localhost:5000` for the main application.
- `https://localhost:4040` for Adminer.

## Team Information

| Member | Role(s) | Responsibilities |
|---|---|---|
| Thomas Le Pape (tle-pape) | Project Manager, Frontend & Backend Game Developer | Designed and implemented the Pong game flow, gameplay integration, and the game-related front-end work. |
| Célen Colomines (macolomi) | Project Owner, API Developer, Frontend & Backend Developer | Worked on the API, shop, wallet, and database-related features. |
| Aedan Herve (aeherve) | Frontend & Backend Developer | Worked on authentication, profiles, friends management, and user management. |
| Raphaël Destruhaut (rdestruh) | Tech Lead, Architect, Developer | Worked on the infrastructure and chat service. |

## Project Management

The team split the work by service and by feature area, then synchronized progress through regular Discord conversations and in-person meetings. Each member focused on the parts they owned most directly, which made it easier to work in parallel across the website, API, chat service, and game server.

### Tools Used

- Discord for day-to-day communication.
- In-person meetings for larger decisions and coordination.
- Git for collaboration and integration.

## Technical Stack

### Frontend

- SvelteKit.
- TypeScript.
- Tailwind CSS.
- Vite.
- Babylon.js for the 3D loading scene.

### Frontend Justification

SvelteKit was chosen because it provides a full-stack framework with routing, server-side rendering, and a good developer experience for a compact project. Tailwind CSS made it faster to build a consistent UI, and TypeScript helped keep the front-end code safe while integrating real-time game logic.

### Backend

- Express for the main API.
- Fastify for the chat and game microservices.
- WebSockets for real-time communication.
- JWT-based authentication.

### Backend Justification

Express was used for the main API because it is simple and familiar, while Fastify was a good fit for lightweight websocket services. WebSockets were essential for the game and chat features because both need live, bidirectional updates between clients and servers.

### Database

- PostgreSQL.
- Drizzle ORM.

### Database Justification

PostgreSQL was selected because it is reliable, widely used, and well suited to relational data such as users, friends, matches, inventory, and chat history. Drizzle ORM was chosen to keep the schema close to the code and to benefit from type-safe queries.

### Other Technologies

- Docker and Docker Compose for service orchestration.
- Caddy as reverse proxy.
- Adminer for database administration.
- bcrypt / bcryptjs for password handling.
- `ws` and `@fastify/websocket` for websocket transport.

## Database Schema

The database is organized around user accounts, social features, the shop, and match history.

### Main Tables with types

| Table | Fields (with data types) | Primary Key | Description |
|---|---|---|---|
| `users` | `id: serial`, `username: varchar(128)`, `email: varchar(128)`, `password: text`, `privateAcc: boolean`, `wins: integer`, `losses: integer`, `matches: integer`, `wallet: integer`, `icon: varchar(128)`, `code: boolean`, `skin_rac: integer`, `skin_ball: integer`, `online_status: boolean` | `id` | Stores the main user profile, authentication data, statistics, wallet, avatar, and cosmetic selections. |
| `friends` | `user1: integer`, `user2: integer`, `isaccepted: boolean` | `user1`, `user2` | Stores friend relationships with a composite primary key on (`user1`, `user2`). |
| `matches` | `id: serial`, `user1: integer`, `user1Pseudo: varchar(128)`, `user1EloChange: integer`, `user2: integer`, `user2Pseudo: varchar(128)`, `user2EloChange: integer`, `user1Score: integer`, `user2Score: integer`, `idBall1: integer`, `idBall2: integer`, `skinRac1: integer`, `skinRac2: integer`, `date: timestamp`, `winner: integer` | `id` | Stores completed matches, scores, ELO changes, and the cosmetics used during the match. |
| `inventory` | `user: integer`, `product: integer`, `own: boolean` | `user`, `product` | Links users to shop items they own (composite primary key on `user` + `product`). |
| `shop` | `id: serial`, `name: varchar(128)`, `price: integer` | `id` | Stores the available shop items. |
| `api_users` | `user: integer`, `role: varchar(128)`, `secret_key: varchar(64)` | `user` | Stores API-related user access information. |
| `chat` | `id: serial`, `content: text`, `author: integer`, `dest: integer`, `timestamp: timestamp` | `id` | Stores direct chat messages between users. |

### Relationships

- `friends.user1` and `friends.user2` reference `users.id`.
- `matches.user1`, `matches.user2`, and `matches.winner` reference `users.id`.
- `inventory.user` references `users.id` and `inventory.product` references `shop.id`.
- `users.skin_rac` and `users.skin_ball` reference `shop.id`.
- `matches.idBall1`, `matches.idBall2`, `matches.skinRac1`, and `matches.skinRac2` reference `shop.id`.
- `chat.author` and `chat.dest` reference `users.id`.

The schema diagram is also available in `dbb.drawio`.

## Features List

| Feature | Team Member(s) | Description |
|---|---|---|
| Pong game | Thomas Le Pape | Implemented the main real-time game flow, gameplay rendering, and input handling. |
| Remote multiplayer | Thomas Le Pape, Raphaël Destruhaut | Enabled players on different machines to join the same live match. |
| AI opponent | Thomas Le Pape | Added a solo mode with AI behavior, reaction time, and prediction. |
| Chat system | Raphaël Destruhaut | Implemented the chat service and real-time message exchange. |
| User profiles | Aedan Herve | Built the profile-related user experience and user data integration. |
| Friends management | Aedan Herve | Implemented friend relations and acceptance flow. |
| Authentication and user management | Aedan Herve, Raphaël Destruhaut | Added JWT-based authentication and account handling. |
| Shop, wallet, and skins | Célen Colomines | Implemented the shop flow, wallet system, and cosmetic customization. |
| Public API | Célen Colomines | Built the API layer for database and user-facing operations. |
| Match history and stats | Thomas Le Pape, Célen Colomines | Stored and exposed match results and player statistics. |

## Modules

| Module | Type | Points | Justification | Implementation | Team Member(s) |
|---|---|---:|---|---|---|
| Frameworks | Major | 2 | The project is built with full-stack frameworks on both the client and service side. | SvelteKit powers the website, while Express and Fastify power the backend services. | All team members |
| Backend as microservices | Major | 2 | The architecture is cleaner when services can be isolated and restarted independently. | The app is split into multiple Dockerized services: website, API, chat server, game server, and database. | Raphaël Destruhaut, Thomas Le Pape |
| Allow users to interact with other users | Major | 2 | Social interaction is a core part of the platform. | Chat, profiles, and friends are implemented as separate but connected features. | Raphaël Destruhaut, Aedan Herve |
| Public API | Major | 2 | A public API makes the database and user operations easier to integrate. | The API service exposes the backend logic and database actions. | Célen Colomines |
| Real-time features using WebSockets | Major | 2 | The game and chat both require live updates. | WebSockets are used for game inputs, state updates, and chat messages. | Raphaël Destruhaut, Thomas Le Pape |
| First game | Major | 2 | The core deliverable is a complete web-based game. | Pong is implemented as a real-time, server-authoritative game. | Thomas Le Pape |
| Remote players | Major | 2 | Players must be able to play from separate machines. | The game server synchronizes both clients over the network. | Thomas Le Pape, Raphaël Destruhaut |
| AI Opponent | Major | 2 | Solo gameplay adds replay value and supports offline play. | The AI predicts ball trajectories and uses reaction timing. | Thomas Le Pape |
| Standard user management and authentication | Major | 2 | Accounts are needed for profiles, chat, and the game economy. | JWT authentication and user account management are handled in the backend. | Aedan Herve, Raphaël Destruhaut |
| Game cosmetic | Major | 2 | Cosmetic customization makes the game feel more personal. | A shop, wallet, racket skins, and ball skins are available to the player. | Célen Colomines, Thomas Le Pape |
| File upload and management system | Minor | 1 | Avatars and user assets require file handling. | User image assets are stored and linked to profile data. | Aedan Herve |
| ORM for the database | Minor | 1 | An ORM keeps the schema and queries consistent. | Drizzle is used across the services for typed queries and schema management. | Célen Colomines, Raphaël Destruhaut |
| Support for additional browsers | Minor | 1 | The site was checked to avoid browser-specific issues. | The front-end was validated with browser compatibility in mind. | All team members |
| SSR | Minor | 1 | Server-side rendering improves the initial page load experience. | SvelteKit renders the website with SSR support. | Sveltekit |
| Simple 3D | Minor | 1 | A small 3D scene adds polish and variety. | Babylon.js is used for the loading/preview screen. | Célen Colomines |

**Total: 25 points on 19**

## Individual Contributions

### Thomas Le Pape

- Implemented the Pong gameplay loop, client interactions, and responsive controls.
- Worked on the real-time gameplay UI, ready checks, and cosmetic integration.
- Contributed to the AI opponent and the remote match flow.

Challenges:

- Keeping the game state synchronized between the front-end and the game server.
- Making AI working and human-like.
- Making the mobile controls responsive without breaking desktop gameplay.

### Célen Colomines

- Implemented the API layer.
- Built the shop, wallet, and cosmetic item flow.
- Worked on database-related features.

Challenges:

- Making the shop and customization flow fit cleanly with the rest of the app.
- Make the routes secured.
- Gracefully manage JWT Encryption with secret key.

### Aedan Herve

- Implemented authentication and user management.
- Built the profile and friends features.
- Integrated user-facing account data with the database.

Challenges:

- Gracefully managing JWT token creation, modification and deletion.
- Making a user-friendly profile management.

### Raphaël Destruhaut

- Worked on the infrastructure and service architecture.
- Implemented the chat service.
- Contributed to user-management-related backend work.

Challenges:

- Create a layout that lives up to his ambitions.
- Bypass the limitation of the reverse-proxy.

## Resources

### Documentation

- [SvelteKit](https://svelte.dev/docs/kit/introduction)
- [Svelte](https://svelte.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs/installation/using-vite)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [Fastify](https://fastify.dev/docs/latest/)
- [WebSocket reference](https://github.com/websockets/ws/blob/master/doc/ws.md)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Caddy documentation](https://caddyserver.com/docs/)
- [PostgreSQL documentation](https://www.postgresql.org/docs/)
- [Docker documentation](https://docs.docker.com/)
- [Babylon.js documentation](https://doc.babylonjs.com/)
- [Docker documentation](https://docs.docker.com/)

## Credits

jguelen general help with the subject and documentation.

tchampio for debugging help.

Wendy Asmatico for the help.

marcheva for being Juda.

Thank you to everyone who supported us emotionally. <3
