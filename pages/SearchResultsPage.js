export class SearchResultsPage {

    /**
     * @param {import('@playwright/test').Page } page
     */
    constructor(page) {
        /** @type {import('@playwright/test').Page } */
        this.page = page;

        this.resultsHeader = page.getByTestId('stays-page-heading');
        this.cardContainer = page.getByTestId('card-container');
    }
}