import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formatea un precio positivo como moneda colombiana', () => {
    const result = formatPrice(129900);
    expect(result).toMatch(/\$[\s]?129[\s.]900/);
  });

  it('maneja precio cero', () => {
    const result = formatPrice(0);
    expect(result).toMatch(/\$[\s]?0/);
  });

  it('formatea correctamente un precio con decimales significativos', () => {
    const result = formatPrice(1299.5);
    expect(result).toMatch(/\$[\s]?1[\s.]299[\s,]5/);
  });

  it('devuelve valor seguro para NaN', () => {
    expect(formatPrice(NaN)).toBe('$0');
  });

  it('devuelve valor seguro para Infinity', () => {
    expect(formatPrice(Infinity)).toBe('$0');
    expect(formatPrice(-Infinity)).toBe('$0');
  });
});
