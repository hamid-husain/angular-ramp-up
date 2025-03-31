export const constants = {
  ROUTE_DASHBOARD: '/dashboard',
  ROUTE_LOGIN: '/auth/login',
  ROUTE_SIGNUP: '/auth/signup',
  ROUTE_ROOT: '/',
  ROUTE_ARTICLE: '/article',

  PATH_AUTH: 'auth',

  ID: 'id',
  ARTICLES: 'articles',
  TITLE: 'title',
  DESC: 'desc',
  CREATED_AT: 'created_at',
  AUTHOR: 'author',
  TAGS: 'tags',
  PAGE_INDEX: 'pageIndex',

  EMAIL: 'email',
  PASSWORD: 'password',
  USERNAME: 'username',
  CPASSWORD: 'cPassword',

  LOGIN: 'Login',
  LOGIN_ICON: 'login',
  LOGIN_LOADING: 'Logging in....',
  LOGIN_SUCCESS: 'Logged in successfully',
  SIGNUP: 'Sign Up',
  SIGNUP_ICON: 'app_registration',
  SIGNUP_LOADING: 'Signing in....',
  SIGNUP_SUCCESS: 'Signed up successfully',
  LOGOUT_LOADING: 'Logging out....',
  LOGOUT_SUCCESS: 'Logged out successfully',

  ERR_LOADING_ARTICLE: 'Error loading article:',
  ERR_DELETING_ARTICLE: 'Error deleting article:',
  ERR_LOADING_FOR_EDITING: 'Error loading article for editing:',
  ERR_SAVING_ARTICLE: 'Error saving article:',
  ERR_ADDING_ARTICLE: 'Error adding article:',
  ERR_ARTICLE_NOT_FOUND: 'Article not found',
  ERR_FETCHING_ARTICLE: 'Error fetching articles:',
  ERR_ERROR: 'An error occurred. Please try again later.',
  ERR_COUNTING_ARTICLE: 'Error counting articles:',

  ERR_INVALID_CREDENTIALS: 'Invalid credentials. Please try again.',
  ERR_USERMAME_MIN: 'Username should be at least 3 characters long',
  ERR_PASSWORD_CPASSWORD_MATCH: 'Password and Confirm Password should match',
  ERR_PASSWORD_STRENGTH:
    'Password must be at least 8 characters long, and contain at least 2 numeric and 2 special characters',

  CODE_INVALID_CREDENTIALS: 'auth/invalid-credential',
};
