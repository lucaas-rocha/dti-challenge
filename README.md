# My Shop (Technical Test)

Complete product listing and shopping cart management system, developed as a resolution for a technical challenge. The project implements a Full-Stack architecture with a clear separation of concerns, Front-end componentization, and data persistence.

![React](https://img.shields.io/badge/React-Vite-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![SQLite](https://img.shields.io/badge/SQLite-Database-lightgrey)
![Status](https://img.shields.io/badge/Status-Completed-blue)

## Implemented Differentiators (Optional Features)

In addition to meeting all the mandatory requirements, this project includes extra features to demonstrate technical maturity and a focus on UX/UI:

1.  **Product Options and Variations:**
    * Dynamic support for products with sub-options (e.g., choosing Colors or Keyboard Layout).

2.  **Real-Time Filter and Search:**
    * Integrated search bar that filters products by name instantly, without the need to reload the page or make extra server requests.

3.  **Visual Feedback and Advanced UX:**
    * **Animated Toasts:** Replacement of native browser alerts with non-obtrusive notification components for success and error messages (e.g., validation for the 1 to 10 items limit).
    * **Checkout Screen:** Friendly success modal upon completing the purchase.

4.  **Architecture and Clean Code:**
    * **Componentized Front-end:** Division of the main file into components (`Header`, `Cart`, `ProductCard`, `OptionsModal`, `CheckoutSuccess`, `Toast`).
    * **MVC Back-end:** Refactoring of the monolithic server into a structure of routes and controllers separated by domain (`productController` and `cartController`).

---

## Technologies

* **Frontend:** React.js (via Vite) and pure CSS3.
* **Backend:** Node.js with Express.
* **Database:** SQLite3 (Local file, no need to install external DBMS).
* **Integration:** Native REST API using `fetch`.

---

## How to Run the Project

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.
* Command terminal (Git Bash, PowerShell, etc).

The project is divided into two main folders. You will need to run the Back-end and the Front-end in **separate terminals**.

### Step 1: Running the Back-end (API and Database)

1.  Open the terminal and navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server (the SQLite database will be generated automatically with test products):
    ```bash
    node server.js
    ```
    *The server will run at `http://localhost:3001`*

### Step 2: Running the Front-end (React Interface)

1.  Open a **new** terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the React application with Vite:
    ```bash
    npm run dev
    ```
4.  **Access in the Browser:** Hold `Ctrl` and click the link generated in the terminal (usually `http://localhost:5173`).

---

## Project Choices

### Architecture and Database
For the API, I opted for Node.js over .NET since it is the technology I am currently most used to working with, allowing me to deliver a solid result within the deadline. Seeking to apply the concepts of separation of concerns (SOLID and MVC) that I have been improving in my Computer Engineering course at CEFET-MG, I decided to structure the Back-end in layers. The test demanded SQLite as the database, which made evaluation easier for the recruiter as it is a zero-config file-based database, and does not require the evaluator to spin up Docker containers or install databases on their own machine to test the application.

### Componentized Front-end
I started developing the Front-end to ensure the MVP (Minimum Viable Product) integration as quickly as possible. After ensuring the stability of the API calls, I applied refactoring techniques to extract the visual logic into reusable components, ensuring that the `App.jsx` file acted only as a state orchestrator.

### Automatic Seeding
As in past simulation projects, I opted to perform automatic seeding in the `database.js` file. If the table is empty, the system pre-loads 6 varied products (some with options, others without), allowing the application to be ready for immediate testing.

---

## AI Collaboration History

I used Generative Artificial Intelligence (LLM) as a pair programming partner to accelerate development, focus on architecture, and automate boilerplate generation. AI also played a role in the initial app.jsx development (mainly html tags and css), generating a well-structured base so I could add functionalities later.

Below are examples of the prompt flows used:

### 1. Database and API Modeling

> "Create the initialization file for a SQLite3 database. I need two tables: 'products' (with id, name, description,, price, image) and 'cart' (with id, product_id, quantity). Set up a seeding script with 3 electronic products."

> "Create a POST route to add products in the cart using Express and SQLite."

### 2. UI and User Experience (React)

> "Create a React structure suited for an app focused in online shopping with product cards. Each card needs an image, title, price, and an 'Add to Cart' button. Also, add an interface to be the cart page."

> "I have an App.jsx file with the product listing. I want to implement a search bar at the top. Show me how to create a searchTerm state and use the JavaScript filter function to render only the cards that match the search in real-time."

> "How can I implement a Smart Modal in React that intercepts the 'Add to Cart' click? It should only open if the selected product has sub-options (like colors or keyboard layouts) in the JSON. If the product doesn't have options, it should bypass the modal and add it directly to the cart."

> "I want to remove the native browser 'alerts()'. Create a React Toast.jsx component that receives a message and a type (success/error). It should appear in the bottom right corner and disappear automatically."