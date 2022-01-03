import nodemailer from 'nodemailer';

export const getTransporter = () => {
  // const etherealTestAccount = await nodemailer.createTestAccount();
  // return nodemailer.createTransport({
  //   host: 'smtp.ethereal.email',
  //   port: 587,
  //   secure: false,
  //   auth: {
  //     user: etherealTestAccount.user,
  //     pass: etherealTestAccount.pass,
  //   },
  // });

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

export const sendMail = async (props) =>
  await (
    await getTransporter()
  ).sendMail({
    from: '"Fractal Flows" <fractalflows@fractalflows.com>',
    ...props,
  });
