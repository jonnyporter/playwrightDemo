export class NavBar {

    /**
     * @param {import('@playwright/test').Page } page
     */
    constructor(page) {
        /** @type {import('@playwright/test').Page } */
        this.page = page;

        // Search
        this.whereSearchInput = page.getByTestId('structured-search-input-field-query');
        this.checkInField = page.getByTestId('structured-search-input-field-split-dates-0');
        this.checkOutField = page.getByTestId('structured-search-input-field-split-dates-1');
        this.searchButton = page.getByTestId('structured-search-input-search-button');

        // Options
        this.optionByNumber = (number) => page.getByTestId(`option-${number}`);

        /**
         * @param {string} date format is mm/dd/yyyy
         */
        this.calendarDayOptionByDate = (date) => page.getByTestId(`calendar-day-${date}`);
    }
}