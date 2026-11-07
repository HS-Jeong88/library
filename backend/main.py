
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
from typing import Optional
from datetime import datetime
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = Path(__file__).with_name("data.json")

def load_data():
    if not DATA_FILE.exists():
        initial_data = {
            "next_id": 1,
            "books": []
        }
        save_data(initial_data)
        return initial_data
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
        if not isinstance(data, dict):
            raise ValueError("잘못된 데이터 형식")
        if not isinstance(data.get("books"), list):
            raise ValueError("도서 목록 형식 오류")
        data["next_id"] = max(
            data.get("next_id", 1),
            max(
                (book["id"] for book in data["books"]),
                default=0
            ) + 1
        )
        return data
    except (json.JSONDecodeError, ValueError, TypeError, KeyError) as e:
        raise RuntimeError(
            f"data.json 파일을 읽을 수 없습니다: {e}"
        )

def save_data(data):
    temp_file = DATA_FILE.with_suffix(".tmp")
    with open(temp_file, "w", encoding="utf-8") as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=4
        )
    temp_file.replace(DATA_FILE)

db = load_data()

class Book(BaseModel):
    title: str = Field(min_length=1)
    author: str = Field(min_length=1)
    genre: str = Field(min_length=1)
    year: int = Field(ge=1)
    description: str = ""

@app.get("/books")
def get_books(search: Optional[str] = None):
    result = db["books"]
    if search:
        keyword = search.strip().lower()
        result = [
            book for book in result
            if keyword in book["title"].lower()
            or keyword in book["genre"].lower()
        ]
    return result

@app.post("/books")
def create_book(book: Book):
    new_book = {
        "id": db["next_id"],
        **book.model_dump(),
        "created_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }
    db["books"].append(new_book)
    db["next_id"] += 1
    save_data(db)
    return new_book

@app.put("/books/{book_id}")
def update_book(book_id: int, book: Book):
    for index, item in enumerate(db["books"]):
        if item["id"] == book_id:
            db["books"][index].update(
                book.model_dump()
            )
            save_data(db)
            return db["books"][index]
    raise HTTPException(
        status_code=404,
        detail="도서를 찾을 수 없습니다."
    )

@app.delete("/books/{book_id}")
def delete_book(book_id: int):
    for index, book in enumerate(db["books"]):
        if book["id"] == book_id:
            deleted = db["books"].pop(index)
            save_data(db)
            return deleted
    raise HTTPException(
        status_code=404,
        detail="도서를 찾을 수 없습니다."
    )
