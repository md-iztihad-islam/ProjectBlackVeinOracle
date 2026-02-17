import express from 'express';
import { addJailController, getAllJailsController, getJailByDistrictController, getJailByIdController, getJailByNameController, getJailByZoneController, signinJailController, signoutJailController } from '../../controllers/jailController.js';

const router = express.Router();

router.post('/add-jail', addJailController);
router.post('/signin-jail', signinJailController);
router.post('signout-jail', signoutJailController);
router.get('/get-jails', getAllJailsController);
router.get('/get-jail/:jailId', getJailByIdController);
router.get('/get-jail-by-name/:jailName', getJailByNameController);
router.get('/get-jail-by-zone/:zone', getJailByZoneController);
router.get('/get-jail-by-district/:district', getJailByDistrictController);

export default router;