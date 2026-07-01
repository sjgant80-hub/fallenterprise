"""
FallEnterprise · Prompt-compression microservice
Wraps microsoft/LLMLingua-2 as an HTTP endpoint. Callers submit a prompt,
receive a compressed version (2-5× smaller, accuracy preserved).

Endpoints:
  GET  /health
  POST /compress {"prompt": str, "ratio": float}
"""
import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from llmlingua import PromptCompressor

app = FastAPI(title="fallenterprise-compressor", version="1.0")

DEFAULT_RATIO = float(os.environ.get("COMPRESS_RATIO", "0.5"))
MODEL_NAME = os.environ.get(
    "COMPRESS_MODEL",
    "microsoft/llmlingua-2-xlm-roberta-large-meetingbank",
)

# lazy-init on first call so /health responds immediately
_compressor: Optional[PromptCompressor] = None


def get_compressor() -> PromptCompressor:
    global _compressor
    if _compressor is None:
        _compressor = PromptCompressor(
            model_name=MODEL_NAME,
            use_llmlingua2=True,
        )
    return _compressor


class CompressRequest(BaseModel):
    prompt: str
    ratio: Optional[float] = None
    target_token: Optional[int] = None


class CompressResponse(BaseModel):
    compressed_prompt: str
    origin_tokens: int
    compressed_tokens: int
    ratio: float
    saving: str


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME, "default_ratio": DEFAULT_RATIO}


@app.post("/compress", response_model=CompressResponse)
def compress(req: CompressRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="empty prompt")
    try:
        c = get_compressor()
        kwargs = {}
        if req.target_token is not None:
            kwargs["target_token"] = req.target_token
        else:
            kwargs["rate"] = req.ratio if req.ratio is not None else DEFAULT_RATIO
        result = c.compress_prompt(req.prompt, **kwargs)
        return CompressResponse(
            compressed_prompt=result["compressed_prompt"],
            origin_tokens=result["origin_tokens"],
            compressed_tokens=result["compressed_tokens"],
            ratio=result["ratio"],
            saving=result["saving"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
