export const paths = {
  auth: {
    custom: {
      signIn: '/auth/custom/sign-in',
      signUp: '/auth/custom/sign-up',
      resetPassword: '/auth/custom/reset-password',
    },
    auth0: {
      callback: '/auth/auth0/callback',
      signIn: '/auth/auth0/sign-in',
      signUp: '/auth/auth0/sign-up',
      signOut: '/auth/auth0/sign-out',
      profile: '/auth/auth0/profile',
    },
    cognito: {
      signIn: '/auth/cognito/sign-in',
      signUp: '/auth/cognito/sign-up',
      signUpConfirm: '/auth/cognito/sign-up-confirm',
      newPasswordRequired: '/auth/cognito/new-password-required',
      resetPassword: '/auth/cognito/reset-password',
      updatePassword: '/auth/cognito/update-password',
    },
    firebase: {
      signIn: '/auth/firebase/sign-in',
      signUp: '/auth/firebase/sign-up',
      resetPassword: '/auth/firebase/reset-password',
      recoveryLinkSent: '/auth/firebase/recovery-link-sent',
      updatePassword: '/auth/firebase/update-password',
    },
    supabase: {
      callback: '/auth/supabase/callback',
      signIn: '/auth/supabase/sign-in',
      signUp: '/auth/supabase/sign-up',
      signUpConfirm: '/auth/supabase/sign-up-confirm',
      resetPassword: '/auth/supabase/reset-password',
      recoveryLinkSent: '/auth/supabase/recovery-link-sent',
      updatePassword: '/auth/supabase/update-password',
    },
    samples: {
      signIn: { centered: '/auth/samples/sign-in/centered', split: '/auth/samples/sign-in/split' },
      signUp: { centered: '/auth/samples/sign-up/centered', split: '/auth/samples/sign-up/split' },
      updatePassword: {
        centered: '/auth/samples/update-password/centered',
        split: '/auth/samples/update-password/split',
      },
      resetPassword: {
        centered: '/auth/samples/reset-password/centered',
        split: '/auth/samples/reset-password/split',
      },
      verifyCode: {
        centered: '/auth/samples/verify-code/centered',
        split: '/auth/samples/verify-code/split',
      },
    },
  },
  dashboard: {
    cases: {
      list: '/dashboard/cases',
      create: '/dashboard/cases/create',
      details: (caseId) => `/dashboard/cases/${caseId}`,
    },
    equipments: {
      list: '/dashboard/equipments',
      create: '/dashboard/equipments/create',
      details: (equipmentId) => `/dashboard/equipments/${equipmentId}`,
    },
  },
  notAuthorized: '/errors/not-authorized',
  notFound: '/errors/not-found',
  internalServerError: '/errors/internal-server-error',
  docs: 'https://material-kit-pro-react-docs.devias.io',
  purchase: 'https://mui.com/store/items/devias-kit-pro',
};
