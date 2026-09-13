"""FastAPI backend & CLI entrypoint for SNBP and SNBT university admission data."""

import time
from collections import defaultdict
from collections.abc import Awaitable, Callable

import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.routes import router

app = FastAPI(
    title="UnivScrap API",
    description="Indonesian University Admission (SNPMB) Data Service",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_CLIENT_REQUESTS: dict[str, list[float]] = defaultdict(list)
CLIENT_REQUESTS = _CLIENT_REQUESTS
RATE_LIMIT_PER_SEC = 5


@app.middleware("http")
async def rate_limit_middleware(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    client_ip = request.client.host if request.client else "127.0.0.1"
    now = time.time()
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
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    main()
