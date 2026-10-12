# BlockTax / LevChain: architecture decisions

Status: working browser-local prototype, not the production reporting MVP.

## Current implementation

- Restored the complete 72-file archive rather than the incomplete root-level upload.
- Preserved the original ivory, forest-green and gold design tokens and original Market / On-Chain / Staking screens as explicitly labelled design previews.
- A shared workspace owns a demonstration portfolio and a separate personal portfolio.
- One pure FIFO calculation feeds the overview, holdings, issues and accounting summaries.
- Purchase fees enter acquisition cost. Sale fees reduce proceeds. Reward receipt value is separate from capital P/L.
- Unknown acquisition cost stays unknown; incomplete historical balances cannot produce a confident total or realized gain.
- CSV imports are atomic, use stable IDs, detect conflicts, and preserve quoted text. The format is explicitly a manual ledger format.
- USD accounting records are separate from the configurable ILS display conversion. No historical FX or jurisdiction tax treatment is claimed.
- Transactions and quotes are browser-local, with validated JSON backup and restore.
- Hash navigation and lazy-loaded screens keep links and browser navigation usable while reducing initial JavaScript.
- No wallet keys, signing, trading, connected exchange credentials, paid APIs or LLM inference are used.

## Boundaries that must change before live adapters

The local `PortfolioData` is a UI projection. Do not make it the permanent accounting database schema.

1. **Asset identity:** manual symbols are suitable only for manual records. Production identity must use chain plus contract/mint/native-asset reference, including decimals. Do not merge assets merely because their symbols match.
2. **Precision:** JavaScript numbers are used for this prototype. Production movements must store atomic quantities as integer strings and monetary values as explicit decimals; select a decimal policy and golden fixtures before production reports.
3. **Evidence:** retain original provider records, transaction hashes, event indexes, source IDs, decoder versions and ingestion timestamps. Unknown events enter a review queue rather than being classified as ordinary buys or sales.
4. **Transfers:** represent multi-account movements and match owned transfers without resetting basis or duplicating portfolio value. Wallet boundaries and jurisdiction cost-basis rules must be configurable.
5. **Corrections:** browser edits currently change a projection. Production corrections must append revisions with reasons, preserve raw evidence, and allow deterministic recalculation of a prior report.
6. **Historical valuation:** keep token valuation evidence separate from fiat FX evidence, both timestamped. Keep current portfolio pricing distinct from transaction-date reporting valuations.
7. **Storage:** replace browser-only persistence with a repository interface, optional private synchronization and verified user isolation. Do not simply upload browser localStorage as the production database.
8. **Data cost:** adapters report request units, cursors and completeness. Backfills, pagination, retries and premium endpoint quotas have separate budgets. Unknown or exhausted data is not replaced by plausible numbers.
9. **Entitlements:** once paid services exist, enforce access on the server; UI-only locks are not a payment boundary. Raw records and a basic export remain accessible to the owner.
10. **Protocol accounting:** LP principal, fees, rewards, debt and withdrawals require distinct economic movements. Do not count rewards or fees twice when an API already includes them in position value.

`src/domain/integration-contracts.ts` defines the next-stage boundary types. These are design contracts, not implemented live integrations.

## Production MVP acceptance gates

Choose one chain and one LP protocol from actual pilot portfolios. Test coverage on those portfolios before choosing an API vendor. The target outcome is an explainable LP return and a reviewed accounting evidence pack.

- Every included number has source, date, currency, methodology and confidence.
- Source ingestion is idempotent and replayable; no known duplicate movement remains.
- Acquisition / disposal / own transfer / fee / received reward / LP movement cases have golden fixtures.
- Known balances reconcile to the selected source within a documented numerical tolerance. Unknown balances are visible, never silently forced to zero.
- Report generation preserves a manifest identifying input evidence, calculation version, overrides, jurisdiction policy and unresolved issues.
- Israeli reporting policy is reviewed by a qualified professional before a report is marketed as filing-ready. Banking evidence is not marketed as guaranteed bank acceptance.
- Authentication, private data isolation, export/delete, logging and backup recovery have passed applicable checks.
- Actual cost per account sync, portfolio backfill and exported report has been measured.

## Product sequence

1. Local prototype: validate the interaction, ledger, calculations and willingness to share records.
2. Evidence-backed pilot: one source family, historical prices/FX, transfers, one LP decoder and a reconciliation workflow.
3. Paid pilot: independently reviewed report packs or an LP analytics subscription; measure support time and contribution margin.
4. Expansion: additional protocol coverage, accountant workspaces, high-signal alerts and opportunity comparisons justified by repeat demand.
5. Later: execution integrations, derived-data API or enterprise deployment only after legal, commercial data-rights and security checks for that concrete scope.

## Validation limitations

The managed environment has no supported control-browser capability. Do not claim screenshot or interactive browser QA. Domain tests and a production build validate their stated scopes; a successful private deployment validates publication, not all browser interactions.
