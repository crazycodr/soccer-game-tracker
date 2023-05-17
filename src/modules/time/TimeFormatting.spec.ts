import {describe, test, expect} from "vitest";
import formatTimeFromSeconds from "@/modules/time/TimeFormatting";

describe('formatTimeFromSeconds', () => {
    test('0 seconds yield 00:00', () => {
        expect(formatTimeFromSeconds(0)).toBe('00:00')
    })
    test('1 seconds yield 00:01', () => {
        expect(formatTimeFromSeconds(1)).toBe('00:01')
    })
    test('59 seconds yield 00:59', () => {
        expect(formatTimeFromSeconds(59)).toBe('00:59')
    })
    test('60 seconds yield 01:00', () => {
        expect(formatTimeFromSeconds(60)).toBe('01:00')
    })
    test('63 seconds yield 01:03', () => {
        expect(formatTimeFromSeconds(63)).toBe('01:03')
    })
    test('120 seconds yield 02:00', () => {
        expect(formatTimeFromSeconds(120)).toBe('02:00')
    })
    test('600 seconds yield 10:00', () => {
        expect(formatTimeFromSeconds(600)).toBe('10:00')
    })
    test('3599 seconds yield 59:59', () => {
        expect(formatTimeFromSeconds(3599)).toBe('59:59')
    })
    test('5400 seconds yield 90:00', () => {
        expect(formatTimeFromSeconds(5400)).toBe('90:00')
    })
})