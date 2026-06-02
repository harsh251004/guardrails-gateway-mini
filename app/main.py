from fastapi import FastAPI

from app.core.policy import analyze_request, get_policy
from app.schemas import AnalyzeRequest, AnalyzeResponse, PolicyResponse

app = FastAPI(
    title="Guardrails Gateway Mini",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    return analyze_request(payload)


@app.get("/policy", response_model=PolicyResponse)
def policy() -> PolicyResponse:
    data = get_policy()
    return PolicyResponse(**data)
