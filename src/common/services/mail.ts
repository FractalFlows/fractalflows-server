import sendgrid from '@sendgrid/mail';

export const sendMail = async (props) =>
  await sendgrid.send({
    from: 'Fractal Flows <fractalflows@fractalflows.com>',
    ...props,
  });
