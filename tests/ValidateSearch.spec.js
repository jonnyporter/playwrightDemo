import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { NavBar } from '../pages/navBar';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { StayPage } from '../pages/StayPage';
const dateFormat = require('dateformat');

test('Validate Search with only Where', async ({ page, context }) => {

  const cityState = 'Portland, OR';
  const cityStateCountry = 'Portland, Oregon, United States';

  // Go to the home page
  const homePage = new HomePage(page);
  await homePage.goToHomePage();

  // Search for a location
  const navBar = new NavBar(page);
  await navBar.whereSearchInput.fill(cityState);
  await expect(
    navBar.optionByNumber(0).getByText(cityState)
      .or(navBar.optionByNumber(0).getByText(cityStateCountry))
  ).toBeVisible();

  await navBar.optionByNumber(0).click();
  await navBar.searchButton.click();

  // Validate results are relevant
  const resultsPage = new SearchResultsPage(page);
  await expect(resultsPage.resultsHeader).toHaveText('Over 1,000 places in Portland');
  await expect(resultsPage.cardContainer.nth(0)).toBeVisible();

  // Clicking on result opens a new tab
  const pagePromise = context.waitForEvent('page');
  await resultsPage.cardContainer.nth(0).click();
  const newPage = await pagePromise;

  const stayPage = new StayPage(newPage);
  await stayPage.whereYoullBeSection.getByText(cityStateCountry).scrollIntoViewIfNeeded();
  await expect(stayPage.whereYoullBeSection.getByText(cityStateCountry)).toBeVisible();
});

test('Validate Search with only Check in and Check out', async ({ page, context }) => {

  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formattedToday = dateFormat(today, 'mm/dd/yyyy');
  const formattedYesterday = dateFormat(yesterday, 'mm/dd/yyyy');
  const formattedTomorrow = dateFormat(tomorrow, 'mm/dd/yyyy');
  const checkIn = dateFormat(today, 'm/dd/yyyy');;
  const checkOut = dateFormat(tomorrow, 'm/dd/yyyy');

  // Go to the home page
  const homePage = new HomePage(page);
  await homePage.goToHomePage();

  // Search for stay by check in and check out dates
  const navBar = new NavBar(page);
  await navBar.checkInField.click()
  await expect(navBar.calendarDayOptionByDate(formattedYesterday)).toBeDisabled();
  await navBar.calendarDayOptionByDate(formattedToday).click();
  await navBar.calendarDayOptionByDate(formattedTomorrow).click();
  await navBar.searchButton.click();

  // Validate results are relevant
  // Clicking on result opens a new tab
  const resultsPage = new SearchResultsPage(page);
  const pagePromise = context.waitForEvent('page');
  await resultsPage.cardContainer.nth(0).click();
  const newPage = await pagePromise;

  const stayPage = new StayPage(newPage);
  await stayPage.checkInDateField.scrollIntoViewIfNeeded();
  await expect(stayPage.checkInDateField).toHaveText(checkIn);
  await expect(stayPage.checkOutDateField).toHaveText(checkOut);

  await stayPage.calendarDayOptionByDate(formattedToday).scrollIntoViewIfNeeded();
  await expect(stayPage.calendarDayOptionByDate(formattedToday)).toBeEnabled();
  await expect(stayPage.calendarDayOptionByDate(formattedTomorrow)).toBeEnabled();

  // Confirm correct dates are selected
  await expect(stayPage.calendarDayOptionByDate(formattedToday).locator('..')).toHaveAttribute('aria-label', /Selected/);
  await expect(stayPage.calendarDayOptionByDate(formattedTomorrow).locator('..')).toHaveAttribute('aria-label', /Selected/);

  await stayPage.calendarDayOptionByDate(formattedToday).hover();
  await expect(newPage.getByText('Check-in day')).toBeVisible();

  await stayPage.calendarDayOptionByDate(formattedTomorrow).hover();
  await expect(newPage.getByText('Checkout day')).toBeVisible();
});