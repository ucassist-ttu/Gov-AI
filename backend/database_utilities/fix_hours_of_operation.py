"""Normalize stored hours of operation strings into a consistent schedule format."""

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
    """Return a normalized schedule string for the provided raw `schedule`."""
    return client.models.generate_content(
        model="gemini-2.5-flash-lite", contents=prompt.format(schedule=schedule)
    ).text


def get_column(cursor: sqlite3.Cursor) -> list[str]:
    """Fetch the `HoursOfOperation` column from `tblServices`."""
    cursor.execute("SELECT HoursOfOperation FROM tblServices")
    return [row[0] for row in cursor.fetchall()]


def format_column(column: list[str]) -> list[str]:
    """Apply `format_schedule` to each entry in `column`, returning the results."""
    new_column = []
    for i, schedule in enumerate(column):
        new_column.append(format_schedule(schedule))
        print(f"Formatted schedule {i+1}/{len(column)}")
    return new_column


def overwrite_column(cursor: sqlite3.Cursor, column: list[str]) -> None:
    """Overwrite `HoursOfOperation` values with the formatted `column` data."""
    for i, schedule in enumerate(column):
        cursor.execute(
            "UPDATE tblServices SET HoursOfOperation = ? WHERE id = ?",
            (schedule, i),
        )


def main() -> None:
    """Prompt for a database path and normalize each schedule in `tblServices`."""
    with sqlite3.connect(input("Database path: ")) as connection:
        cursor = connection.cursor()
        overwrite_column(
            cursor=cursor, column=format_column(column=get_column(cursor=cursor))
        )
        connection.commit()


if __name__ == "__main__":
    main()
