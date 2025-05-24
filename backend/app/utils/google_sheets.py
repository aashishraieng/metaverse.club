import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load credentials JSON from environment variable
credentials_info = json.loads(os.environ["GOOGLE_CREDENTIALS_JSON"])
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# Create credentials object
credentials = service_account.Credentials.from_service_account_info(credentials_info, scopes=SCOPES)

# Access the Google Sheets API
service = build('sheets', 'v4', credentials=credentials)
sheet = service.spreadsheets()

def append_row(data: list, sheet_name="Sheet1"):
    body = {
        'values': [data]
    }
    result = sheet.values().append(
        spreadsheetId='YOUR_SPREADSHEET_ID',
        range=f"{sheet_name}!A1",
        valueInputOption="RAW",
        insertDataOption="INSERT_ROWS",
        body=body
    ).execute()

    return result
