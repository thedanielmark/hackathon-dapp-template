import { z } from "zod";

// Generic Fetcher with request and response validation
export const fetcher = async <RequestSchema, ResponseSchema>(
  url: string,
  params: RequestSchema | null, // Allow null params
  requestSchema: z.Schema<RequestSchema> | null, // Allow null schema
  responseSchema: z.Schema<ResponseSchema>,
  options?: RequestInit
): Promise<ResponseSchema> => {
  // Validate request params if schema is provided
  if (params !== null && requestSchema) {
    const validatedParams = requestSchema.safeParse(params);
    if (!validatedParams.success) {
      throw new Error(
        `Invalid request parameters: ${JSON.stringify(validatedParams.error.format())}`
      );
    }
    params = validatedParams.data; // Assign validated data
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("sessionToken") || ""}`,
    ...options?.headers,
  };

  let body: BodyInit | undefined;
  let fetchUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;

  // Accept PUT requests as well as POST and PATCH requests to send a body
  if (
    options?.method === "POST" ||
    options?.method === "PATCH" ||
    options?.method === "PUT"
  ) {
    // Ensure no body is sent if params is null
    body = params !== null ? JSON.stringify(params) : undefined;
  } else if (params !== null) {
    // For GET and other methods, build query string if params exist
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    fetchUrl = `${fetchUrl}?${queryString}`;
  }

  const response = await fetch(fetchUrl, {
    method: options?.method || "GET", // Default to GET if no method is provided
    headers,
    body,
  });

  if (!response.ok) {
    let errorMessage = `Error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Keep default error message
    }
    throw new Error(errorMessage);
  }

  const jsonData = await response.json();

  // Validate API response using Zod
  const parsedData = responseSchema.safeParse(jsonData);
  if (!parsedData.success) {
    throw new Error(
      `Invalid API response format: ${JSON.stringify(parsedData.error.format())}`
    );
  }

  return parsedData.data;
};
