declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: string;
      DATABASE_URL: string;
      STRAW_PRIVATE_KEY: string;
      INFURA_API_KEY: string;
      PROTOCOL_PRIVATE_KEY: string;
    }
  }
}
