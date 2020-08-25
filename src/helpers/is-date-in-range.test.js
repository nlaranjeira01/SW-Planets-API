const { isDateInRange } = require("./is-date-in-range");

describe("IsDateInRange helper", () => {
    it("should return false if initialDate is not a Date", async () => {
        const dayBeforeYesterday = new Date();
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

        expect(isDateInRange(dayBeforeYesterday.toString(), 3)).toBe(false);
    });

    it("should return false if today is not in initialDate's range", async () => {
        const dayBeforeYesterday = new Date();
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

        // the day before yesterday + 1 day is yesterday, so today should be out of range
        expect(isDateInRange(dayBeforeYesterday, 1)).toBe(false);
    });

    it("should return true if today is in initialDate's range", async () => {
        const dayBeforeYesterday = new Date();
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);

        // the day before yesterday + 3 days is tomorrow, so today should be in range
        expect(isDateInRange(dayBeforeYesterday, 3)).toBe(true);
    });
});
