// Netlify serverless function to send Telegram notifications
exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }
    
    try {
        // Parse the request body
        const data = JSON.parse(event.body);
        const { title, message, type = 'notification' } = data;
        
        // Validate required fields
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Message is required' })
            };
        }
        
        // Get Telegram credentials from environment variables
        // In Netlify, these would be set in the dashboard
        const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        
        // For development/demo purposes, you can use placeholders
        // In production, these should be set as environment variables
        const botToken = TELEGRAM_BOT_TOKEN || '8310731783:AAGFqioWTDVYCHUdJzFXjMvLxob_Lfufg3M';
        const chatId = TELEGRAM_CHAT_ID || '8577130225';
        
        // Construct the message text
        let telegramMessage = '';
        if (title) {
            telegramMessage += `*${title}*\n\n`;
        }
        telegramMessage += message;
        
        if (type === 'announcement') {
            telegramMessage += '\n\n_This is an announcement from Brixa Admin_';
        } else if (type === 'registration') {
            telegramMessage += '\n\n_New user registration on Brixa_';
        } else if (type === 'investment') {
            telegramMessage += '\n\n_New investment made on Brixa_';
        }
        
        // Send message to Telegram
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });
        
        const responseData = await response.json();
        
        if (!response.ok || !responseData.ok) {
            console.error('Telegram API error:', responseData);
            return {
                statusCode: 500,
                body: JSON.stringify({ 
                    error: 'Failed to send Telegram message',
                    details: responseData.description || 'Unknown error'
                })
            };
        }
        
        // Return success response
        return {
            statusCode: 200,
            body: JSON.stringify({ 
                success: true, 
                message: 'Telegram notification sent successfully',
                telegramResponse: responseData
            })
        };
        
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Internal Server Error',
                details: error.message 
            })
        };
    }
};
