const express = require('express');
const app = new express();

const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const nlu = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });

    return nlu;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'emotion': {},
        },
    };

    nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        const result = analysisResults.result.emotion.document.emotion;
        return res.send(result);
    })
    .catch(err => {
        return res.send('Error' + err);
    });
});

app.get("/url/sentiment", (req,res) => {
    const analyzeParams = {
        'url': req.query.url,
        'features': {
            'sentiment': {},
        },
    };
    console.log('Query: ' + req.query.url)
    nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        //console.log(JSON.stringify( analysisResults))
        const score = analysisResults.result.sentiment.document.score;
        const label = analysisResults.result.sentiment.document.label;
        return res.send(label);
    })
    .catch(err => {
    //   callback(null, 'Error: ' + err);
    return res.send('Error' + err);
    });
});

app.get("/text/emotion", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'emotion': {},
        },
    };

    nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        const result = analysisResults.result.emotion.document.emotion;
        return res.send(result);
    })
    .catch(err => {
        return res.send('Error' + err);
    });
});

app.get("/text/sentiment", (req,res) => {
    const analyzeParams = {
        'text': req.query.text,
        'features': {
            'sentiment': {},
        },
    };
    
    nlu = getNLUInstance();
    nlu.analyze(analyzeParams)
    .then(analysisResults => {
        //console.log(JSON.stringify( analysisResults))
        const score = analysisResults.result.sentiment.document.score;
        const label = analysisResults.result.sentiment.document.label;
        // let categories = analysisResults.result.categories;
        // let keywords = analysisResults.result.keywords;
        // categories = categories.filter(item => item.score > 0.8).map(item => item.label).join(', ').replace(/\\|\//g,', ');
        // categories = categories.substring(1).split(','); //remove initial comma
        // keywords = keywords.reduce((a,v,i) => {return a + (i===0?"":", ") + v.text}, "");
        // const msg = "We detected " +label + 
        //     " sentiments, and identified the categories " +
        //     categories + " relating to keywords " + keywords;
        // twiml.message(msg);
        // callback(null, twiml);
        return res.send(label);
    })
    .catch(err => {
    //   callback(null, 'Error: ' + err);
    return res.send('Error' + err);
    });

    
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

