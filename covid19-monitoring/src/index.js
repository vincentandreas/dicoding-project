import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import "./style/style.css";
function main() {
    let resCountries;
    const getCountries = () => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const responseJson = JSON.parse(this.responseText);
            if (responseJson.error) {
                showResponseMessage(responseJson.message);
            } else {
                resCountries = responseJson.countries;
                renderListCountry(responseJson.countries);
            }
        }

        xhr.onerror = function () {
            showResponseMessage();
        }
        xhr.open("GET", "https://covid19.mathdro.id/api/countries");
        xhr.send();
    };

    const getCountryDataByCountryName = (countryName) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const responseJson = JSON.parse(this.responseText);
            if (responseJson.error) {
                showResponseMessage(responseJson.message);
            } else {
                renderCountryData(responseJson);
            }
        }

        xhr.onerror = function () {
            showResponseMessage();
        }
        xhr.open("GET", "https://covid19.mathdro.id/api/countries/" + countryName);
        xhr.send();
    };

    const showResponseMessage = (message = "Check your internet connection") => {
        alert(message);
    };

    const renderCountryData = (countryData) => {
        const countryConfirm = document.querySelector("#countryConfirm");
        const countryRecover = document.querySelector("#countryRecover");
        const countryDeath = document.querySelector("#countryDeath");
        const dataDescription = document.querySelectorAll(".dataDescription");
        countryConfirm.innerHTML = countryData.confirmed.value;
        countryRecover.innerHTML = countryData.recovered.value;
        countryDeath.innerHTML = countryData.deaths.value;
        dataDescription.style.display = 'block';
    };
    const renderListCountry = (countries) => {
        const listCountryElement = document.querySelector("#listCountry");
        listCountryElement.innerHTML = "";
        countries.forEach(country => {
            listCountryElement.innerHTML += `
                <option value="${country.name}">${country.name}</option>
            `;
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        const buttonSearch = document.querySelector("#buttonSearch");
        const listCountryElement = document.querySelector("#listCountry");
        const countryName = document.querySelector("#countryName");
        getCountries();

        buttonSearch.addEventListener("click", function () {
            let index = listCountryElement.selectedIndex;
            let name = listCountryElement[index].value;
            countryName.innerHTML = name;
            getCountryDataByCountryName(name);
            countryName.style.display = 'block';
            let arrayOfElements = document.getElementsByClassName('dataDescription');
            let arrayOfNumberData = document.getElementsByClassName('numberData');
            let lengthOfArray = arrayOfElements.length;
            
            for (let i = 0; i < lengthOfArray; i++) {
                arrayOfNumberData[i].style.display = 'block';
                arrayOfElements[i].style.display = 'block';
            }
        });
    });
}

class CovidData extends HTMLElement {
    connectedCallback() {
        this.confirm = this.getAttribute("confirm") || null;
        this.recover = this.getAttribute("recover") || null;
        this.death = this.getAttribute("death") || null;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this[name] = newValue;
        this.render();
    }
    static get observedAttributes() {
        return ["confirm","recover","death"];
    }

    render(){
        this.innerHTML = `
      <div class="divData">
      <div id="countryConfirm" class="numberData">${this.confirm}</div>
      <div class="dataDescription">Confirmed</div> 
      </div>
      <div class="divData">
        <div id="countryRecover" class="numberData">${this.recover}</div>
        <div class="dataDescription">Recovered</div>
      </div>
      <div class="divData">
        <div id="countryDeath" class="numberData">${this.death}</div>
        <div class="dataDescription">Deaths</div>
      </div>
      `;
    }
}

customElements.define("covid-data", CovidData);
const covidDataElement = document.createElement("covid-data");
covidDataElement.setAttribute("confirm", "0");
covidDataElement.setAttribute("recover", "0");
covidDataElement.setAttribute("death", "0");

main();