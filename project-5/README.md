# TradeStream — Real-Time Trading Terminal

A single-page trading terminal built with plain, dependency-free JavaScript. A
simulated market feed streams live prices into a watchlist and detail chart, and
you can place mock buy/sell orders against a starting cash balance while a trade
log records every fill. A simulated **news wire** publishes market-moving
headlines that nudge prices, and an optional **AI analyst** (Google Gemini) can
summarise the market, your portfolio, and the latest news on demand.

The project is a hands-on tour of three topics: **the DOM**, **ES6 classes**,
and **asynchronous JavaScript**.

## Run it

No build step. Because it uses ES modules, open it through a local server rather
than the `file://` protocol:

```bash
# from this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or use any static server (the VS Code "Live Server" extension works too). Click
**Connect feed** to start the price stream.

## What it does

- Streams simulated price ticks for six instruments once you connect the feed.
- Highlights each price move green/red with a quick flash.
- Shows a live quote, day-change %, and an SVG sparkline for the selected name.
- Lets you place buy/sell market orders with cash and position rules enforced.
- Tracks cash, holdings value, and net worth in the header, and logs every fill.
- Streams simulated **news headlines** tagged bullish/bearish/neutral; each
  market-moving story nudges the affected symbol's price in real time.
- Offers an optional **AI market briefing** from Google Gemini, built from your
  live account, the watchlist, and recent headlines.

## How it's organised

| File           | Responsibility                                                     |
| -------------- | ------------------------------------------------------------------ |
| `index.html`   | Terminal layout: watchlist, detail/order panel, trade log, news, AI. |
| `style.css`    | Dark terminal theme.                                               |
| `feed.js`      | `MarketFeed` + `Tick` — the simulated async streaming data source.  |
| `portfolio.js` | `Instrument`, `Position`, `Portfolio`, `OrderError` — domain model. |
| `news.js`      | `NewsWire` + `Headline` — async wire of market-moving headlines.    |
| `gemini.js`    | `GeminiAnalyst` — optional AI briefing via the Gemini API.          |
| `app.js`       | Controller: binds the feed, news, model, and AI to the DOM.        |

## The news wire

Once you connect the feed, `NewsWire` starts emitting a headline every few
seconds at randomised intervals. Each `Headline` carries a sentiment and an
impact magnitude, which combine into a signed `priceEffect`. The app applies
that through `feed.nudge(symbol, fraction)`, which updates the price and emits a
normal `tick` — so a bullish story visibly pushes a stock up in the watchlist
and chart. It reuses the same class + `AbortController` + pub/sub patterns as
the price feed.

## The AI analyst (optional)

The AI analyst is off until you paste a [Gemini API key](https://aistudio.google.com/app/apikey).
The key is stored only in your browser's `localStorage` and sent directly to
Google's API from your machine — there is no server in between. Click **Ask AI
for a market briefing** and `GeminiAnalyst` builds a prompt from a snapshot of
your account, the watchlist, and recent headlines, then returns a short
three-line read (Market / Portfolio / Watch). The terminal works fully without
a key; this is a bonus layer.

## Topics covered

### DOM

- Caching element references and doing **targeted updates** instead of
  re-rendering everything on each tick (`paintRow` patches one row).
- **Event delegation**: a single listener on the watchlist `<ul>` handles clicks
  on any row, and one listener on the form handles the buy/sell toggle.
- Building nodes with `createElement` / `innerHTML` / `prepend`.
- Drawing an **SVG sparkline** by mapping price history to polyline points.
- Formatting with `Intl.NumberFormat`.

### Classes

- `Instrument`, `Position`, and `Portfolio` model the domain, with **getters**
  for derived values (`changePct`, `unrealisedPnL`, `netWorth`).
- Business rules (enough cash to buy, enough shares to sell) are **encapsulated**
  in `Portfolio.execute` rather than scattered through the UI.
- A custom error type, `OrderError`, extends `Error` so the UI can tell rule
  violations apart from real bugs.
- `MarketFeed` uses **private fields** (`#prices`, `#listeners`) and a
  **static** helper (`MarketFeed.#wait`).
- `NewsWire` and `GeminiAnalyst` follow the same class conventions — private
  state, small public surfaces, and a static prompt builder on the analyst.

### Asynchronous JavaScript

- `feed.connect()` returns a **Promise** that resolves after a simulated
  handshake; the button handler `await`s it.
- The stream is an **async generator** (`async *#stream`) consumed with
  `for await ... of`.
- A promisified, cancellable delay (`#wait`) is unwound by an
  **`AbortController`** when you disconnect.
- A small **publish/subscribe** emitter (`on` / `#emit`) decouples the feed from
  the UI. The news wire uses the same pattern for its `headline` events.
- The AI analyst uses **`fetch` + `await`** to call the Gemini API, with
  `try/catch` handling for network failures and non-OK responses.

## Notes

All prices, headlines, and fills are randomly generated — this is a learning
sandbox, not a real brokerage, and the AI briefing is commentary on fake data,
not financial advice. Open the browser console to watch ticks, headlines, and
fills logged as they happen.
