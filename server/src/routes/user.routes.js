import express from 'express';
import { login, register, logout, getMe, requestAssociation, handleAssociationRequest, searchUsers, getAssociationRequests, cancelAssociationRequest, removeAssociation } from '../controllers/user.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { loginSchemaValidation, signupSchemaValidation } from '../validator/user.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', validate(signupSchemaValidation), register);
userRouter.post('/login', validate(loginSchemaValidation), login);
userRouter.post('/logout', logout);
userRouter.get('/me', authenticate, getMe);

userRouter.post('/request-association', authenticate, requestAssociation);
userRouter.post('/handle-association-request', authenticate, handleAssociationRequest);
userRouter.post('/search', authenticate, searchUsers);
userRouter.get('/association-requests', authenticate, getAssociationRequests);
userRouter.post('/cancel-association-request', authenticate, cancelAssociationRequest);
userRouter.post('/remove-association', authenticate, removeAssociation);

export default userRouter;