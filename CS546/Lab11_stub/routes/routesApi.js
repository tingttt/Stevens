// Set-Up Routes
import { Router } from 'express'; // Import express and Router
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router(); 

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET to show static HTML flie
    res.sendFile(path.join(__dirname, '../static', 'webpage.html'));
  })

  export default router;