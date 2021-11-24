declare module NodeJS {
  interface Process {
    browser: boolean;
  }
  interface ProcessEnv {
    BING_URL: string;
    BING_API: string;
    DATABASE: string;
    COOKIE_PARSER: string;
    NEXT_PUBLIC_MAN: string;
    NEXT_PUBLIC_WOMEN: string;
    NEXT_PUBLIC_ABOUT: string;
    NEXT_PUBLIC_ADMIN: string;
    NEXT_PUBLIC_ONE_SAY: string;
    NEXT_PUBLIC_STRING: string;
    NEXT_PUBLIC_API_HOST: string;
    NEXT_PUBLIC_API_TOKEN: string;
    NEXT_PUBLIC_IP_ADDRESS: string;
  }
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
  __cache: any
}
