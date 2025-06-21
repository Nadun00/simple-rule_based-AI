/* const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5002;

app.use(cors());
app.use(bodyParser.json());

// Store context for each session
let conversationContext = {};

app.post('/api/chatbot', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  const sessionId = req.body.sessionId;

  if (!conversationContext[sessionId]) {
    conversationContext[sessionId] = {
      step: 0,
      info: null, // store info about red/yellow leaves
    };
  }

  const context = conversationContext[sessionId];
  let response = {};

  if (context.step === 0) {
    // Step 0: Initial question (e.g. "Why is the tea leaf red?")
    if (userMessage.includes('red')) {
      context.info = {
        reason: 'Over-exposure to sunlight or insufficient water.',
        prevention: 'Ensure the plants are watered properly and are in a shaded area.',
        advice: 'Monitor sunlight exposure and adjust watering frequency.',
      };
      context.step = 1;
      response = { reason: context.info.reason };
    } else if (userMessage.includes('yellow')) {
      context.info = {
        reason: 'Nutrient deficiency or environmental stress.',
        prevention: 'Ensure the plants are getting adequate nutrients.',
        advice: 'Check soil for necessary nutrients and apply fertilizers.',
      };
      context.step = 1;
      response = { reason: context.info.reason };
    } else {
      response = { message: 'I could not understand the issue. Please mention if the leaf is red or yellow.' };
    }
  } else if (context.step === 1) {
    // Step 1: Follow-up questions (after initial color-based diagnosis)
    if (!context.info) {
      response = { message: 'Please ask about the condition of the leaf first (e.g., "Why is the tea leaf red?").' };
    } else if (userMessage.includes('prevent')) {
      response = { prevention: context.info.prevention };
    } else if (userMessage.includes('advice')) {
      response = { advice: context.info.advice };
    } else if (userMessage.includes('why')) {
      response = { reason: context.info.reason };
    } else {
      response = { message: 'Please ask a specific question about prevention, advice, or cause.' };
    }
  }

  res.json(response);
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
}); */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5002;

app.use(cors());
app.use(bodyParser.json());

// Store context for each session
let conversationContext = {};

// Conditions for each tea leaf color
const leafConditions = {
  red: {
    reason: 'Over-exposure to sunlight or insufficient water.',
    prevention: 'Ensure the plants are watered properly and are in a shaded area.',
    advice: 'Monitor sunlight exposure and adjust watering frequency.'
  },
  yellow: {
    reason: 'Nutrient deficiency or environmental stress.',
    prevention: 'Ensure the plants are getting adequate nutrients.',
    advice: 'Check soil for necessary nutrients and apply fertilizers.'
  },
  white: {
    reason: 'Fungal infection or pesticide residue.',
    prevention: 'Use proper fungicides and reduce excessive spraying.',
    advice: 'Consult experts and switch to organic treatments if possible.'
  },
  brown: {
    reason: 'Leaf scorch due to drought or chemical burns.',
    prevention: 'Water regularly and avoid excessive fertilizer use.',
    advice: 'Keep soil moisture consistent and use mild fertilizers.'
  }
};

// Chatbot route
app.post('/api/chatbot', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  const sessionId = req.body.sessionId;

  // Initialize session context if not present
  if (!conversationContext[sessionId]) {
    conversationContext[sessionId] = {
      step: 0,
      info: null
    };
  }

  const context = conversationContext[sessionId];
  let response = {};

  // 🔄 Always check for a new color in every message
  let foundColor = null;
  for (const color in leafConditions) {
    if (userMessage.includes(color)) {
      foundColor = color;
      break;
    }
  }

  // 🎯 If a new color is found, update context immediately
  if (foundColor) {
    context.info = leafConditions[foundColor];
    context.step = 1;

    // Check what kind of info is being requested
    if (userMessage.includes('prevent')) {
      response = { prevention: context.info.prevention };
    } else if (userMessage.includes('advice')) {
      response = { advice: context.info.advice };
    } else if (userMessage.includes('why') || userMessage.includes('cause')) {
      response = { reason: context.info.reason };
    } else {
      // Default to reason if nothing specific is asked
      response = { reason: context.info.reason };
    }
  } else if (context.info) {
    if (userMessage.includes('prevent')) {
      response = { prevention: context.info.prevention };
    } else if (userMessage.includes('advice')) {
      response = { advice: context.info.advice };
    } else if (userMessage.includes('why') || userMessage.includes('cause')) {
      response = { reason: context.info.reason };
    } else {
      response = { message: 'Please ask a specific question about prevention, advice, or cause.' };
    }
  } else {
    response = { message: 'Please first describe the tea leaf color (e.g., "Why is the tea leaf yellow?").' };
  }

  console.log('Response:', response);
  res.json(response);
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});






