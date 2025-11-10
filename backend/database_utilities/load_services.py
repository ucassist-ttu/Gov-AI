"""Utilities for loading service data into the local SQLite database."""

import json
import sqlite3


def get_services(file_path: str) -> list[dict[str:str]]:
    """Load service records from a JSON file."""
    try:
        with open(file_path) as file:
            return json.load(file)
    except FileNotFoundError:
        return None


def insert_service(cursor: sqlite3.Cursor, index: int, values: tuple[str, ...]) -> None:
    """Insert a single service row into the database."""
    cursor.execute(
        """
        INSERT INTO tblServices (
            ID, OrganizationName, OrganizationDescription, Website,
            MinorityOwned, FaithBasedProvider, NonProfitProvider, ProviderLogo,
            NameOfSevice, ServiceDescription, ProgramCriteria, Keywords,
            CountiesAvailable, TelephoneContact, EmailContact, ServiceAddress,
            CityStateZip, HoursOfOperation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (index, *values),
    )


def main() -> None:
    """Load all service data to the database."""
    database_path = input("Database path: ")
    file_path = input("JSON path: ")
    services = get_services(file_path)
    if not services:
        print(f"\033[31m{file_path} does not exist!\033[0m")
        return

    with sqlite3.connect(database_path) as connection:
        cursor = connection.cursor()
        cursor.execute("DELETE FROM tblServices")
        for index, service in enumerate(services):
            insert_service(cursor, index, [str(value) for value in service.values()])
        connection.commit()
    print(
        f"\033[32mSuccessfully loaded the contents of {file_path} to {database_path}!\033[0m"
    )


if __name__ == "__main__":
    main()
