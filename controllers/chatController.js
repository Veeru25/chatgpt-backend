const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.API_KEY_4);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "Always Use the React function 'App' without any import or export statements, and ensure all styles are defined inline",
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(`${message} `);

    res.status(200).json({ message: result.response.text() });
  } catch (error) {
    console.error('Error in handleChat:', error);
    res.status(500).json({
      error: 'Failed to process the request',
      message: 'Failed to fetch the data. Please try again.',
    });
  }
};
