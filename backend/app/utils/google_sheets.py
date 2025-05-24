import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load credentials JSON file path from environment variable or hardcode here for testing
SERVICE_ACCOUNT_FILE = os.getenv("GOOGLE_SHEETS_CREDENTIALS", "app/utils/credentials.json")
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# The ID of your spreadsheet (find it in the URL of your Google Sheet)
SPREADSHEET_ID = '1C1YQ6BHPa9wBmxn-bX1jjo44HdM9K4lvL9hZvYb3suk'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('sheets', 'v4', credentials=credentials)
sheet = service.spreadsheets()

def append_row(data: list, sheet_name="Sheet1"):
    """
    Append a row to the Google Sheet.
    :param data: list of values for the row
    :param sheet_name: the sheet/tab name inside your Google Sheet
    """
    body = {
        'values': [data]
    }
    result = sheet.values().append(
        spreadsheetId=SPREADSHEET_ID,
        range=f"{sheet_name}!A1",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body=body
    ).execute()

    return result
