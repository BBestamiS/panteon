# LEADERBOARD SYSTEM - FULL STACK APPLICATION

**Developer**: Beyazıt Bestami Sarıkaya  
**Email**: bestami980@outlook.com  
**Website**: [bbestamis.com](http://bbestamis.com)  
**LinkedIn**: [linkedin.com/in/beyazıt-bestami-sarıkaya-b016b8173](https://linkedin.com/in/beyazıt-bestami-sarıkaya-b016b8173)  
**Application**: [panteon.bbestamis.com](http://panteon.bbestamis.com)  
**Project Code Repository**: [GitHub Repository](https://github.com/BBestamiS/panteon)  

**Version**: 1.0  
**Date**: November 9, 2024  
**Location**: Ankara  

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Getting Started](#getting-started)
4. [Deployment](#deployment)

---

## 1. Introduction

**Project Overview**  
This project is a full-stack application designed to handle data processing and simulation for a game with ten million players. The system includes real-time data synchronization, efficient caching, and scalable architecture for smooth operations across all modules.

**Tech Stack**  

- **Front-End**: React, Next.js, TypeScript, React-Icons, React Select, React Beautiful DnD
- **Back-End**: Node.js, Express.js, TypeScript, PM2
- **Database & Cache**: MySQL (for secure storage), Redis (for caching and faster access)
- **Server**: Apache, Debian 12, PM2, Byobu

---

## 2. Architecture

### Front-End: `panteon-nextjs-app`

- **Technologies**: TypeScript, Next.js, React, React-Icons, React Select, React Beautiful DnD
- **Description**: A modern, interactive, and user-friendly web application built with TypeScript and Next.js, featuring autocomplete and drag-and-drop functionalities to enhance user experience.

### Back-End

The back-end consists of two primary applications:

1. **`panteon-ts-node-app`**
   - **Purpose**: An API application facilitating data flow between the front-end (`panteon-nextjs-app`) and a central system.
   - **Technologies**: Node.js, Express.js, TypeScript, PM2
   - **Description**: This application manages communication between the front-end and back-end, ensuring smooth data synchronization via Redis for faster response times.

2. **`panteon-ts-standalone-app`**
   - **Purpose**: Generates, processes, and simulates data for a game with ten million players.
   - **Technologies**: Node.js, TypeScript
   - **Description**: Manages large-scale data processing and simulation, consistently interacting with the database and cache to optimize data handling performance.

### Databases

- **MySQL**: Chosen as the primary relational database for secure and persistent data storage.
- **Redis**: Acts as a cache for frequently accessed data, significantly enhancing performance by reducing latency.

### Server

- **Domain**: `panteon.bbestamis.com`
- **Hosting**: AWS (t3.medium instance)
- **OS**: Debian 12
- **Server Technologies**: Apache, HaProxy, PM2, Byobu
- **Description**: The application is hosted on AWS with load balancing managed by HaProxy and web hosting via Apache. PM2 is used for process management to ensure stable and reliable operation.

### Data Flow and Connectivity

- **Front-End to Back-End**: The `panteon-nextjs-app` connects to the back-end through the `panteon-ts-node-app` API, with Redis caching for data synchronization.
- **Back-End Data Processing**: `panteon-ts-standalone-app` generates data for ten million players and caches frequently accessed data in Redis.
- **Database & Cache**: MySQL serves as the primary data storage, while Redis caches frequently accessed data.

---

## 3. Getting Started

### Prerequisites

Ensure the following are installed on your server or local environment:

- Node.js
- npm
- MySQL
- Redis
- TypeScript

### Database Setup

1. Import the SQL files in the following order to establish the database structure:

   - `countries`
   - `weeks`
   - `players`
   - `weekly_earnings`
   - `weekly_earnings_archive`

   Execute the following SQL files in sequence:

   - `leaderboard_db_countries.sql`
   - `leaderboard_db_countries_mock.sql`
   - `leaderboard_db_players.sql`
   - `leaderboard_db_routines.sql`
   - `leaderboard_db_weekly_earnings_archive.sql`
   - `leaderboard_db_weekly_earnings.sql`
   - `leaderboard_db_weeks.sql`

2. Run `leaderboard_db_countries_mock.sql` to populate countries.

3. Execute the stored procedure `CALL InsertMockPlayers()` to create ten million mock players.

### Backend Setup

#### `panteon-ts-node-app`

1. Navigate to the project directory:

   ```bash
   cd project_path/
   ```

2. Install the necessary packages:

```
npm install
```

3. Configure `.env`:

   ```
   PORT=3000
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   ```

4. Build and start the application:

```
npm run build
npm run start
```

#### `panteon-ts-standalone-app`

1. Navigate to the project directory:

   ```
   cd project_path/
   ```

2. Install the necessary packages:

   ```
   npm install
   ```

3. Configure 

   ```
   .env
   ```

   :

   ```
   DB_HOST="***"
   DB_USER="***"
   DB_PASSWORD="***"
   DB_NAME="leaderboard_db"
   REDIS_HOST="127.0.0.1"
   REDIS_PORT="6379"
   ```

4. Build and start the application:

   ```
   npm run build
   npm run start
   ```

### Front-End Setup: `panteon-nextjs-app`

1. Navigate to the project directory:

   ```
   cd project_path/
   ```

2. Install the necessary packages:

   ```
   npm install
   ```

3. Configure `.env` if necessary.

4. Start the front-end application:

   ```
   npm run build
   npm run start
   ```

### Environment Variables

Each application has its own `.env` file for configurations. Make sure to replace placeholders with actual values.

------

## 4. Deployment

### Deployment Environment

- **Platform**: AWS (t3.medium instance)
- **Domain**: `panteon.bbestamis.com`

### CI/CD

The CI/CD process is managed via GitHub. Continuous integration and deployment are handled through GitHub Actions for seamless updates.

For more details, refer to the project code repository: [GitHub Repository](https://github.com/BBestamiS/panteon)

------

This documentation provides a comprehensive setup and deployment guide for the Leaderboard System application. For any issues, please contact the developer at **bestami980@outlook.com**.
