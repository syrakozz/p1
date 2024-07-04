export const errorMessages = [
  {
    code: 'auth/email-already-in-use',
    path: 'email',
    message: 'login.email-already-exists',
  },
  {
    code: 'auth/user-not-found',
    path: 'email',
    message: 'login.email-is-invalid',
  },
  {
    code: 'auth/wrong-password',
    path: 'password',
    message: 'password.invalid-password',
  },
  {
    code: 'auth/too-many-requests',
    path: 'generic',
    message: 'password.too-many-requests',
  },
] as const;

export type AuthErrorCode = (typeof errorMessages)[number]['code'];
export type AuthErrorPath = (typeof errorMessages)[number]['path'];
export type AuthErrorMessage = (typeof errorMessages)[number]['message'];

export const getPathForAuthErrorCode = (code: string): AuthErrorPath => errorMessages.find(e => e.code === code)?.path || 'generic';

export const getMessageForAuthErrorCode = (code: string) => errorMessages.find(e => e.code === code)?.message || 'auth.auth-error';
