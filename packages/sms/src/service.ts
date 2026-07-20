import axios from 'axios';

export async function sendSms(to: string, message: string) {
  const token = process.env.BDBULKSMS_API_KEY;
  
  if (!token) {
    console.error('BDBULKSMS_API_KEY is missing');
    throw new Error('BDBULKSMS_API_KEY is not defined in environment variables');
  }

  try {
    const greenwebsms = new URLSearchParams();
    greenwebsms.append('token', token);
    greenwebsms.append('to', to);
    greenwebsms.append('message', message);
    
    const response = await axios.post('https://api.bdbulksms.net/api.php', greenwebsms);
    return response.data;
  } catch (error) {
    console.error("Error sending SMS via BDBulksms:", error);
    throw error;
  }
}
