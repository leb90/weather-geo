`
# Weather Forecast App

This project is a [Next.js](https://nextjs.org/) application for fetching and displaying weather forecasts based on user input addresses. It is bootstrapped with [\`create-next-app\`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and deployed at [https://weather-geo-c.netlify.app/](https://weather-geo-c.netlify.app/).

## Getting Started

First, clone the repository and install dependencies:

\`\`\`bash
git clone <repository-url>
cd <repository-directory>
npm install
\`\`\`

To start the development server, run:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Project Structure

- \`pages/api/geocode.ts\`: API route for geocoding addresses.
- \`public/\`: Static assets for Next.js.
- \`src/app/\`:
  - \`global.css\`: Global styles for the app.
  - \`layout.tsx\`: Layout component for the app.
  - \`page.tsx\`: Main page component.
  - \`page.test.tsx\`: Tests for the main page component.
- \`jest.config.ts\`: Configuration file for Jest.
- \`jest.setup.ts\`: Setup file for Jest to configure additional testing utilities.

## Testing

To run the tests, use:

\`\`\`bash
npm run test
\`\`\`

This command uses Jest to execute tests defined in \`src/app/page.test.tsx\`.

## Dependencies

\`\`\`json
{
  "dependencies": {
    "axios": "^1.6.8",
    "http-proxy-middleware": "^3.0.0",
    "next": "14.2.2",
    "node-fetch": "^3.3.2",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^15.0.2",
    "@types/jest": "^29.5.12",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "babel-jest": "^29.7.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.2",
    "identity-obj-proxy": "^3.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "ts-jest": "^29.1.2",
    "ts-node": "^10.9.2",
    "typescript": "^5"
  }
}
\`\`\`

## API Sources

- Weather information is fetched from [https://api.weather.gov](https://api.weather.gov).
- Address geocoding is provided by [https://geocoding.geo.census.gov](https://geocoding.geo.census.gov).

## Learn More

For more information about Next.js, you can read the [Next.js Documentation](https://nextjs.org/docs).

## Deploy on Netlify

This application is deployed on Netlify. You can find deployment details and manage settings at [Netlify Dashboard](https://app.netlify.com/).

`
