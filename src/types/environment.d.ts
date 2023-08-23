export { }
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            PORT: number;
            ORIGIN: string;
            API_BASE_PATH: string;
            DB_HOST: string;
            DB_PORT: number;
            DB_NAME: string;
            DB_USER: string;
            DB_PASSWORD: string;
            GOOGLE_SERVICE_TYPE: string;
            GOOGLE_PROJECT_ID: string;
            GOOGLE_PRIVATE_KEY_ID: string;
            GOOGLE_PRIVATE_KEY: string;
            GOOGLE_CLIENT_EMAIL: string
            GOOGLE_CLIENT_ID: string;
            GOOGLE_AUTH_URI: string;
            GOOGLE_TOKEN_URI: string;
            GOOGLE_AUTH_PROVIDER_X509_CERT_URL: string;
            GOOGLE_CLIENT_X509_CERT_URL: string
            GOOGLE_UNIVERSE_DOMAIN: string
            GOOGLE_VIEW_ID: string
            GOOGLE_GA4_PROPERTY_ID: string


        }
    }
}