
import { Token, tokensData } from "@mistcash/config";

export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const USDC_TOKEN = tokensData.find(token => token.name === 'USDC') as Token;
export const MIDDLEWARE_CONTRACT = `0xf00`;