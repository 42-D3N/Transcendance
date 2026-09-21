*This project has been created as part of the 42 curriculum by tle-pape, macolomi, aeherve, rdestruh.*


# Description

## Project Overview

Transcendance is the last project of 42 curriculum.
This is a group web project consisting of an open-source website. Members are free to create one or more applications.

## Goals

The goal of the project is to :
- Creating a website.
- Create a Pong
- 

The application provides users with :
- Pong game including multiplayer and leaderboard.
- 

---

# Team Information

## Célen Colomines (Célen)
- Role(s) : Project Owner, Developer
- Responsibilities :

## Raphaël Destruhaut (raporius)
- Role(s) : Tech lead, Architect, Developer
- Responsibilities :

## Aedan Herve (Dadoune)
- Role(s) : ???, Developer
- Responsibilities :

## Thomas Le Pape (D3N)
- Role(s) : Project Manager, Frontend & Backend Developer
- Responsibilities :

---

# Technical Stack

## Frontend

Technologies and frameworks used :
- 

### Frontend Choice Justification

Explain why these technologies were selected :

## Backend

Technologies and frameworks used :

### Backend Choice Justification

Explain why these technologies were selected :

## Database

Database system used :

### Database Choice Justification

Explain :

## Other Technologies

- Docker
- GitHub Actions

---

# Database Schema

## Overview

`Describe the global database architecture and organization.`

## Tables / Collections

### Users
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| email | VARCHAR | User email |
| password_hash | TEXT | Encrypted password |
| created_at | TIMESTAMP | Creation date |

### Projects
| Field | Type | Description |
|---|---|---|
| id | UUID | Primary key |
| title | VARCHAR | Project title |
| owner_id | UUID | Linked user |
| created_at | TIMESTAMP | Creation date |

## Relationships

- One user can own multiple projects
- One project can contain multiple tasks
- One task can belong to one project

## Schema Visualization

Insert :
- ERD image
- Database diagram
- Link to schema documentation

---

# Instructions

## Prerequisites

Required software and tools :
- Git

## Environment Configuration

Create a .env file and configure :
- Database URL
- API keys
- Authentication secrets
- Application ports

Example variables:
- DATABASE_URL
- JWT_SECRET
- API_KEY
- PORT

## Installation

### Clone the repository

1. Clone the project
2. Move into the project folder

### Install dependencies

Frontend:
- Install frontend dependencies

Backend:
- Install backend dependencies

## Database Setup

1. Create the database
2. Run migrations
3. Seed initial data if needed

## Running the Project

### Development Mode

Frontend:
- Start development server

Backend:
- Start API server

### Production Mode

1. Build frontend
2. Build backend
3. Deploy services

## Testing

Run:
- Unit tests
- Integration tests
- End-to-end tests

## Linting and Formatting

Explain:
- Lint commands
- Formatting tools
- Code quality checks

---

# Features List

## Feature1
- Description :
- Team Members :

## Feature2
- Description :
- Team Members :

---

# Modules

## Major Modules

### Frameworks
- Type: Major Module
- Points : 2
- Description :
  - Use a framework for both the frontend and backend.
- Justification :
  - We wanted to use frameworks for both so we got this.
- Implementation :
  - ?
- Team Members :
  - ?


### First Game
- Type: Major Module
- Points : 2
- Description :
  - Implement a complete web-based game where users can play against each
other.
- Justification :
  - We wanted to make a game so we done it.
- Implementation :
  - ?
- Team Members :
  - ?


### LAN Game
- Type: Major Module
- Points : 2
- Description :
  - Remote players — Enable two players on separate computers to play the
same game in real-time.
- Justification :
  - We wanted to use multiple computer to play together.
- Implementation :
  - ?
- Team Members :
  - ?


### 4 Players Gamemode
- Type: Major Module
- Points : 2
- Description :
  - Multiplayer game (more than two players).
- Justification :
  - We wanted to make a 4 players game.
- Implementation :
  - ?
- Team Members :
  - ?


### Second Game
- Type: Major Module
- Points : 2
- Description :
  - Add another game with user history and matchmaking.
- Justification :
  - We wanted to add a second game.
- Implementation :
  - ?
- Team Members :
  - ?


### User Management
- Type: Major Module
- Points : 2
- Description :
  - Standard user management and authentication.
- Justification :
  - We wanted at least a basic user management system.
- Implementation :
  - ?
- Team Members :
  - ?


### Game customization
- Type: Major Module
- Points : 2
- Description :
  - Game customization options.
- Justification :
  - We wanted to add some game customization options.
- Implementation :
  - ?
- Team Members :
  - ?


### Backend as microservices
- Type: Major Module
- Points : 2
- Description :
  - Backend as microservices.
- Justification :
  - We wanted to have a backend designed as microservices
- Implementation :
  - ?
- Team Members :
  - ?


### Chat
- Type: Major Module
- Points : 2
- Description :
  - Allow users to interact with other users.
- Justification :
  - A good game cannot be without chat.
- Implementation :
  - ?
- Team Members :
  - ?


### AI Opponent
- Type: Major Module
- Points : 2
- Description :
  - Introduce an AI Opponent for games.
- Justification :
  - We wanted an AI to play solo
- Implementation :
  - ?
- Team Members :
  - ?


<!-- ### 
- Type: Major Module
- Points : 2
- Description :
  - 
- Justification :
  - 
- Implementation :
  - 
- Team Members :
  -  -->

## Minor Modules

### Stats & History
- Type: Minor Module
- Points : 1
- Description :
  - Game statistics and match history (requires a game module).
- Justification :
  - We needed this module to add a second game.
- Implementation :
  - ?
- Team Members :
  - ?


### ORM for database
- Type: Minor Module
- Points : 1
- Description :
  - Use an ORM for the database.
- Justification :
  - ?
- Implementation :
  - ?
- Team Members :
  - ?

### Gamification
- Type: Minor Module
- Points : 1
- Description :
  - A gamification system to reward users for their actions.
- Justification :
  - POINTS
- Implementation :
  - ?
- Team Members :
  - ?


<!-- ### 
- Type: Minor Module
- Points : 1
- Description :
  - 
- Justification :
  - 
- Implementation :
  - 
- Team Members :
  -  -->

## Total Points

| Module | Type | Points |
|---|---|---|
| [Frameworks](#frameworks) | Major | 2 |
| [First Game](#first-game) | Major | 2 |
| [LAN Game](#lan-game) | Major | 2 |
| [4 Players Gamemode](#4-players-gamemode) | Major | 2 |
| [Second Game](#second-game) | Major | 2 |
| [User Management](#user-management) | Major | 2 |
| [Game customization](#game-customization) | Major | 2 |
| [Backend as microservices](#backend-as-microservices) | Major | 2 |
| [Chat](#chat) | Major | 2 |
| [AI Opponent](#ai-opponent) | Major | 2 |
| [Stats & History](#stats--history) | Minor | 1 |
| [ORM for database](#orm-for-database) | Minor | 1 |
| [Gamification](#gamification) | Minor | 1 |
| Module M | Major | 2 |
| Module m | Minor | 1 |

Total: 23 Points

---

# Project Management

## Organization Method

Describe:

## Project Management Tools


## Communication Channels

- Discord

## Git Workflow

Explain:
- Branching strategy
- Pull request process
- Code review policy
- Merge strategy

---

# Individual Contributions

## Member 1
### Contributions

### Challenges Faced

---

## Member 2
### Contributions

### Challenges Faced

---

## Member 3
### Contributions

### Challenges Faced

---

## Member 4
### Contributions

### Challenges Faced

---

# Resources

## Documentation


## Tutorials and Articles


## Learning Resources

---

# License

---

# Credits










1 : 3D fun simple

2 : Standard user management (missing online status)

2 : Fullstack
2 : Backend as microservices
2 : Chat + profile + friend
2 : Public API (GET POST PUT DELETE)
2 : Real-time websocket
2 : AI Opponent
2 : GAME
2 : remote player
1 : File upload and management system
1 : ORM for the database
1 : Support for additionnal browsers
1 : SSR
1 : (Custom) Shop + Wallet system + skin system


Total : 21/19
