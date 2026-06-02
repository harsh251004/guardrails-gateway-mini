from typing import Dict, List, Literal

from pydantic import BaseModel, Field


class ContextDoc(BaseModel):
    id: str = Field(min_length=1)
    text: str


class RequestMetadata(BaseModel):
    app_id: str = Field(min_length=1)
    user_id: str = Field(min_length=1)
    request_id: str = Field(min_length=1)


class AnalyzeRequest(BaseModel):
    prompt: str
    context_docs: List[ContextDoc] = Field(default_factory=list, max_length=3)
    metadata: RequestMetadata


class Reason(BaseModel):
    tag: str
    evidence: str


class AnalyzeResponse(BaseModel):
    decision: Literal["allow", "block", "transform"]
    risk_score: int = Field(ge=0, le=100)
    risk_tags: List[str]
    sanitized_prompt: str
    sanitized_context_docs: List[ContextDoc]
    reasons: List[Reason]


class PolicyResponse(BaseModel):
    version: str
    detectors: List[str]
    thresholds: Dict[str, int]
