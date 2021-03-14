## OAuth2 token

[Paste Google OAuth2 app's client ID](https://developers.google.com/identity/sign-in/web/sign-in) to the file `client/src/API_KEYS_EXAMPLE.json` `GOOGLE_AUTH` field of `API_KEYS_EXAMPLE.json` file and then rename file to `API_KEYS.json`.

# Client

### `yarn start`
- Runs the app in the development mode.<br />
- Visit [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn start:dev`
- Runs the app ignoring Typescript errors.

### `yarn build`
- Builds the app for production.

### `yarn test`
- Launches the test runner in the interactive watch mode.

### `yarn eject`

- **Note: this is a one-way operation. Once you `eject`, you can’t go back!**
It will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) into your for you to have full control over them. 

### `yarn lint`

- Runs eslint and finds inconsistencies with Airbnb style guide and other errors.
 Note the pre-commit hook does not allow to make the commit if there are some errors.

### `yarn lint:fix`
- Runs eslint and fixes auto-fixable errors.

### `yarn predeploy`
- Runs before deploy and creates production build.

### `yarn deploy`
- Deploys project to Github Pages.
 Note the pre-push hook makes deployment on every push.
