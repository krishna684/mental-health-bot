export default async function handler(req, res) {
    const { message } = req.body;
  
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo", // Or "gpt-4" if you have access
          messages: [
            {
              role: "system",
              content: "You are a compassionate mental health assistant. Speak gently and supportively.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });
  
      const data = await response.json();
  
      if (!data || !data.choices || !data.choices[0]) {
        console.error("Unexpected response from OpenAI:", data);
        return res.status(500).json({ reply: "Sorry, I couldn't generate a response. Please try again." });
      }
  
      const reply = data.choices[0].message.content;
      res.status(200).json({ reply });
  
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ reply: "Internal error talking to OpenAI." });
    }
  }
  