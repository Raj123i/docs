import { jest } from '@jest/globals'

import { getDOM, getJSON } from '../helpers/e2etest.js'
import { describeIfDocsEarlyAccess } from '../helpers/conditional-runs.js'

describe('breadcrumbs', () => {
  jest.setTimeout(300 * 1000)

  describe('rendering', () => {
    test('top-level product pages have breadcrumbs', async () => {
      const $ = await getDOM('/repositories')
      expect($('[data-testid=breadcrumbs]')).toHaveLength(1)
    })

    test('article pages have breadcrumbs with product, category, maptopic, and article', async () => {
      const $ = await getDOM(
        '/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/adding-an-email-address-to-your-github-account'
      )
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')

      expect($breadcrumbs).toHaveLength(4)
      expect($breadcrumbs[0].attribs.title).toBe('Account and profile')
      expect($breadcrumbs[1].attribs.title).toBe('Personal accounts')
      expect($breadcrumbs[2].attribs.title).toBe('Manage email preferences')
      expect($breadcrumbs[3].attribs.title).toBe('Add an email address')
    })

    test('maptopic pages include their own grayed-out breadcrumb', async () => {
      const $ = await getDOM(
        '/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences'
      )
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')

      expect($breadcrumbs).toHaveLength(3)
      expect($breadcrumbs[0].attribs.title).toBe('Account and profile')
      expect($breadcrumbs[1].attribs.title).toBe('Personal accounts')
      expect($breadcrumbs[2].attribs.title).toBe('Manage email preferences')
      expect($breadcrumbs[2].attribs.class.includes('color-fg-muted')).toBe(true)
    })

    test('works for enterprise user pages', async () => {
      const $ = await getDOM(
        '/en/enterprise-server/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/adding-an-email-address-to-your-github-account'
      )
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')
      expect($breadcrumbs).toHaveLength(4)
      expect($breadcrumbs[0].attribs.title).toBe('Account and profile')
    })

    test('works for ghec billing page', async () => {
      const $ = await getDOM(
        '/enterprise-cloud@latest/billing/managing-billing-for-your-github-account/about-billing-for-your-enterprise'
      )
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')
      expect($breadcrumbs).toHaveLength(3)
      expect($breadcrumbs[0].attribs.title).toBe('Billing and payments')
    })

    test('works for pages that have overlapping product names', async () => {
      const $ = await getDOM(
        // article path has overlap with `/en/github`
        '/en/github-cli/github-cli/about-github-cli'
      )
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')
      expect($breadcrumbs).toHaveLength(3)
      expect($breadcrumbs[0].attribs.title).toBe('GitHub CLI')
      expect($breadcrumbs[1].attribs.title).toBe('GitHub CLI')
      expect($breadcrumbs[2].attribs.title).toBe('About GitHub CLI')
    })

    test('parses Liquid variables inside titles', async () => {
      const $ = await getDOM('/en/education/manage-coursework-with-github-classroom')
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')
      expect($breadcrumbs).toHaveLength(2)
      expect($breadcrumbs[1].attribs.title).toBe('GitHub Classroom')
    })

    test('English breadcrumbs link to English pages', async () => {
      const $ = await getDOM('/en/get-started/learning-about-github')
      const $breadcrumbs = $('[data-testid=breadcrumbs] a')
      expect($breadcrumbs[0].attribs.href).toBe('/en/get-started')
    })
  })

  describeIfDocsEarlyAccess('early access rendering', () => {
    test('top-level product pages have breadcrumbs', async () => {
      const $ = await getDOM('/early-access/github/articles/using-gist-playground')
      expect($('[data-testid=breadcrumbs]')).toHaveLength(1)
    })

    test('early access article pages have breadcrumbs with product, category, and article', async () => {
      const $ = await getDOM(
        '/early-access/enterprise-importer/understanding-github-enterprise-importer'
      )
      const $breadcrumbTitles = $('[data-testid=breadcrumbs] [data-testid=breadcrumb-title]')
      const $breadcrumbLinks = $('[data-testid=breadcrumbs] a')

      expect($breadcrumbTitles).toHaveLength(0)
      expect($breadcrumbLinks).toHaveLength(2)
      expect($breadcrumbLinks[0].attribs.title).toBe('GitHub Enterprise Importer')
      expect($breadcrumbLinks[1].attribs.title).toBe('Understand the Importer')
      expect($breadcrumbLinks[1].attribs.class.includes('color-fg-muted')).toBe(true)
    })
  })

  describe('breadcrumbs object', () => {
    test('works on product index pages', async () => {
      const breadcrumbs = await getJSON('/en/repositories?json=breadcrumbs')
      const expected = [
        {
          href: '/en/repositories',
          title: 'Repositories',
        },
      ]
      expect(breadcrumbs).toEqual(expected)
    })

    test('works on category index pages', async () => {
      const breadcrumbs = await getJSON(
        '/en/issues/tracking-your-work-with-issues/quickstart?json=breadcrumbs'
      )
      const expected = [
        {
          href: '/en/issues',
          title: 'GitHub Issues',
        },
        {
          href: '/en/issues/tracking-your-work-with-issues',
          title: 'Issues',
        },
        {
          href: '/en/issues/tracking-your-work-with-issues/quickstart',
          title: 'Quickstart for GitHub Issues',
        },
      ]
      expect(breadcrumbs).toEqual(expected)
    })

    test('works on maptopic pages', async () => {
      const breadcrumbs = await getJSON(
        '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings?json=breadcrumbs'
      )
      const expected = [
        {
          href: '/en/account-and-profile',
          title: 'Account and profile',
        },
        {
          href: '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github',
          title: 'Personal accounts',
        },
        {
          href: '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings',
          title: 'Personal account settings',
        },
      ]
      expect(breadcrumbs).toEqual(expected)
    })

    test('works on articles that DO have maptopics ', async () => {
      const breadcrumbs = await getJSON(
        '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings/about-your-personal-dashboard?json=breadcrumbs'
      )
      const expected = [
        {
          href: '/en/account-and-profile',
          title: 'Account and profile',
        },
        {
          href: '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github',
          title: 'Personal accounts',
        },
        {
          href: '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings',
          title: 'Personal account settings',
        },
        {
          href: '/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-personal-account-settings/about-your-personal-dashboard',
          title: 'Your personal dashboard',
        },
      ]
      expect(breadcrumbs).toEqual(expected)
    })

    test('works on articles that DO NOT have maptopics ', async () => {
      const breadcrumbs = await getJSON(
        '/site-policy/privacy-policies/github-privacy-statement?json=breadcrumbs'
      )
      const expected = [
        {
          href: '/en/site-policy',
          title: 'Site policy',
        },
        {
          href: '/en/site-policy/privacy-policies',
          title: 'Privacy Policies',
        },
        {
          href: '/en/site-policy/privacy-policies/github-privacy-statement',
          title: 'GitHub Privacy Statement',
        },
      ]
      expect(breadcrumbs).toEqual(expected)
    })

    test('returns an empty array on the landing page', async () => {
      const breadcrumbs = await getJSON('/en?json=breadcrumbs')
      expect(breadcrumbs).toEqual([])
    })
  })
})
