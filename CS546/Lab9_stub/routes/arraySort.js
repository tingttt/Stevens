/*
import express and express router as shown in lecture code and worked in previous labs.
Your server this week should not be doing any of the processing! Your server only exists to allow someone to get to the HTML Page and download the associated assets to run the array sort page.

you just need one route to send the static homepage.html file using the res.sendFile method. 
*/
import { Router } from 'express'; // Import express and Router
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router(); 


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static', 'homepage.html'));
});


export default router;
