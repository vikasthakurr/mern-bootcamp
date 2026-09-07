// feed.js — a simulated real-time market data feed.

/** A single price update for one symbol. */
export class Tick {
  constructor(symbol, price, prevPrice, time = Date.now()) {
    this.symbol = symbol;
    this.price = price;
    this.prevPrice = prevPrice;
    this.time = time;
  }

  get delta() {
    return this.price - this.prevPrice;
  }

  get direction() {
    if (this.price > this.prevPrice) return "up";
    if (this.price < this.prevPrice) return "down";
    return "flat";
  }
}

/** Simulates a streaming quote source over a pub/sub interface. */
export class MarketFeed {
  #prices = new Map();
  #listeners = new Map();
  #controller = null;
  #tickMs;
  #volatility;

  constructor(seed, { tickMs = 900, volatility = 0.012 } = {}) {
    for (const { symbol, price } of seed) {
      this.#prices.set(symbol, price);
    }
    this.#tickMs = tickMs;
    this.#volatility = volatility;
  }

  get connected() {
    return this.#controller !== null;
  }

  get symbols() {
    return [...this.#prices.keys()];
  }

  priceOf(symbol) {
    return this.#prices.get(symbol);
  }

  /**
   * Apply an external shock to a symbol's price (e.g. a news event) as a
   * signed fraction such as +0.03. Emits a Tick and returns the new price.
   */
  nudge(symbol, fraction) {
    if (!this.#prices.has(symbol) || !fraction) return null;
    const prev = this.#prices.get(symbol);
    let next = prev * (1 + fraction);
    if (next < 1) next = 1 + Math.random();
    next = Math.round(next * 100) / 100;
    this.#prices.set(symbol, next);
    const tick = new Tick(symbol, next, prev);
    this.#emit("tick", tick);
    return next;
  }

  on(event, callback) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, new Set());
    this.#listeners.get(event).add(callback);
    return () => this.#listeners.get(event)?.delete(callback);
  }

  #emit(event, payload) {
    const set = this.#listeners.get(event);
    if (!set) return;
    for (const cb of set) {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[feed] listener for "${event}" threw:`, err);
      }
    }
  }

  /** Resolve after a simulated connection handshake. */
  connect() {
    this.#emit("status", "connecting");
    return new Promise((resolve) => {
      setTimeout(() => {
        this.#emit("status", "connected");
        resolve(this);
      }, 600);
    });
  }

  start() {
    if (this.#controller) return;
    this.#controller = new AbortController();
    this.#run(this.#controller.signal);
    this.#emit("status", "streaming");
  }

  stop() {
    this.#controller?.abort();
    this.#controller = null;
    this.#emit("status", "stopped");
  }

  async #run(signal) {
    try {
      for await (const tick of this.#stream(signal)) {
        this.#emit("tick", tick);
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("[feed] stream error:", err);
        this.#emit("error", err);
      }
    }
  }

  async *#stream(signal) {
    while (!signal.aborted) {
      await MarketFeed.#wait(this.#tickMs, signal);
      if (signal.aborted) return;

      const symbols = this.symbols;
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const prev = this.#prices.get(symbol);
      const next = this.#nextPrice(prev);
      this.#prices.set(symbol, next);

      yield new Tick(symbol, next, prev);
    }
  }

  #nextPrice(price) {
    const drift = (Math.random() - 0.5) * 2 * this.#volatility;
    let next = price * (1 + drift);
    if (next < 1) next = 1 + Math.random();
    return Math.round(next * 100) / 100;
  }

  /** Promisified delay that rejects with AbortError when the signal fires. */
  static #wait(ms, signal) {
    return new Promise((resolve, reject) => {
      const id = setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(id);
          reject(new DOMException("Aborted", "AbortError"));
        },
        { once: true }
      );
    });
  }
}
