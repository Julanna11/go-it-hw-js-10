import { fetchCountries }  from './fetchCountries.js';
import debounce from 'lodash.debounce';
import getRefs from './refs';
import countryCardTpl from './templates/country.hbs';
import countryCardMin from './templates/country_card.hbs'
import Notiflix from 'notiflix';
import './css/styles.css';


const DEBOUNCE_DELAY = 300;
const refs = getRefs();


refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
    const userInput = refs.input.value.trim();
    if (userInput === '') {
        clearCountryList();
        return;
    }
    fetchCountries(userInput)
        .then(handleResult)
        .catch(handleError);
    }

   //render cards

function renderCountry(values, template, target) {
    const markup =  values.map(element => template(element)).join('');
    target.innerHTML = markup;
};

function handleResult (result) {
    clearCountryList();
    if (result.length > 10) {
        Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
        return;
    }
    if (result.length === 1) {
        renderCountry(result, countryCardTpl, refs.countryInfo);
        return;
    }
    renderCountry(result, countryCardMin, refs.countryList);
};


function handleError(error) {
    if (error.message === 'country not found') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearCountryList();
    }
    else {
        console.log(error);
    }
}

function clearCountryList() {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
}