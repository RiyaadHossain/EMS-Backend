import { ENUM_USER_ROLE } from '@/enums/user';
import User from './model';
import { emailSender } from '@/helpers/emailSender';
import { IEmailPayload } from './interface';

const getLastUserId = async () => {
  const user = await User.findOne().sort({ createdAt: -1 });
  return user?.userId.substr(2);
};

const generateId = async (role: ENUM_USER_ROLE) => {
  let prefix = 'A';
  if (role !== ENUM_USER_ROLE.ADMIN) prefix = 'E';

  const lastUserId = (await getLastUserId()) || String(0).padStart(5, '0');
  let generatedId = (parseInt(lastUserId) + 1).toString().padStart(5, '0');
  generatedId = `${prefix}-${generatedId}`;

  return generatedId;
};

const generatePassword = (length=20) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}

const sendRegistrationEmail = async (emailPayload: IEmailPayload) => {
    const emailContent = `
        <h1>Welcom to EMS</h1>
        <p>User Id: ${emailPayload.userId}</p>
        <p>Password: ${emailPayload.password}</p>
        <span>Don't share your credentials with others.</span>
    `;

    const mailInfo = {
        to: emailPayload.email,
        subject: 'Admin Credendianl',
        html: emailContent,
      };
    
      await emailSender(mailInfo);
}

export const UserUtils = {
    generateId,
    generatePassword,
    sendRegistrationEmail
};
