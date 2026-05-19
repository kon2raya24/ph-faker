import { Rng } from './rng.js';
import prefixes from '../../../data/network-prefixes.json' with { type: 'json' };

export type Network = 'Globe' | 'Smart' | 'Sun' | 'DITO';

const NETWORK_PREFIXES: Record<Network, string[]> = {
  Globe: prefixes.Globe,
  Smart: prefixes.Smart,
  Sun: prefixes.Sun,
  DITO: prefixes.DITO,
};

const LANDLINE_AREA_CODES = ['2', '32', '33', '34', '38', '42', '43', '44', '45', '46', '49', '74', '82', '88'];

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

export class PhoneFaker {
  constructor(private rng: Rng) {}

  mobile(): string {
    const networks: Network[] = ['Globe', 'Smart', 'Sun', 'DITO'];
    const network = this.rng.pick(networks);
    return this.mobileByNetwork(network);
  }

  mobileByNetwork(network: Network): string {
    const prefix = this.rng.pick(NETWORK_PREFIXES[network]);
    const subscriber = pad(this.rng.nextInt(0, 9999999), 7);
    // Returns E.164: prefix is "0XXX", drop leading 0 and add +63.
    return `+63${prefix.slice(1)}${subscriber}`;
  }

  landline(): string {
    const area = this.rng.pick(LANDLINE_AREA_CODES);
    // Metro Manila (area code 2) uses 8-digit subscriber numbers; rest use 7.
    const subscriberLen = area === '2' ? 8 : 7;
    const subscriber = pad(this.rng.nextInt(0, 10 ** subscriberLen - 1), subscriberLen);
    const formatted = subscriberLen === 8
      ? `${subscriber.slice(0, 4)}-${subscriber.slice(4)}`
      : `${subscriber.slice(0, 3)}-${subscriber.slice(3)}`;
    return `(0${area}) ${formatted}`;
  }
}
