import { BigUnitFactory } from "./src/bigunit";

// Define the BigUnitFactories with the specified precisions for cryptocurrencies and USD
const BTC = new BigUnitFactory(8, "BTC"); // BTC precision
const ETH = new BigUnitFactory(18, "ETH"); // ETH precision
const DOT = new BigUnitFactory(10, "DOT"); // DOT precision
const USD = new BigUnitFactory(4, "USD"); // USD precision

// Crypto balances
const btcBalance = BTC.fromNumber(0.005); // 0.005 BTC
const ethBalance = ETH.fromNumber(0.5); // 0.5 ETH
const dotBalance = DOT.fromNumber(10.123456789); // 10.1234567890 DOT

// Exchange rates to USD
const btcUsdRate = USD.fromNumber(60000); // $60,000 per BTC
const ethUsdRate = USD.fromNumber(2000); // $2,000 per ETH
const dotUsdRate = USD.fromNumber(35); // $35 per DOT

// Convert each crypto balance to USD
const btcUsdValue = btcBalance.mul(btcUsdRate).asPrecision(USD.precision);
const ethUsdValue = ethBalance.mul(ethUsdRate).asPrecision(USD.precision);
const dotUsdValue = dotBalance.mul(dotUsdRate).asPrecision(USD.precision);

// Sum the USD values to get the total balance
const totalUsdBalance = btcUsdValue.add(ethUsdValue).add(dotUsdValue);

// Output the balances in USD
console.log(`BTC Balance in USD: $${btcUsdValue.format(2)}`);
console.log(`ETH Balance in USD: $${ethUsdValue.format(2)}`);
console.log(`DOT Balance in USD: $${dotUsdValue.format(2)}`);

// Output the total balance in USD
console.log(
  `Total Crypto Balance in USD: $${totalUsdBalance.format(2)}`
);
