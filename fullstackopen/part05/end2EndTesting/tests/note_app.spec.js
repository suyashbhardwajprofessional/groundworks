const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  /*Ensure that (it is assumed that) there's an empty database with a single user - mluukkai in it, & then*/
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('')
  })

  /*try logging into the newly created user with correct credentials- mluukkai*/
  test('user can login with correct credentials', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  /*try logging into the newly created user with incorrect credentials- mluukkai*/
  test.only('login fails with wrong password', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('wrong')
    await page.getByRole('button', { name: 'login' }).click()

    const errorDiv = await page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })

  describe('when logged in', () => {
    /*Ensure that (it is assumed that) the user mluukkai is logged in, & then*/
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    /*try creating a new note*/
    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      /*Ensure that a new note has been created already, & then*/
      beforeEach(async ({ page }) => {
        await createNote(page, 'a note created by playwright')
      })
  
      /*try changing it's importance*/
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {
      beforeEach(async ({ page }) => {

        await createNote(page, 'first note')
        await createNote(page, 'second note')
        await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        await page.pause()
        // const otherNoteElement = await page.getByText('first note')
        const otherNoteText = await page.getByText('second note')
        const otherNoteElement = await otherNoteText.locator('..')

        await otherNoteElement
          .getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})