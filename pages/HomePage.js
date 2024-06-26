export class HomePage {

    /**
     * @param {import('@playwright/test').Page } page
     */
    constructor(page) {
        /** @type {import('@playwright/test').Page } */
        this.page = page;


    }

    async goToHomePage() {
        await this.page.goto('https://www.airbnb.com/');
    }
}