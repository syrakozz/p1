import { useUserStore } from './stores/user.store';
import isURL from 'validator/lib/isURL';
import { getVersion } from 'react-native-device-info';
import { getLoadBalancerUrl } from '../config/load.balancers';
import { getCountry } from 'react-native-localize';

const minorVersion = getVersion().split('.')[1];
export const isProd = Number(minorVersion) % 2 === 0;
export const country = getCountry();
const BASE_URL = isProd ? getLoadBalancerUrl(country) : getLoadBalancerUrl('UAT');

import { extraConsoleDetails } from '../../config';

export function isApiError<T = any>(x: unknown): x is ApiError<T> {
  return !!(x && typeof x === 'object' && 'status' in x && 'url' in x && 'data' in x);
}

export type ApiError<T = any> = {
  status: number;
  url: string;
  data: T;
};

type ApiOptions = RequestInit & {
  baseUrl?: string;
  params?: string | string[][] | Record<string, string> | URLSearchParams;
};

export async function _send(path: string, _options?: ApiOptions): Promise<{ url: string; _fetch: () => Promise<Response> }> {
  const { baseUrl = BASE_URL, params, ...options } = { ..._options };
  const { user } = useUserStore.getState();
  const authToken = await user?.getIdToken();

  if (options.body && !(options.body instanceof FormData)) {
    options.headers = { ...options.headers, 'Content-Type': 'application/json' };
    options.body = JSON.stringify(options.body);
  }

  if (authToken) {
    options.headers = { ...options.headers, Authorization: `Bearer ${authToken}` };
  }

  let url = buildFullPath({ baseURL: baseUrl, path });

  if (params) {
    url += (url.includes('?') ? '&' : '?') + new URLSearchParams(params).toString();
  }

  return {
    url,
    _fetch: () => fetch(url, options),
  };
}

async function send<T>(path: string, _options?: ApiOptions): Promise<{ headers: Headers; body: T; status: number }> {
  const { url, _fetch } = await _send(path, _options);

  return _fetch().then(async r => {
    const { status, statusText, headers, ok } = r;
    if (!ok) {
      let data: unknown;
      try {
        data = await parseBody(r);
      } catch {}
      if (extraConsoleDetails) console.log('http.service.ts: send(): Thrown ERROR from catch');
//      throw { status, statusText, url, data } as ApiError<unknown>;
    }

    return { headers, body: await parseBody<T>(r), status };
  });
}

async function get<T>(path: string, options?: ApiOptions): Promise<T> {
  return send<T>(path, { ...options, method: 'GET' }).then(r => r.body);
}

async function del<T>(path: string, options?: ApiOptions): Promise<T> {
  return send<T>(path, { ...options, method: 'DELETE' }).then(r => r.body);
}

async function post<T>(path: string, body: any, options?: ApiOptions): Promise<T> {
  return send<T>(path, { ...options, method: 'POST', body }).then(r => r.body);
}

async function put<T>(path: string, body: any, options?: ApiOptions): Promise<T> {
  return send<T>(path, { ...options, method: 'PUT', body }).then(r => r.body);
}

async function patch<T>(path: string, body: any, options?: ApiOptions): Promise<T> {
  return send<T>(path, { ...options, method: 'PATCH', body }).then(r => r.body);
}

async function parseBody<T>(response: Response): Promise<T> {
  const { headers } = response;

  if (response.status === 204 || (headers.has('content-length') && +headers.get('content-length')! === 0)) {
    return undefined as unknown as T;
  }

  return response.json();
}

function combineURLs(baseURL: string, relativeURL: string) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}

export function buildFullPath({ path, baseURL = BASE_URL }: { path: string; baseURL?: string }): string {
  return baseURL && !isURL(path) ? combineURLs(baseURL, path) : path;
}

export const http = {
  send,
  get,
  del,
  post,
  put,
  patch,
};
