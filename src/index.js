import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import countryInfoTpl from './templates/country-info.hbs';
import countryListTpl from './templates/country-list.hbs';
import API from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    cardList: document.querySelector('.country-list'),
    cardInfo: document.querySelector('.country-info')
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    e.preventDefault();
    const name = e.target.value.trim();
    refs.cardList.innerHTML = "";
    refs.cardInfo.innerHTML = "";
    if (name) {
        API.fetchCountries(name)
            .then(renderCountryData)
            .catch(onFetchError)
    }
}

function renderCountryData(countries) {
    refs.cardList.innerHTML = "";
    refs.cardInfo.innerHTML = "";
    if (countries.length > 10) {
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (countries.length >= 2 && countries.length <= 10) {
        const markupList = countryListTpl(countries);
        refs.cardList.innerHTML = markupList;
    } else {
        const markupInfo = countryInfoTpl(countries);
        refs.cardInfo.innerHTML = markupInfo;
    }
}

function onFetchError(error) {
    return Notiflix.Notify.failure('Oops, there is no country with that name');
}