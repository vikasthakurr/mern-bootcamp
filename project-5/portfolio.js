// portfolio.js — the trading domain model.

/** A tradable instrument with a live price and a rolling price history. */
export class Instrument {
  constructor({ symbol, name, price }) {
    this.symbol = symbol;
    this.name = name;
    this.price = price;
    this.open = price;
    this.history = [price];
    this.maxHistory = 40;
  }

  update(price) {
    this.price = price;
    this.history.push(price);
    if (this.history.length > this.maxHistory) this.history.shift();
  }

  get changePct() {
    if (this.open === 0) return 0;
    return ((this.price - this.open) / this.open) * 100;
  }

  get direction() {
    if (this.price > this.open) return "up";
    if (this.price < this.open) return "down";
    return "flat";
  }
}

/** A holding in a single instrument: quantity + average cost basis. */
export class Position {
  constructor(symbol) {
    this.symbol = symbol;
    this.qty = 0;
    this.avgCost = 0;
  }

  get isOpen() {
    return this.qty > 0;
  }

  addShares(qty, price) {
    const totalCost = this.avgCost * this.qty + price * qty;
    this.qty += qty;
    this.avgCost = this.qty === 0 ? 0 : totalCost / this.qty;
  }

  removeShares(qty) {
    this.qty = Math.max(0, this.qty - qty);
    if (this.qty === 0) this.avgCost = 0;
  }

  marketValue(price) {
    return this.qty * price;
  }

  unrealisedPnL(price) {
    return (price - this.avgCost) * this.qty;
  }
}

/** Raised when an order cannot be executed. */
export class OrderError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderError";
  }
}

/** The account: cash, positions, and the executed-trade blotter. */
export class Portfolio {
  constructor(startingCash = 100000) {
    this.cash = startingCash;
    this.positions = new Map();
    this.trades = [];
  }

  positionFor(symbol) {
    if (!this.positions.has(symbol)) {
      this.positions.set(symbol, new Position(symbol));
    }
    return this.positions.get(symbol);
  }

  /** Execute a market order; returns the trade record or throws OrderError. */
  execute({ side, symbol, qty, price }) {
    qty = Math.floor(Number(qty));
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new OrderError("Enter a whole quantity of 1 or more.");
    }

    const cost = qty * price;
    const position = this.positionFor(symbol);

    if (side === "buy") {
      if (cost > this.cash) {
        throw new OrderError("Not enough cash for this order.");
      }
      this.cash -= cost;
      position.addShares(qty, price);
    } else if (side === "sell") {
      if (qty > position.qty) {
        throw new OrderError(`You only hold ${position.qty} share(s).`);
      }
      this.cash += cost;
      position.removeShares(qty);
    } else {
      throw new OrderError(`Unknown order side "${side}".`);
    }

    const trade = {
      id: crypto.randomUUID?.() ?? String(Date.now() + Math.random()),
      side,
      symbol,
      qty,
      price,
      total: cost,
      time: Date.now(),
    };
    this.trades.push(trade);
    return trade;
  }

  holdingsValue(priceLookup) {
    let sum = 0;
    for (const pos of this.positions.values()) {
      if (pos.isOpen) sum += pos.marketValue(priceLookup(pos.symbol));
    }
    return sum;
  }

  netWorth(priceLookup) {
    return this.cash + this.holdingsValue(priceLookup);
  }
}
