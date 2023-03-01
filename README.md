<div align="center">

# Cash vs Future

Live Equity and Future comparison (basis, basis percent) with order placement using Zerodha Kite APIs and Next.js

https://user-images.githubusercontent.com/53750093/222221290-00c3ae40-3020-456f-bc13-de47bed82e7a.mp4

</div>

## Features

- Equity Ask and Future Bid comparisons with basis and basis percentage
- Sorted in descending order of basis percentage in real time
- Vertically resizable and scrollable table to adjust views when needed
- Prices displayed - First Ask for Equity stocks and First Bid for Future stocks
- Order placement for a single pair when the basis percent crosses the given entry basis percent
- Light and Dark theme

## Configuration

### Port and Redirect URL

The default port is `8000`.

The default redirect route is `/login`.

So, the application expects to get a redirect request at `http://localhost:8000/login` after successful login. Either update your `Redirect URL` in Kite Developer Portal or update the login handler route. To change the port, update the `dev` and `start` scripts in `package.json`.

### config.ts

Edit `src/config.ts` to configure:

- `STOCKS_TO_INCLUDE` - Update list of stocks which should be monitored

## Setup

Install dependencies.

```sh
npm install
```

Setup environment secrets in an `env.json` file by copying the `example.env.json` file. For further customisation, see [configuration](#configuration).

```sh
cd src
cp example.env.json env.json
# Populate env.json secrets
```

Start the app to login for the first time to get and cache your access token.

```sh
npm run dev
```

You should see a "Session Expired" message in the top right corner. Click on it and login
After successful login, click on the refresh data button to fetch or update instrument data.

## Usage

Start in development mode

```
npm run dev
```

Build and start production server.

```sh
npm run build
npm start
```

## Future plans

- Implementing an exit strategy for the stock pair that did enter
- Configurable number of pairs to enter/exit along with configurable entry basis percentages

## Related

- [Option Chain](https://github.com/anurag-roy/kite-option-chain)
- [5paisa Live Ticker](https://github.com/anurag-roy/5paisa-live-ticker)
- [KiteConnect TypeScript Library](https://github.com/anurag-roy/kiteconnect-ts)

## Contact

- [Twitter](https://twitter.com/anurag__roy)
- [Email](mailto:anuragroy@duck.com)

## License

[MIT © 2023 Anurag Roy](/LICENSE)
