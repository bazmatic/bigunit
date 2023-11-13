import { BigUnit, BigUnitFactory } from "./src/bigunit";

const ETH = new BigUnitFactory(18, 'ETH');
const balance = ETH.fromDecimalString('0.023401');
console.log(`Balance: ${balance.format(4)} (${balance.toString()})`);

const deposit = ETH.fromDecimalString('0.012020219');
const fee = deposit.percent(5.5);
const newBalance = deposit.add(balance).sub(fee);
console.log(newBalance.format(4));
console.log(`JSON: ${JSON.stringify(newBalance)}`);