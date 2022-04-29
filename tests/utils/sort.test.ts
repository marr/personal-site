import { describe, expect, it } from 'vitest';
import { byDate } from '~/utils/date';

const date1 = new Date('2022-04-28');
const date2 = new Date('2022-04-29');
const date3 = new Date('2022-04-20');
const fixture = [
    date1,
    date2,
    date3
];

describe("sort", () => {
    it("Sorts by Date (desc)", () => {
        fixture.sort(byDate());
        expect(fixture[0]).toBe(date2);
        expect(fixture[1]).toBe(date1);
        expect(fixture[2]).toBe(date3);
    })
    it("Sorts by Date (asc)", () => {
        fixture.sort(byDate(false));
        expect(fixture[2]).toBe(date2);
        expect(fixture[1]).toBe(date1);
        expect(fixture[0]).toBe(date3);
    })
})