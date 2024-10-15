
# Class of Psi-24: Automated Birthday Wishing Bot

This project is an automated WhatsApp bot designed to send birthday wishes to individuals and the class group chat daily. It fetches birthday data from an Airtable database and sends personalized birthday messages to the corresponding WhatsApp contacts and the group chat. The bot runs every day at a scheduled time and can send birthday messages.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Technology Stack](#technology-stack)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing Guidelines](#contributing-guidelines)
- [Known Bugs](#known-bugs)
- [License](#license)
- [Author](#author)

---

## Project Overview

The **Class of Psi-24 Automated Birthday Wishing Bot** helps organize and automate the process of sending birthday messages. The bot has the following features:

- Fetches birthday data from Airtable.
- Sends personalized birthday wishes to individuals via WhatsApp.
- Notifies the WhatsApp group about birthday celebrations with mentions of the celebrants.
- Supports both text and media (image) messages.
- Daily automated execution through a scheduled task using `node-cron`.
- Sends updates and error logs to the admin’s WhatsApp.

This bot is ideal for group chats, organizations, or communities looking to automate birthday wishes without manual intervention.

---

## Installation

### System Requirements

- Node.js (v16.0.0 or later)
- npm (v7.0.0 or later)
- Airtable API key and base details
- WhatsApp account for bot setup

### Dependencies

The project uses the following npm packages:
- `dotenv` - For managing environment variables.
- `node-fetch` - To make API requests to Airtable.
- `node-cron` - For scheduling the automated birthday wishes.
- `qrcode-terminal` - For displaying the QR code to log in to WhatsApp Web.
- `whatsapp-web.js` - For integrating with the WhatsApp API.

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Finney06/Birthday-Wishing-whatsapp-bot.git
   cd Birthday-Wishing-whatsapp-bot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file**: If it doesn't already exist, create a `.env` file in the project root and populate it with your environment variables (see `.env.sample` below).

4. **Run the project**:
   ```bash
   npm start
   ```

---

## Usage Guide

### Environment Variables

Ensure you have the following in your `.env` file:

```bash
# Admin contact
ADMIN_NUMBER=<Admin_WhatsApp_ID>

# Airtable configuration
AIRTABLE_API_KEY=<Your_Airtable_API_Key>
AIRTABLE_BASE_ID=<Your_Airtable_Base_ID>
AIRTABLE_TABLE_ID=<Your_Airtable_Table_Name>

# WhatsApp group details
GROUP_CHAT_ID=<Your_WhatsApp_Group_ID>
```

### Running the Bot

1. **Start the bot**: Run the command `npm start` to initialize the bot. The bot will display a QR code in the terminal, which you need to scan with WhatsApp to link your account.

2. **Birthday Messaging**: Once the bot is linked, it will automatically fetch birthday data from Airtable daily at 8 AM and send messages. The bot also sends logs or any error reports to the admin via WhatsApp for quick troubleshooting.

---

### Key Files

- `bot.js`: Contains the core logic for fetching birthday data from Airtable, selecting random birthday messages, and sending personalized WhatsApp messages.
- `scheduler.js`: Handles the daily scheduling of the birthday message sending process.
- `birthdayMessages.js`: An array of predefined birthday messages to randomly select from.

---

## Technology Stack

- **Programming Languages**: JavaScript (Node.js)
- **Libraries**:
  - `whatsapp-web.js` for WhatsApp integration.
  - `node-cron` for scheduling tasks.
  - `node-fetch` for API requests.
  - `qrcode-terminal` for displaying QR codes in the terminal.
- **Database**: Airtable (API integration).
- **Environment Management**: `dotenv`

---

## API Endpoints

- **Airtable API**: The bot interacts with Airtable’s API to fetch birthday data.
  - **URL**: `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`
  - **Authorization**: Requires the `AIRTABLE_API_KEY`.

---

## Testing

Currently, no testing framework is implemented. You can test the project manually by:

1. Adding test data to your Airtable base.
2. Running the bot and verifying if birthday messages are sent to the specified WhatsApp contacts.

We encourage future contributors to add automated tests for better coverage.

---

## Contributing Guidelines

To contribute to this project:
1. Fork the repository.
2. Create a new feature branch.
3. Commit your changes with clear and concise messages.
4. Ensure all tests pass (if applicable) before submitting your pull request for review.
5. Open a pull request for review.

---

## Known Bugs

- Sometimes media messages may fail to send if the URL provided is inaccessible (e.g., expired links or incorrect paths).
- The bot may disconnect due to WhatsApp Web session timeouts.

Feel free to report bugs or suggest improvements via the GitHub Issues tab.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Author

- GitHub: [Finney06](https://github.com/Finney06)
- LinkedIn: [Finney Osajere](https://www.linkedin.com/in/finney-osajere-39530a247/)
