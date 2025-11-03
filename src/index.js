import "./styles.css";

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
     function convertMphToKmh(mph) {
        return (mph * 1.60934).toFixed(1);
    }
    function convertFahrenheitToCelsius(f) {
        return ((f - 32) * 5 / 9).toFixed(1);
    }
    function convert24To12HourFormat(time){
    const date = new Date(`2000-01-01T${time}`);
    return date.toLocaleTimeString('en-US',{
        hour:'numeric',
        minute: '2-digit',
        hour12:true
    });
    }
    return{
        getResponse,
        getSpecificDataFromResponse,
        getCurrentUnit,
        toggleCurrentUnit,
        getCurrentDataObject,
        convertMphToKmh,
        convertFahrenheitToCelsius,
        convert24To12HourFormat,
    }
}
function HandleDom(){
    const input = document.querySelector("input");
    function displayDataOnDomInImperial(specificData, dataHandler){
        const locationNameH1 = document.querySelector(".name");
        locationNameH1.textContent=specificData.address[0].toUpperCase()+ specificData.address.slice(1);
        const descriptionH3 = document.querySelector(".description");
        descriptionH3.textContent = specificData.description;
        const realTempH2 = document.querySelector(".real-temperature h2");
        realTempH2.textContent=specificData.temp;
        const feelsLikeTempH3 = document.querySelector(".feels-like p");
        feelsLikeTempH3.textContent = "Feels Like: "+ specificData.feelslike;
        const conditionsP = document.querySelector(".conditions");
        conditionsP.textContent=specificData.conditions;
        const windSpeedP = document.querySelector(".wind-speed");
        windSpeedP.textContent= "Wind Speed: "+ specificData.windspeed + " mph";
        const humidityP = document.querySelector(".humidity");
        humidityP.textContent="Humidity: "+ specificData.humidity+" %";
        const timezoneP = document.querySelector(".timezone");
        timezoneP.textContent="Timezone: "+specificData.timezone;
        const tempMinP = document.querySelector(".temp-min p");
        tempMinP.textContent = "L: " + specificData.tempmin;
        const tempMaxP = document.querySelector(".temp-max p");
        tempMaxP.textContent = "H: " + specificData.tempmax;
        let sunriseIn12Format = dataHandler.convert24To12HourFormat(specificData.sunrise);
        const sunriseP = document.querySelector(".sunrise");
        sunriseP.textContent = "Sunrise: " + sunriseIn12Format;
        let sunsetIn12Format = dataHandler.convert24To12HourFormat(specificData.sunset);
        const sunsetP = document.querySelector(".sunset");
        sunsetP.textContent = "Sunset: " + sunsetIn12Format;
    }
    function displayDataOnDomInMetric(specificData,dataHandler){
        const realTempH2 = document.querySelector(".real-temperature h2");
        realTempH2.textContent=dataHandler.convertFahrenheitToCelsius(specificData.temp);
        const feelsLikeTempH3 = document.querySelector(".feels-like p");
        feelsLikeTempH3.textContent = "Feels Like: "+dataHandler.convertFahrenheitToCelsius(specificData.feelslike);
        const windSpeedP = document.querySelector(".wind-speed");
        windSpeedP.textContent= "Wind Speed: "+ dataHandler.convertMphToKmh(specificData.windspeed)+" km/h";
        const tempMinP = document.querySelector(".temp-min p");
        tempMinP.textContent = "L: " + dataHandler.convertFahrenheitToCelsius(specificData.tempmin);
        const tempMaxP = document.querySelector(".temp-max p");
        tempMaxP.textContent = "H: " + dataHandler.convertFahrenheitToCelsius(specificData.tempmax);
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
        const tempUnitSpan = document.querySelectorAll(".temperature-unit");
        if(unit==='F'){
            tempUnitSpan.forEach(span => span.textContent = "°F");
        }else{
            tempUnitSpan.forEach(span => span.textContent = "℃");
        }
    }
    
    return {displayDataOnDomInImperial,displayDataOnDomInMetric,resetInputValue, getInputValue,setInputValue,updateUnitDisplay};
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
             domHandler.displayDataOnDomInImperial(specificData,dataHandler);
             domHandler.updateUnitDisplay('F');
          })
          domHandler.resetInputValue();
        })
        const changeUnitButton= document.querySelector(".change-unit");
        changeUnitButton.addEventListener("click",function(){
            if(dataHandler.getCurrentUnit()==='F'){
              const dataInFahrenheit = dataHandler.getCurrentDataObject();
               domHandler.displayDataOnDomInMetric(dataInFahrenheit, dataHandler); 
               dataHandler.toggleCurrentUnit();
               domHandler.updateUnitDisplay('C');
            }else if(dataHandler.getCurrentUnit()==='C'){
                const dataInFahrenheit = dataHandler.getCurrentDataObject();
                domHandler.displayDataOnDomInImperial(dataInFahrenheit,dataHandler);
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





