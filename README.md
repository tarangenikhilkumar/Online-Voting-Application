# SecureVote — Online Voting Application

A full-stack, role-based **Online Voting Application** built with **Spring Boot**, **React**, and **MySQL**. SecureVote enforces strict one-voter-one-ballot integrity, decouples voter identity from ballot selections for anonymity, and provides real-time election management, result publishing, and audit logging.

---

## Key Features

- **Role-Based Access Control (RBAC):** Dedicated workspaces and JWT-secured endpoints for **Admins**, **Voters**, and **Candidates**.
- **One Person, One Vote:** Enforced at both the Spring Security/service layer and via database unique constraints.
- **Anonymous Ballots:** Participation tracking and vote storage are separated so individual choices cannot be traced back to voters.
- **Complete Election Lifecycle:** Admins can create/schedule elections, approve or reject candidate nominations, close polls, and publish verified results.
- **Interactive UI & Analytics:** Responsive dark/light theme built with Tailwind CSS, Framer Motion animations, real-time vote tally progress bars, and an Admin Audit Logs viewer.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java, Spring Boot, Spring Security, JWT, Spring Data JPA (Hibernate) |
| **Frontend** | React, Vite, Tailwind CSS, Framer Motion, Axios, Lucide Icons |
| **Database** | MySQL 8 |

---

## Project Structure

```text
online-voting-/
├── online-voting-backend/     # Spring Boot REST API, Security, Entities & Services
└── online-voting-frontend/    # React + Vite SPA (Admin, Voter & Candidate Portals)
