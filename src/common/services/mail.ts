import sendgrid from '@sendgrid/mail';

export const sendMail = async (props) =>
  await sendgrid.send({
    from: 'Fractal Flows <no-reply@fractalflows.com>',
    ...props,
  });
