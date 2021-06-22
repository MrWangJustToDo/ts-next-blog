declare module NodeJS {
  interface Process {
    browser: boolean;
  }
  interface ProcessEnv {
    BINGURL: string;
    BINGAPI: string;
    DATABASE: string;
    COOKIEPARSER: string;
    NEXT_PUBLIC_MAN: string;
    NEXT_PUBLIC_WOMEN: string;
    NEXT_PUBLIC_ABOUT: string;
    NEXT_PUBLIC_ADMIN: string;
    NEXT_PUBLIC_ONESAY: string;
    NEXT_PUBLIC_APIHOST: string;
    NEXT_PUBLIC_APITOKEN: string;
    NEXT_PUBLIC_IPADDRESS: string;
  }
}

interface Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
}
