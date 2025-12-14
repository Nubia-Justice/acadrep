# AcadReport User Manual

Welcome to **AcadReport**, your offline-first solution for managing school academic records. This manual will guide you through installing, setting up, and using the application to manage classes, pupils, and marks effectively.

## Table of Contents
1. [Introduction](#introduction)
2. [Installation & Launch](#installation--launch)
3. [Getting Started](#getting-started)
    - [School Configuration](#school-configuration)
4. [Feature Guide](#feature-guide)
    - [Class Management](#class-management)
    - [Subject Management](#subject-management)
    - [Pupil Management](#pupil-management)
    - [Marks Entry](#marks-entry)
5. [Data & Privacy](#data--privacy)

---

## Introduction
AcadReport is designed to work seamlessly without a constant internet connection. It stores all data locally on your device using IndexedDB, ensuring that your work is saved even if you go offline. It allows you to:
- Configure school details and academic years.
- Manage classes and their specific subjects.
- Maintain a registry of pupils.
- Record and update marks efficiently.

## Installation & Launch

### Prerequisites
- Ensure you have **Node.js** installed on your computer.

### Steps to Open
1.  **Open Terminal**: Navigate to the `AcadRep` folder.
2.  **Install Dependencies** (First time only):
    ```bash
    npm install
    ```
3.  **Start the Application**:
    ```bash
    npm run dev
    ```
4.  **Access in Browser**:
    - The terminal will show a local URL (e.g., `http://localhost:5173`).
    - Open your web browser (Chrome, Firefox, Edge) and enter that address.

---

## Getting Started

### School Configuration
Upon first launch, you should set up your school's identity.
1.  Navigate to **School Setup** from the sidebar or dashboard.
2.  **School Name**: Enter the full name of your institution.
3.  **Academic Year**: Specify the current year (e.g., "2024-2025").
4.  **Current Term**: Select the active term.
5.  **Logo**: Upload your school's logo (PNG or JPG). This will appear on reports.
6.  Click **Save Configuration**.

---

## Feature Guide

### Class Management
Before adding students, you must define the classes in your school.
1.  Go to **Classes** in the sidebar.
2.  **Add Class**: Click "Add New Class".
    - **Name**: e.g., "Class 1", "Grade 5".
    - **Level**: A number representing the hierarchy (1 for lowest, 6 for highest). This helps in sorting.
3.  **Edit/Delete**: Use the pencil or trash icon on a class card to modify or remove it.
    - *Note: Deleting a class will remove all associated pupils and marks.*

### Subject Management
Each class has its own set of subjects.
1.  In the **Classes** page, click **Manage Subjects** on a class card.
2.  **Add Subject**:
    - Select a subject from the list or type a new one.
    - **Coefficient**: Enter the weight of the subject (default is 1).
    - Click **Add Subject**.
3.  **Edit Coefficient**: You can directly change the coefficient in the list.

### Pupil Management
1.  Go to **Pupils**.
2.  **Add Pupil**: Click "Add New Pupil".
    - Enter **Full Name**, **Admission Number**, **Sex**, and **Date of Birth**.
    - Select the **Class** they belong to.
3.  **Search & Filter**:
    - Use the search bar to find students by name or admission number.
    - Use the dropdown to filter the list by a specific class.

### Marks Entry
1.  Go to **Marks Entry**.
2.  **Select Context**:
    - Choose the **Class**.
    - Choose the **Subject**.
3.  **Enter Scores**:
    - The list of students for that class will appear.
    - Enter the score (out of 20) for each student.
    - You can use decimals (e.g., 15.5).
4.  **Save**: Click **Save Marks**.
    - *Tip: The system validates scores to ensure they are between 0 and 20.*

---

## Data & Privacy
- **Offline Storage**: All data is stored in your browser's **IndexedDB**. This means your data stays on your specific computer and browser profile.
- **Backup**: Since data is local, clearing your browser's "Site Data" or "Cache" for this site might erase your records. Ensure you do not clear site data for this application inadvertently.
