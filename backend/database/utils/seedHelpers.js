/* eslint-disable no-plusplus */
/* eslint-disable no-continue */

// this function takes an array and divides it out into an array of multiple arrays depeneding on SIZE variable
const chunkArray = (arr, size) => (arr.length > size ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)] : [arr]);

const randomr = (num, max) => {
    if (num && !max) {
        return Math.floor(Math.random() * num); // mainly used for array indexs
    }
    return Math.floor(Math.random() * (max - num + 1)) + num; // used for between min and max
};

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function colorRandomizer() {
    const colors_list = [
        { id: 1, name: 'Black', color: '#000000' },
        { id: 2, name: 'White', color: '#FFFFFF' },
        { id: 3, name: 'Gunmetal', color: '#2C3539' },
        { id: 4, name: 'Smoke', color: '#726E6D' },
        { id: 5, name: 'Slate Blue', color: '#98AFC7' },
        { id: 6, name: 'Steel', color: '#4863A0' },
        { id: 7, name: 'Navy', color: '#151B54' },
        { id: 8, name: 'Colbalt', color: '#0020C2' },
        { id: 9, name: 'Royal', color: '#2B60DE' },
        { id: 10, name: 'Glacier', color: '#368BC1' },
        { id: 11, name: 'Crystal', color: '#5CB3FF' },
        { id: 12, name: 'Coral Blue', color: '#AFDCEC' },
        { id: 13, name: 'Cyan', color: '#00FFFF' },
        { id: 14, name: 'Sea Green', color: '#438D80' },
        { id: 15, name: 'Teal', color: '#008080' },
        { id: 16, name: 'Forest', color: '#254117' },
        { id: 17, name: 'Jungle Green', color: '#347C2C' },
        { id: 18, name: 'Lime', color: '#41A317' },
        { id: 19, name: 'Apple Green', color: '#4CC417' },
        { id: 20, name: 'Mint', color: '#98FF98' },
        { id: 21, name: 'Yellow', color: '#FFFF00' },
        { id: 22, name: 'Cream', color: '#FFFFCC' },
        { id: 23, name: 'Champagne', color: '#F7E7CE' },
        { id: 24, name: 'Peach', color: '#FFE5B4' },
        { id: 25, name: 'Athletic Gold', color: '#FDD017' },
        { id: 26, name: 'Bronze', color: '#CD7F32' },
        { id: 27, name: 'Copper', color: '#B87333' },
        { id: 28, name: 'Pumpkin', color: '#F87217' },
        { id: 29, name: 'Salmon', color: '#F9966B' },
        { id: 30, name: 'Red', color: '#FF0000' },
        { id: 31, name: 'Deep Red', color: '#E41B17' },
        { id: 32, name: 'Cranberry', color: '#9F000F' },
        { id: 33, name: 'Maroon', color: '#810541' },
        { id: 34, name: 'Pink', color: '#FAAFBE' },
        { id: 35, name: 'Hot Pink', color: '#F52887' },
        { id: 36, name: 'Purple', color: '#571B7E' },
        { id: 37, name: 'Violet', color: '#8D38C9' },
    ];
    const res = [];
    for (let i = 0; i < 2;) {
        const random = Math.floor(Math.random() * colors_list.length);
        if (res.indexOf(colors_list[random]) !== -1) {
            continue;
        }
        res.push(colors_list[random]);
        i++;
    }
    return JSON.stringify(res);
}

module.exports = {
    chunkArray,
    randomr,
    colorRandomizer,
    wait,
};
