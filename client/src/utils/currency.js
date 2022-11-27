export const currency = (cents, format = 'USD') => {
    const dollars = cents / 100;
    return dollars.toLocaleString('en-US', { style: 'currency', currency: format });
};
