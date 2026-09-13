import type { PostBlock } from '../interfaces'
import { personalData } from './personal'

const operator = [personalData.contact.givenName, personalData.contact.familyName].filter(Boolean).join(' ')
const email = personalData.contact.email

/**
 * The privacy policy, as data — rendered at `/privacy` by the Journal's block renderer.
 *
 * Written from what the code actually does, not from a template. Every service named here
 * is one the site really loads: Google Tag Manager → GA4 in `app/layout.tsx`, AdSense on
 * Journal posts, Iconify from client components, Railway + Cloudflare in front of it all.
 * Nothing is disclosed that the site does not do — `next/font` self-hosts the fonts, so
 * Google Fonts receives no request and is not mentioned.
 *
 * When a data flow changes — a new script, a new vendor — this file changes in the same
 * commit and `updatedAt` moves. The advertising section carries the disclosures Google
 * requires of every AdSense publisher. Outbound links are checked by `links:external`.
 */
export const privacyPolicy: { updatedAt: string; body: PostBlock[] } = {
	updatedAt: '2026-09-14',
	body: [
		{
			kind: 'callout',
			tone: 'info',
			title: 'The short version',
			text: 'This is a personal site. It has no accounts, no forms and no comments. Google Analytics counts visits across the site, and Journal posts may show ads from Google AdSense. Those two Google services are the only things that set cookies here, and both can be refused without anything on the site breaking.'
		},
		{ kind: 'h2', text: 'Who runs this site' },
		{
			kind: 'p',
			text: `nooobtimex.me is the personal portfolio and engineering journal of ${operator}, based in Thailand, who is responsible for the data practices described here. Questions or requests about your data go to [${email}](mailto:${email}).`
		},
		{ kind: 'h2', text: 'What the site collects itself' },
		{
			kind: 'p',
			text: "Nothing you type, because there is nothing to type into: no sign-up, no comments, no contact form. The contact page lists email and messaging links that open your own apps, so anything you send travels through those services rather than through this site. The site's own code sets no cookies and uses no browser storage; the cookies described below come from Google's analytics and advertising services."
		},
		{ kind: 'h2', text: 'Hosting and network requests' },
		{
			kind: 'p',
			text: 'Pages are served by an application hosted on [Railway](https://railway.com/legal/privacy), behind [Cloudflare](https://www.cloudflare.com/privacypolicy/), which terminates the encrypted connection. Like any web server, they process your IP address, browser user agent, the URL you requested and the time of the request in order to deliver the page and protect the service, and they may keep request logs under their own policies.'
		},
		{
			kind: 'p',
			text: 'Some icons are drawn by your browser from the Iconify API at `api.iconify.design`, so that service receives the same basic request data when a page shows one.'
		},
		{ kind: 'h2', text: 'Analytics' },
		{
			kind: 'p',
			text: 'Every page loads Google Tag Manager, which runs Google Analytics 4. Analytics sets cookies such as `_ga` and `_ga_*` to count visits and to tell a returning browser from a new one, and reports usage in aggregate: pages viewed, how visitors arrived, approximate location and device type. Google processes that data as described in [how Google uses information from sites that use its services](https://policies.google.com/technologies/partner-sites).'
		},
		{
			kind: 'p',
			text: "To opt out, block cookies for this site in your browser settings, use a content blocker, or install [Google's Analytics opt-out browser add-on](https://tools.google.com/dlpage/gaoptout)."
		},
		{ kind: 'h2', text: 'Advertising' },
		{
			kind: 'p',
			text: 'Journal posts — pages under `/blog/` — may show ads served by Google AdSense. No other page on the site carries ads.'
		},
		{
			kind: 'list',
			items: [
				'Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this website or to other websites.',
				"Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet. [How Google uses cookies in advertising](https://policies.google.com/technologies/ads) explains what those cookies do.",
				'You can opt out of personalized advertising from Google in [My Ad Center](https://myadcenter.google.com/).',
				'You can opt out of personalized advertising from other participating vendors at [YourAdChoices](https://youradchoices.com/) or, in Europe, [Your Online Choices](https://youronlinechoices.eu/).'
			]
		},
		{
			kind: 'p',
			text: 'Ads may also be served, and cookies set, by other ad technology providers that Google certifies. If you are in the European Economic Area, the United Kingdom or Switzerland, pages that show ads ask for your consent first through a Google-certified consent message, which also offers a way to change that choice later.'
		},
		{ kind: 'h2', text: 'Your choices and rights' },
		{
			kind: 'p',
			text: 'Everything above can be refused: block cookies, use the opt-outs linked in each section, or browse with a content blocker. The site works the same either way.'
		},
		{
			kind: 'p',
			text: `Under Thailand's Personal Data Protection Act you may ask to access personal data about you, to have it corrected or deleted, to restrict or object to its processing, to withdraw consent you gave, and to receive it in a portable form. The site keeps no accounts or profiles, so most of that data sits with the services named above, each of which offers its own controls — but write to [${email}](mailto:${email}) and I will help with any request. You can also complain to Thailand's [Personal Data Protection Committee](https://www.pdpc.or.th/).`
		},
		{
			kind: 'p',
			text: 'Some of these services process data outside Thailand, including in the United States.'
		},
		{ kind: 'h2', text: 'Children' },
		{
			kind: 'p',
			text: 'The site is written for a professional audience and is not directed at children.'
		},
		{ kind: 'h2', text: 'Changes to this policy' },
		{
			kind: 'p',
			text: "When what the site does with data changes, this page changes in the same update and the date above moves with it. Every revision is public in the site's [commit history](https://github.com/NooobtimeX/NooobtimeX/commits/main)."
		}
	]
}
