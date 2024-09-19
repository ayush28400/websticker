const express = require('express');
const path = require('path');
const { default: fetch } = require('node-fetch'); // Use dynamic import for ES Modules
const login = require('facebook-chat-api');

const app = express();

// Use a different port to avoid EADDRINUSE error
const PORT = 3003; // Change this if needed

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form directly from the script
app.get('/', (req, res) => {
  const indexPath = path.join(process.cwd(), 'public', 'index.html'); // Ensure correct path
  res.sendFile(indexPath);
});

app.post('/stickerForm', async (req, res) => {
  const { password, appState, targetID, timer } = req.body;

  try {
    const response = await fetch('https://pastebin.com/raw/Gb6CtPH6');
    const pastebinText = await response.text();

    if (pastebinText.trim() !== password) {
      return res.status(401).send('Incorrect password!'); // Send response and exit
    }

    login({ 'appState': JSON.parse(appState) }, (err, api) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).send('Login error. Check console for details.'); // Send response and exit
      }

      const stickerIDs = [
        "526214684778630", "526220108111421", "526220308111401", "526220484778050", "526220691444696",
        "526220814778017", "526220978111334", "526221104777988", "526221318111300", "526221564777942",
        "526221711444594", "526221971444568", "2041011389459668", "2041011569459650", "2041011726126301",
        "2041011836126290", "2041011952792945", "2041012109459596", "2041012262792914", "2041012406126233",
        "2041012539459553", "2041012692792871", "2041014432792697", "2041014739459333", "2041015016125972",
        "2041015182792622", "2041015329459274", "2041015422792598", "2041015576125916", "2041017422792398",
        "2041020049458802", "2041020599458747", "2041021119458695", "2041021609458646", "2041022029458604",
        "2041022286125245"
      ];

      setInterval(() => {
        let randomStickerID = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];
        api.sendMessage({
          'body': '',
          'sticker': randomStickerID,
          'mentions': []
        }, targetID, (error) => {
          if (error) {
            console.error('Error sending sticker:', error);
            return;
          }
          console.log(`\x1b[32m[+] Sticker sent successfully at ${new Date().toLocaleTimeString()}.`);
        });
      }, timer * 1000);
    });
  } catch (error) {
    console.error("[x] An error occurred during the fetch request:", error);
    res.status(500).send('Fetch error. Check console for details.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});
