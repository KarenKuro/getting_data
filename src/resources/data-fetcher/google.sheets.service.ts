import { IClient } from '@common/models';
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GoogleSheetsService {
  private async createSpreadsheet(): Promise<string> {
    const auth = new google.auth.GoogleAuth({
      keyFile: './credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'New Data',
        },
      },
    });


    return response.data.spreadsheetId!;
  }

  async writeDataToSheet(data: IClient[]) {
    const auth = new google.auth.GoogleAuth({
      keyFile: './../../../credentials.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log(auth);
    

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = await this.createSpreadsheet();

    const rows = data.map((client) => [
      client.id,
      client.firstName,
      client.lastName,
      client.gender,
      client.address,
      client.city,
      client.phone,
      client.email,
      client.status,
    ]);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          [
            'id',
            'firstName',
            'lastName',
            'gender',
            'address',
            'city',
            'phone',
            'email',
            'status',
          ],
          ...rows,
        ],
      },
    });
  }
}
