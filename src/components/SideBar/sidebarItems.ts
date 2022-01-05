const sidebarItems = [
    {
        name: 'Projects',
        icon: 'list_alt',
        link: '/projects',
        external: false,
        iconClass: 'material-icons',
    },
    {
        name: 'Profile',
        icon: 'perm_identity',
        link: '/profile',
        external: false,
        iconClass: 'material-icons',
    },
    {
        name: 'Payout Addresses',
        icon: 'payments',
        link: '/payout-addresses',
        external: false,
        iconClass: 'material-icons',
    },
    {
        name: "Project's Payments",
        icon: 'paid',
        link: '/project-payments',
        external: false,
        iconClass: 'material-icons',
    },
    {
        name: 'Payouts',
        icon: 'receipt',
        link: '/payouts',
        external: false,
        iconClass: 'material-icons',
    },
    {
        name: 'Docs',
        icon: 'article',
        link:
            process.env.REACT_APP_SITE_TYPE === 'production'
                ? 'https://gpdocs.ekata.io'
                : 'https://gatewayprocessordocs.ekata.io',
        external: true,
        iconClass: 'material-icons',
    },
    {
        name:
            process.env.REACT_APP_SITE_TYPE === 'production'
                ? 'Testnet'
                : 'Mainnet',
        icon: 'circle',
        link:
            process.env.REACT_APP_SITE_TYPE === 'production'
                ? 'https://gatewayprocessorconsole.ekata.io'
                : 'https://gpconsole.ekata.io',
        external: true,
        iconClass: 'material-icons-outlined',
    },
]

export default sidebarItems
