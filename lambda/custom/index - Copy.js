/* eslint-disable  func-names */
/* eslint-disable  no-console */
const apartments =require('./apartments.json')
const Alexa = require('ask-sdk-core');
const data = JSON.stringify(apartments);
const data2=JSON.parse(data);
var flag1=0;
var flag2=0;
var j=0;
var blst=[];
var slst=[];
var ct;
const LaunchRequestHandler={
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    let outputSpeech = `Hello there! Welcome to Apartments Index. What are you looking for? `;

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();

  },
};

const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');
  },
  async handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const city = slots['city'].value;
    const price=slots['price'].value;
    var i;
    ct=0;
    for(i=0;i<data2.query.apartments.length;i++){
      slst=[];
      if(data2.query.apartments[i].city==city && data2.query.apartments[i].price<=price){
        slst.push(data2.query.apartments[i].name);
        slst.push(data2.query.apartments[i].price);
        blst.push(slst);
        ct++;
      }
    }
    let outputSpeech=`There are ${ct} apartments`
    j=0;
    if(ct==0){
      outputSpeech=`I didn't find any apartments satisfying the criteria. Would you like to search for some other apartments?`
      flag1=1;
      flag2=0;
    }
    else if(ct==1){
      outputSpeech=`There's only one apartment satifying the criteria which is ${blst[0][0]} that is priced at ${blst[0][1]} dollars. Would you like to search for some other apartments? `
      flag1=1;
      flag2=0;
    }
    else{
      j=0
      outputSpeech = `I found ${ct} apartments satisfying the criteria. The top one is ${blst[j][0]} which is priced at ${blst[j][1]} dollars. Would you like to know about the next one? `;
    flag1=0;
    flag2=1;
  }
    j++;
    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .reprompt(outputSpeech)
      .getResponse();

  },
};

const YesIntentHandler={
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent');
  },
  handle(handlerInput) {
    let speechText;
      if(flag1==0 && flag2==0){
        speechText = 'What do you mean? I do not understand. You can know about apartments in an area by saying show me apartments followed by the area'
      }
      else if(flag1==1){
        speechText = `Tell me what you are looking for`
        flag1=0;
      }
      else{
        if(j<ct-1){
        speechText=`The next one is ${blst[j][0]} which is priced at ${blst[j][1]}. Would you like to know about the next one?`
        j++;
      }
        else if(j==ct-1){
        speechText=`The last one is  ${blst[j][0]} which is priced at ${blst[j][1]}. Would you like to search for some other apartments?`
        flag2=0
        flag1=1
      }
    }

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .getResponse();
    },
}

const NoIntentHandler={
  canHandle(handlerInput) {
    return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent');
  },
  handle(handlerInput) {
    let speechText;
    if(flag1==0 && flag2==0){
      speechText = 'What do you mean? I do not understand. You can know about apartments in an area by saying show me apartments followed by the area'
    }
    else if(flag1==1){
      speechText= 'Goodbye'
      return handlerInput.responseBuilder
        .speak(speechText)
        .getResponse();
    }
    else{
      speechText='Would you like to search for some other apartments?'
      flag2=0;
      flag1=1;
    }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
},
};


// const AnswerIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//       && handlerInput.requestEnvelope.request.intent.name === 'AnswerIntent';
//   },
//   async handle(handlerInput) {
//     const slots = handlerInput.requestEnvelope.request.intent.slots;
//     const city = slots['CityName'].value;
//     let speechText = `Your city is ${city}.`
//     flag=1;
//     let entityid = 0;
//     let entitytype ="Dunno";
//     await getRemoteData('https://developers.zomato.com/api/v2.1/locations?query='+city+'&apikey=3e347a7e610c904bbf827e1f4cefb1d0')
//       .then((response) => {
//         const data = JSON.parse(response);
//         entityid=data.location_suggestions[0].entity_id;
//         entitytype=data.location_suggestions[0].entity_type;
//         //outputSpeech = `The entity id of ${city} is ${entitytype} `;
//       })
//       .catch((err) => {
//         //set an optional error message here
//         //outputSpeech = err.message;
//       });
//     await getRemoteData('https://developers.zomato.com/api/v2.1/location_details?entity_id='+entityid+'&entity_type='+entitytype+'&apikey=3e347a7e610c904bbf827e1f4cefb1d0')
//       .then((response2)=>{
//       const data2=JSON.parse(response2);
//       speechText=`There are ${data2.num_restaurant} restaurants in ${city}. The best ones are ${data2.best_rated_restaurant[0].restaurant.name} and ${data2.best_rated_restaurant[1].restaurant.name}. Would you like to know about some other city?`;
//     })
//     .catch((err) => {
//       speechText="https://developers.zomato.com/api/v2.1/location_details?entity_id='+entityid+'&entity_type='+entitytype+'&apikey=3e347a7e610c904bbf827e1f4cefb1d0";
//       //set an optional error message here
//       //outputSpeech = err.message;
//     });


// const CityNameIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//       && (handlerInput.requestEnvelope.request.intent.name === 'CityNameIntent'||handlerInput.requestEnvelope.request.intent.name==='AMAZON.YesIntent');
//   },
//   handle(handlerInput) {
//     //console.log("Im here");
//     let speechText;
//     if(handlerInput.requestEnvelope.request.intent.name === 'CityNameIntent'){
//       speechText = 'Which city would you like to know about?';
//   }
//     else{
//       if(flag==0){
//         speechText = 'What do you mean by yes? I do not understand. You can know about properties in your city by saying tell me about houses in followed by your city name';
//       }
//       else{
//       speechText = 'Which city would you like to know about next?';
//     }
//     }
//   }
// }

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(`Error handled: ${error.message}`)
      .reprompt(`Error handled: ${error.message}`)
      .getResponse();
  },
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetRemoteDataHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    LaunchRequestHandler,
    YesIntentHandler,
    NoIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
