from google import genai
from dotenv import load_dotenv
import sqlite3

load_dotenv()

client = genai.Client()
prompt = """
    Convert provided schedule into this format: S: [start]-[end], M: [start]-[end], T: [start]-[end], W: [start]-[end], R: [start]-[end], F: [start]-[end], S: [start]-[end]
    Where start and end are 24hr times (e.g. 00:00), or "closed" if no schedule for that day.

    If no schedule is provided, respond with N/A.

    Schedule: {schedule}

    Respond with ONlY the new schedule.
"""


def format_schedule(schedule: str) -> str:
    return client.models.generate_content(
        model="gemini-2.5-flash-lite", contents=prompt.format(schedule=schedule)
    ).text


def get_column(cursor: sqlite3.Cursor) -> list[str]:
    cursor.execute("SELECT HoursOfOperation FROM tblServices")
    return [row[0] for row in cursor.fetchall()]


def format_column(column: list[str]) -> list[str]:
    new_column = []
    for i, schedule in enumerate(column):
        new_column.append(format_schedule(schedule))
        print(f"Formatted schedule {i+1}/{len(column)}")
    return new_column


def overwrite_column(cursor: sqlite3.Cursor, column: list[str]) -> None:
    for i, schedule in enumerate(column):
        cursor.execute(
            "UPDATE tblServices SET HoursOfOperation = ? WHERE id = ?",
            (schedule, i),
        )


def main() -> None:
    with sqlite3.connect(input("Database path: ")) as connection:
        cursor = connection.cursor()
        overwrite_column(
            cursor=cursor, column=format_column(column=get_column(cursor=cursor))
        )
        connection.commit()


if __name__ == "__main__":
    main()
