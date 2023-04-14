import nodemailer, { Transporter } from 'nodemailer'
import config from '../config/config'
import { confirmationEmail } from '../extended-types/types'

const ReturnNodeMailerTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    secure: true,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS
    }
  })
}

export const forgotPassword = async (data: confirmationEmail): Promise<void> => {
  const { email, name, token } = data

  const transport = ReturnNodeMailerTransporter()

  await transport.sendMail({
    from: '"EasyTask - Project Management" <ronnymagdiel@zohomail.com>',
    to: email,
    subject: 'EasyTask - Reset your password',
    text: 'Reset your password',
    html: `<p>Hello: ${name} you have requested a password change for EasyTask app</p>
    <p>please click on the link below to reset your password</p>
    <a href="${config.FRONTED_URL}/reset-password/${token}">Reset Password</a>
    <p>If you did not request a password change, ignore this email</p>
    `
  })
}

export const registerEmail = async (data: confirmationEmail): Promise<void> => {
  const { email, name, token } = data
  const transport = ReturnNodeMailerTransporter()

  await transport.sendMail({
    from: '"EasyTask - Project Management" <ronnymagdiel@zohomail.com>',
    to: email,
    subject: 'EasyTask - Confirmation Email',
    text: 'Confirm your account to use Easy Task web app',
    html: `<p>Hello: ${name}</p>
    <p>Your account is almost set up, please confirm your account to finish</p>
    <a href="${config.FRONTED_URL}/confirm-account/${token}">Confirm Account</a>
    <p>If you did not create any account, ignore this email</p>
    `
  })
}
