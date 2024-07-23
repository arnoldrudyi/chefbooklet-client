# ChefBooklet Client

ChefBooklet is a web application designed to help users discover recipes based on the ingredients they have on hand. It also provides functionality to suggest random dishes and filter recipes by nationality. This repository contains the frontend client built with React.js.

## Key Features
- **User Authentication**
  - Implements JWT-based authentication for secure login and registration.
- **Recipe Search**
  - Users can search for recipes based on the ingredients they have.
  - Users can get random recipe suggestions.
  - Users can filter recipes by selected national cuisines.
  - Users can add recipes to their favorites.
- **Responsive Design**
  - Optimized for various devices and screen sizes.

## Development Requirements
The application is deployed at **[ChefBooklet](https://chefbooklet.vercel.app/)**. For local development, follow the steps below.

### Technical Requirements
- Node.js 16+
- npm 8+

### Configuration

1. **Clone the repository:**
    ```sh
    git clone https://github.com/arnoldrudyi/chefbooklet-client.git
    cd chefbooklet-client
    ```

2. The `.env.development` and `.env.production` files are already created in the root directory of the project. Update the following environment variable in each file as needed:
    
    For `.env.development`:
    ```plaintext
    REACT_APP_SERVER_URL=http://localhost:8000
    ```

    For `.env.production`:
    ```plaintext
    REACT_APP_SERVER_URL=https://chefbooklet-api.fly.dev
    ```

    - `REACT_APP_SERVER_URL`: URL of the backend API. You can use the provided URL or host your own instance of the backend server (**[chefbooklet-server](https://github.com/arnoldrudyi/chefbooklet-server)**).

### Running the Application

1. **Install the dependencies:**
    ```sh
    npm install
    ```
2. **Start the development server:**
    ```sh
    npm start
    ```

    This will run the app in the development mode.
    Open **[http://localhost:3000](http://localhost:3000)** to view it in the browser.

3. **Build the app for production:**
    ```sh
    npm run build
    ```

    This will build the app for production to the `build` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

### Testing

1. **Run tests:**
    ```sh
    npm test
    ```

    Launches the test runner in the interactive watch mode.
    See the section about **[running tests](https://facebook.github.io/create-react-app/docs/running-tests)** for more information.

## License
This project is licensed under the MIT License. See the **[LICENSE](LICENSE)** file for details. Contributions are welcome!

