export const GROUPS = [
  { title: 'Permits & paperwork', items: [
    ['Confirm address is inside City of Sacramento limits', 'Free'],
    ['City BOT + Home Occupation Permit', 'Per city email'],
    ['County EMD Class A registration', '$306'],
    ['Product list + label samples for EMD', ''],
    ['Fictitious business name, if needed', 'County fee'],
    ['CDTFA seller\u2019s permit check', 'Free'],
    ['Food safety training EMD lists', 'TBD'],
  ]},
  { title: 'Kitchen equipment', items: [
    ['Oven thermometer', 'Quote'],
    ['Kitchen scale', 'Quote'],
    ['Half sheet pans, 4+', 'Quote'],
    ['Parchment, cooling racks, bowls, mixer', 'If not owned'],
    ['Sealed, labeled ingredient containers', 'Quote'],
  ]},
  { title: 'Packaging & labels', items: [
    ['Bags or boxes for 3, 6, 12, and bulk packs', 'Quote'],
    ['Label template with all 8 required items', ''],
    ['Label printing after EMD review', 'Quote'],
    ['Thank-you / sponsor insert cards', 'Quote'],
  ]},
  { title: 'Fundraising tools', items: [
    ['Online giving page with tuition story', 'Platform fee'],
    ['Sponsor one-pager (this deck)', ''],
    ['List of 30 local businesses to ask', ''],
    ['Scholarship list + deadlines', ''],
    ['Sales log + donation log', 'Free'],
  ]},
];
export const ITEMS = GROUPS.flatMap(g => g.items.map(([label]) => label));
