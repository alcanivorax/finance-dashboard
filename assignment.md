
Scenario
Imagine you are building the backend for a finance dashboard system where different users interact with financial records based on their role.

The system should support the storage and management of financial entries, user roles, permissions, and summary level analytics. The goal is to build a backend that is logically structured and able to serve data to a frontend dashboard in a clean and efficient way.

Core Requirements
1. User and Role Management
Provide a way to manage users and their access levels within the system.

Your backend should support:

Creating and managing users
Assigning roles to users
Managing user status such as active or inactive
Restricting actions based on roles
You may define roles such as:

Viewer: Can only view dashboard data
Analyst: Can view records and access insights
Admin: Can create, update, and manage records and users
The exact role model is up to you, but role based behavior should be clear in your implementation.

2. Financial Records Management
Create backend support for financial data such as transactions or entries.

Each record can include fields such as:

Amount
Type such as income or expense
Category
Date
Notes or description
Your backend should support operations such as:

Creating records
Viewing records
Updating records
Deleting records
Filtering records based on criteria such as date, category, or type
3. Dashboard Summary APIs
Provide APIs or backend logic that can return summary level data for a dashboard.

Examples include:

Total income
Total expenses
Net balance
Category wise totals
Recent activity
Monthly or weekly trends
The purpose here is to show how you design backend endpoints or service logic for aggregated data, not just basic CRUD operations.

4. Access Control Logic
Implement backend level access control for different roles.

The system should clearly enforce which type of user can perform which action. For example:

A viewer should not be able to create or modify records
An analyst may be allowed to read records and access summaries
An admin may be allowed full management access
You may implement this using middleware, guards, decorators, policy checks, or any equivalent method depending on the framework you choose.

5. Validation and Error Handling
Your backend should demonstrate proper handling of incorrect or incomplete input.

This includes:

Input validation
Useful error responses
Status codes used appropriately
Protection against invalid operations
The goal is not perfection, but your implementation should show that you understand how a backend should behave in real usage.

6. Data Persistence
Use a persistence approach suitable for your project.

This can be:

A relational database
A document database
SQLite for simplicity
Any other reasonable option
If you choose a simplified or mock storage approach, mention it clearly in your documentation.
