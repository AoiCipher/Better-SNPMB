"""FastAPI backend & CLI entrypoint for Better SNPMB Data Explorer (B-SNPMB)."""

import os
import time
from collections import defaultdict
from collections.abc import Awaitable, Callable

import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.routes import router

app = FastAPI(
    title="Better SNPMB Data Explorer API",
    description="Better SNPMB Data Explorer (B-SNPMB) Backend Service",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
allowed_origins = [o.strip() for o in allowed_origins_env.split(",")] if allowed_origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

_CLIENT_REQUESTS: dict[str, list[float]] = defaultdict(list)
CLIENT_REQUESTS = _CLIENT_REQUESTS
RATE_LIMIT_PER_SEC = 5
MAX_TRACKED_IPS = 10000


@app.middleware("http")
async def security_headers_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


@app.middleware("http")
async def rate_limit_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client_ip = forwarded.split(",")[0].strip()
    elif request.client and request.client.host:
        client_ip = request.client.host
    else:
        client_ip = "127.0.0.1"

    now = time.time()

    if len(_CLIENT_REQUESTS) > MAX_TRACKED_IPS:
        stale_ips = [ip for ip, ts in _CLIENT_REQUESTS.items() if not ts or (now - ts[-1] > 60)]
        for ip in stale_ips:
            del _CLIENT_REQUESTS[ip]

    timestamps = [t for t in _CLIENT_REQUESTS[client_ip] if now - t < 1.0]
    if len(timestamps) >= RATE_LIMIT_PER_SEC:
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests. Limit: 5 requests/sec."},
        )
    timestamps.append(now)
    _CLIENT_REQUESTS[client_ip] = timestamps
    return await call_next(request)


app.include_router(router)


def main() -> None:
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)


if __name__ == "__main__":
    main()
