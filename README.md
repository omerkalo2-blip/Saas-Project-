# BlockTax / LevChain Private Banking Workspace

Working browser-local crypto portfolio prototype restored from `BlockTax_Vercel_Ready.zip`.

The original ivory / green / gold design is retained. The overview, portfolio ledger, accounting draft and settings now share recorded data. Market, On-Chain and Staking retain the original interface as explicitly labelled previews.

## Run

```sh
npm install
npm run dev
```

## Verify and build

```sh
npm test
npm run build
```

Node 22.6 or newer is required for the TypeScript test runner. Vite emits `dist/`, matching the Vercel deployment configuration.

## Working behavior

- Separate demo and personal portfolios.
- Add, edit and remove buy, sell, opening and received-reward records.
- Fee-aware FIFO realized P/L and remaining-lot unrealized P/L.
- Reconciliation issues for missing acquisition records and current prices.
- Manual quote updates, timestamps, USD / ILS display preferences.
- Standard-format CSV import and export; stable IDs and conflict handling.
- Accounting draft by year, CSV export and print / save-as-PDF.
- Validated browser-local persistence and JSON backup / restore.
- Responsive navigation, deep links and lazy-loaded modules.

## Current limits

This is a prototype, not an automatically synchronized dApp or a jurisdiction-certified tax product. No live wallet, exchange, protocol action, custody, historical FX, paid plan or financial advice service is connected. Manual symbols are not production multi-chain asset identifiers, and fiat cash / derivatives / complex DeFi are not included.

See `docs/ARCHITECTURE.md` for the production boundary and acceptance gates.
