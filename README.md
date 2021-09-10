[![CodeFactor](https://www.codefactor.io/repository/github/onethread-app/onethread-webapp/badge?s=781502fd83262535851b87115dc3c3b65027e6ab&style=for-the-badge)](https://www.codefactor.io/repository/github/onethread-app/onethread-webapp)

# Onethread

Onethread is a cloud software suite for businesses. It includes an enterprise connectivity and team collaboration tool, a lead generation & sourcing tool and an AI for Digital Marketing & Market Research.

### Prerequisites

You should install `Node`, `git`, `Yarn`

### Installing

`git clone url`

`cd url`

### Backend Running

go to backend directory using `cd backend`
then run `npm install`

For development:
`cp .env.dev .env`

`npm start`

## Running the tests

For running the test case use `npm run test`

### And coding style tests

run `npm lint` to match with the coding style.

### Client running

go to client directory using `cd client`
then run `yarn install`

For development:
`cp .env.development .env`

`yarn start`

## Things to keep in mind when writing a new component

1. Organize your imports in a fashion that it's easy to read. Such as
   - Put your primary and functional module imports on top
   - Followed by imports from UI frameworks
   - Then list down your action and other imports from reducer including helper functions
   - And finally put your local component and css file imports at the bottom of the list
   - Don't forget to put a new line between these sections
2. When writing the functional part of the component, follow these rules
   - Firstly, place your state variables on top of everything else
   - Then write your useEffect and other hooks
   - After that just before your jsx component, write your local functions and handlers
   - And finally write down your jsx
3. When writing new jsx, we'll try to follow these measures from now on
   - Try styling each of your component using styled component
   - Put the styled element in a separate component (ex: OmukComponent.styles.jsx) and export them from there
   - If you're using classes, use template literals
   - Try not to write inline css as much as possible
   - Reduce the number of lines of code you write in a single component and break down each component into smaller ones
   - Also don't forget to use prettier to format your code
   - One more thing, it's very important that we write reusable components as much as possible
