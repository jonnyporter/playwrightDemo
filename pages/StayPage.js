export class StayPage {

    /**
     * @param {import('@playwright/test').Page } page
     */
    constructor(page) {
        /** @type {import('@playwright/test').Page } */
        this.page = page;

        // Locators
        this.whereYoullBeSection = page.locator('section', { hasText: 'Where you’ll be' });
        this.checkInDateField = page.getByTestId('change-dates-checkIn');
        this.checkOutDateField = page.getByTestId('change-dates-checkOut');

        /**
         * @param {string} date format is mm/dd/yyyy
         */
        this.calendarDayOptionByDate = (date) => page.getByTestId(`calendar-day-${date}`);
    }
}