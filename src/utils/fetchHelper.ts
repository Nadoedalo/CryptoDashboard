interface FetchResponse<T> {
  status: number
  data: T
}

export const fetchHelper = async <T>(url: RequestInfo, { body, method = 'GET' }: {
  body?: unknown
  method?: string
} = {}): Promise<FetchResponse<T>> => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  } as RequestInit;
  if (body && method === 'GET') {
    url = `${url}?${new URLSearchParams({ ...body })}`;
  }
  else if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const data = await response.json();
  return {
    status: response.status, data,
  };
};
