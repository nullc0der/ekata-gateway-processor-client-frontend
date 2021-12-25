// TODO: need to make it a API call, fetch this info from backend
export const ALLOWED_CURRENCY =
    process.env.REACT_APP_SITE_TYPE === 'production'
        ? ['bitcoin', 'dogecoin', 'monero', 'baza']
        : ['bitcoin', 'dogecoin']
