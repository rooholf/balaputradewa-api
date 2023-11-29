type ErrorCode = { code: "UNKNOWN" | "VALIDATION" | "NOT_FOUND" | "PARSE" | "INTERNAL_SERVER_ERROR" | "INVALID_COOKIE_SIGNATURE" | "P2002" }

type JWTPayloadSpec = {
      id: string,
      name: string,
      email:string,
      role: string,
  };