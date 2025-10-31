import "./styles.css";


function HandleData(){
function getResponse(location) {
    const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+ location + "?unitGroup=us&include=days,current,alerts,events&key=3ZSBAJWVFDWUTUYMPVB3LUDP2&contentType=json";
    const request = new Request(url);
    return fetch(request).then(function(response){
        return response;
     }).catch(function(error){
        console.log("something went wrong: " + error)
     })
}
function getSpecificDataFromResponse(response){
    return response.json().then(function(data){
        
        const dataArray = {
            address: data.address,
            datetime: data.currentConditions.datetime,
            conditions: data.currentConditions.conditions,
            temp: data.currentConditions.temp,
            feelslike: data.currentConditions.feelslike,
            humidity: data.currentConditions.humidity,
            sunrise: data.currentConditions.sunrise,
            sunset: data.currentConditions.sunset,
            windspeed: data.currentConditions.windspeed,
            timezone: data.timezone
        };
        return dataArray;
    })
}
return{
    getResponse,
    getSpecificDataFromResponse
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
        feelsLikeTempH3.textContent = specificData.feelslike;
        const dateTimeP = document.querySelector(".date-time");
        dateTimeP.textContent=specificData.datetime;
        const cloudCoverP = document.querySelector(".cloudcover");
        cloudCoverP.textContent=specificData.cloudcover;
        const conditionsP = document.querySelector(".conditions");
        conditionsP.textContent=specificData.conditions;
        const windSpeedP = document.querySelector(".wind-speed");
        windSpeedP.textContent=specificData.windspeed;

    }
    function resetInputValue(){
        input.value="";
    }
    function getInputValue(){
        return input.value;
    }
    return {displayDataOnDom,resetInputValue, getInputValue};
}
function HandleEvents(){
    const domHandler = new HandleDom();
    const dataHandler = new HandleData();
        function addEventListeners(){
        const button = document.querySelector("button");
        button.addEventListener("click", function(){
          dataHandler.getResponse(domHandler.getInputValue()).then(function(response){
            return dataHandler.getSpecificDataFromResponse(response)
          }).then(function(specificData){
             domHandler.displayDataOnDom(specificData);
          })
          domHandler.resetInputValue();
        })
    }
    return {addEventListeners};
}
const eventHandler = new HandleEvents();
eventHandler.addEventListeners();



