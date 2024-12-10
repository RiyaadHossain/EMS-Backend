import { emailSender } from "@/helpers/emailSender"

type IEmailPayload = {
  email: string
  userId: string
  password: string
}

const onboardEmloyeeEmail = async({ email, userId, password }: IEmailPayload) => {
  const emailContent = `
  <h1>Welcom to EMS</h1>
  <p>User Id: ${userId}</p>
  <p>Password: ${password}</p>
  <span>Don't share your credentials with others.</span>
`;

const mailInfo = {
  to: email,
  subject: 'Employee Credentials',
  html: emailContent,
};

await emailSender(mailInfo);
}

export const EmployeeUtils = {onboardEmloyeeEmail}