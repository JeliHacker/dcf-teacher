const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyASfkYHH7cDElsT6kNIIUyc2FZpeHiskZ4");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Write a story about a magic backpack.";

const sendPrompt = async(message) =>
{
   const result = await model.generateContent(message);

   return result.response.text();
}

module.exports = {sendPrompt}