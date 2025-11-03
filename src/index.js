import "./styles.css";

import cloudyNight from './assets/backgrounds/cloudy-sky-nighttime.jpg';
import clearNight from './assets/backgrounds/clear-sky-nighttime.jpg';
import cloudyDay from './assets/backgrounds/cloudy-sky-daytime.jpg';
import rainyCloudyDay from './assets/backgrounds/rainy-cloudy-sky-daytime.jpg';
import clearDay from './assets/backgrounds/clear-sky-daytime.jpg';


function HandleData(){
    let currentUnit = 'F';
    let currentDataObjectInFahrenheit;
    function getCurrentUnit(){
        return currentUnit;
    }
    function toggleCurrentUnit(){
        if(currentUnit==='F'){
            currentUnit = 'C'
        }else{
            currentUnit = 'F';
        }
    }
function getResponse(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&include=days,current,alerts,events&key=3ZSBAJWVFDWUTUYMPVB3LUDP2&contentType=json`;
    const request = new Request(url);
    return fetch(request).then(function(response){
        return response;
     }).catch(function(error){
        console.log("something went wrong: " + error)
     })
}
function getSpecificDataFromResponse(response){
    return response.json().then(function(data){
        console.log(data);
        const dataObject = {
            address: data.address,
            temp: data.currentConditions.temp,
            tempmin: data.days[0].tempmin,
            tempmax: data.days[0].tempmax,
            feelslike: data.currentConditions.feelslike,
            conditions: data.days[0].conditions,
            windspeed: data.currentConditions.windspeed,
            humidity: data.currentConditions.humidity,
            timezone: data.timezone,
            sunset: data.currentConditions.sunset,
            sunrise: data.currentConditions.sunrise,
            description: data.days[0].description,
            datetime: data.currentConditions.datetime,
        };
        currentDataObjectInFahrenheit = dataObject;
        return dataObject;
    })
}
function getCurrentDataObject(){
    return currentDataObjectInFahrenheit;
}
function convertCurrentDataToMetric(){
    const dataInCelsius= {
    address : currentDataObjectInFahrenheit.address,
    temp: convertFahrenheitToCelsius(currentDataObjectInFahrenheit.temp),
    tempmin: convertFahrenheitToCelsius(currentDataObjectInFahrenheit.tempmin),
    tempmax: convertFahrenheitToCelsius(currentDataObjectInFahrenheit.tempmax),
    feelslike:  convertFahrenheitToCelsius(currentDataObjectInFahrenheit.feelslike),
    windspeed: convertMphToKmh(currentDataObjectInFahrenheit.windspeed),
    humidity: currentDataObjectInFahrenheit.humidity,
    timezone: currentDataObjectInFahrenheit.timezone,
    sunset: currentDataObjectInFahrenheit.sunset,
    sunrise: currentDataObjectInFahrenheit.sunrise
    }
    return dataInCelsius
}

function convertMphToKmh(mph) {
    return (mph * 1.60934).toFixed(1);
}

function convertKmhToMph(kmh) {
    return (kmh / 1.60934).toFixed(1);
}

function convertFahrenheitToCelsius(f) {
    return ((f - 32) * 5 / 9).toFixed(1);
}

function convertCelsiusToFahrenheit(c) {
    return ((c * 9 / 5) + 32).toFixed(1);
}
return{
    getResponse,
    getSpecificDataFromResponse,
    convertMphToKmh,
    convertKmhToMph,
    convertFahrenheitToCelsius,
    convertCelsiusToFahrenheit,
    getCurrentUnit,
    toggleCurrentUnit,
    convertCurrentDataToMetric,
    getCurrentDataObject,
}
}
function HandleDom(){
    const input = document.querySelector("input");
    function displayDataOnDom(specificData){
        const locationNameH1 = document.querySelector(".name");
        locationNameH1.textContent=specificData.address;
        const realTempH2 = document.querySelector(".real-temperature");
        realTempH2.textContent=specificData.temp;
        const feelsLikeTempH3 = document.querySelector(".feels-like");
        feelsLikeTempH3.textContent = "Feels Like: "+ specificData.feelslike;
        const conditionsP = document.querySelector(".conditions");
        conditionsP.textContent=specificData.conditions;
        const windSpeedP = document.querySelector(".wind-speed");
        windSpeedP.textContent= "Wind Speed: "+ specificData.windspeed;
        const humidityP = document.querySelector(".humidity");
        humidityP.textContent="Humidity: "+ specificData.humidity+" %";
        const timezoneP = document.querySelector(".timezone");
        timezoneP.textContent="Timezone: "+specificData.timezone;
        const tempMinP = document.querySelector(".temp-min");
        tempMinP.textContent = "L: " + specificData.tempmin;
        const tempMaxP = document.querySelector(".temp-max");
        tempMaxP.textContent = "H: " + specificData.tempmax;
        const sunriseP = document.querySelector(".sunrise");
        sunriseP.textContent = "Sunrise: " + specificData.sunrise;
        const sunsetP = document.querySelector(".sunset");
        sunsetP.textContent = "Sunset: " + specificData.sunset;
    }
    function resetInputValue(){
        input.value="";
    }
    function getInputValue(){
        return input.value;
    }
    function setInputValue(value){
        input.value = value;
    }
    function updateUnitDisplay(unit){
        const tempUnitSpan = document.querySelector(".temperature-unit");
        tempUnitSpan.textContent=unit;
    }
    function setBackground(specificData){
        const conditions = specificData.conditions;
        const datetime = specificData.datetime;
        const sunrise = specificData.sunrise;
        const sunset  = specificData.sunset;
        const body = document.querySelector("body");
        let imageUrl;
        let formattedConditions = conditions.toLowerCase();
        if(datetime < sunrise || datetime > sunset){
            if(formattedConditions.includes("cloudy")||formattedConditions.includes("rain")){
                imageUrl = cloudyNight;
            }else{
                imageUrl = clearNight;
            }
        }else{
            if(formattedConditions.includes("cloudy") && !formattedConditions.includes("rain")){
                imageUrl = cloudyDay;
            }else if(formattedConditions.includes("cloudy") && formattedConditions.includes("rain")){
                imageUrl = rainyCloudyDay;
            }else{
                imageUrl = clearDay;
            }
        }
        body.style.backgroundImage = `url('${imageUrl}')`;
    }
    return {displayDataOnDom,resetInputValue, getInputValue,setInputValue,updateUnitDisplay,setBackground};
}
function HandleEvents(){
    const domHandler = new HandleDom();
    const dataHandler = new HandleData();
        function addEventListeners(){
        const button = document.querySelector(".search");
        button.addEventListener("click", function(){
          dataHandler.getResponse(domHandler.getInputValue()).then(function(response){
            return dataHandler.getSpecificDataFromResponse(response)
          }).then(function(specificData){
             domHandler.displayDataOnDom(specificData);
             domHandler.setBackground(specificData);
          })
          domHandler.resetInputValue();
        })
        const changeUnitButton= document.querySelector(".change-unit");
        changeUnitButton.addEventListener("click",function(){
            if(dataHandler.getCurrentUnit()==='F'){
              const dataInMetric = dataHandler.convertCurrentDataToMetric();
               domHandler.displayDataOnDom(dataInMetric); 
               dataHandler.toggleCurrentUnit();
               domHandler.updateUnitDisplay('C');
            }else if(dataHandler.getCurrentUnit()==='C'){
                domHandler.displayDataOnDom(dataHandler.getCurrentDataObject());
                console.log(dataHandler.getCurrentDataObject());
                dataHandler.toggleCurrentUnit();
                domHandler.updateUnitDisplay('F');
            }
        })
    }
    return {addEventListeners};
}
function startProgram(){
    const domHandler = new HandleDom();
    const eventHandler = new HandleEvents();
    eventHandler.addEventListeners();
    const button = document.querySelector("button");
    domHandler.setInputValue("berlin");
    button.click();
}
startProgram();





