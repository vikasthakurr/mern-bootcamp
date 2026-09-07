// news.js — a simulated market news wire that emits price-moving headlines.

/** A single news item. */
export class Headline {
  constructor({ symbol, text, sentiment, impact, time = Date.now() }) {
    this.symbol = symbol;
    this.text = text;
    this.sentiment = sentiment;
    this.impact = impact;
    this.time = time;
  }

  /** Signed price nudge as a fraction, e.g. +0.03 for a strong bullish story. */
  get priceEffect() {
    if (this.sentiment === "bullish") return this.impact * 0.04;
    if (this.sentiment === "bearish") return -this.impact * 0.04;
    return 0;
  }
}

const TEMPLATES = {
  bullish: [
    "{name} beats quarterly earnings expectations",
    "Analysts upgrade {name} to 'strong buy'",
    "{name} announces record product pre-orders",
    "{name} lands major enterprise contract",
    "{name} raises full-year revenue guidance",
  ],
  bearish: [
    "{name} misses revenue targets, shares slip",
    "Regulators open probe into {name}",
    "{name} warns of supply-chain disruptions",
    "Analysts downgrade {name} on margin concerns",
    "{name} faces class-action lawsuit",
  ],
  neutral: [
    "{name} to present at industry conference",
    "{name} names new board member",
    "{name} schedules earnings call for next week",
    "Mixed reaction to {name}'s latest keynote",
  ],
};

const SENTIMENTS = ["bullish", "bearish", "neutral"];

/** Streams simulated headlines about a set of instruments over pub/sub. */
export class NewsWire {
  #instruments = [];
  #listeners = new Map();
  #controller = null;
  #minMs;
  #maxMs;

  constructor(instruments, { minMs = 4000, maxMs = 9000 } = {}) {
    this.#instruments = instruments.map(({ symbol, name }) => ({
      symbol,
      name,
    }));
    this.#minMs = minMs;
    this.#maxMs = maxMs;
  }

  get running() {
    return this.#controller !== null;
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
        console.error(`[news] listener for "${event}" threw:`, err);
      }
    }
  }

  start() {
    if (this.#controller) return;
    this.#controller = new AbortController();
    this.#run(this.#controller.signal);
  }

  stop() {
    this.#controller?.abort();
    this.#controller = null;
  }

  async #run(signal) {
    try {
      while (!signal.aborted) {
        const delay =
          this.#minMs + Math.random() * (this.#maxMs - this.#minMs);
        await NewsWire.#wait(delay, signal);
        if (signal.aborted) return;
        this.#emit("headline", this.#generate());
      }
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("[news] wire error:", err);
        this.#emit("error", err);
      }
    }
  }

  #generate() {
    const inst =
      this.#instruments[Math.floor(Math.random() * this.#instruments.length)];
    const sentiment =
      SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)];
    const pool = TEMPLATES[sentiment];
    const text = pool[Math.floor(Math.random() * pool.length)].replace(
      "{name}",
      inst.name
    );
    const impact = sentiment === "neutral" ? 0 : 0.3 + Math.random() * 0.7;

    return new Headline({
      symbol: inst.symbol,
      text,
      sentiment,
      impact: Math.round(impact * 100) / 100,
    });
  }

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
