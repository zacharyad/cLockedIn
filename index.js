let { getTime, nextTime } = require('./helper/helper');
const { google } = require('googleapis');
const keys = require('./cLockedIn-4c6d1b3d82e7.json');
const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  scopes
);

let isStartingShift = true;

client.authorize((err, tokens) => {
  if (err) {
    console.log('ERROR ', err);
    return;
  } else {
    console.log('We have gotten through and we are connected!');
    gsRun(client, 'Zach', isStartingShift);
    console.log('Zach Clocked In');
    setTimeout(() => {
      gsRun(client, 'Zach', isStartingShift);
      console.log('Zach ClockedOUT');
      console.log('Jess Clocked In');
      gsRun(client, 'Jess', isStartingShift);
      setTimeout(() => {
        gsRun(client, 'Jess', isStartingShift);
        console.log('Jess ClockedOUT');
      }, 60000);
    }, 60000);
  }
});

async function gsRun(cli, name, isClockIn) {
  try {
    const gsApi = google.sheets({ version: 'v4', auth: cli });
    const options = {
      spreadsheetId: '1IWX3aNc7mjGt59RHTRpzwW-9dDVkp6Zngjm55l09QYI',
      majorDimension: 'COLUMNS',
      range: `${name}!A2`,
    };
    let { data } = await gsApi.spreadsheets.values.get(options);
    console.log(data.range);
    //let newEntryLineNumber = Number(data.range.split(':')[1].split('')[1]) + 1 :

    let clockInLetter = isClockIn ? 'A' : 'B';

    let timeNow = new Date(getTime());

    const updateOptions = {
      spreadsheetId: '1IWX3aNc7mjGt59RHTRpzwW-9dDVkp6Zngjm55l09QYI',
      range: `${name}!${clockInLetter}${nextTime}`,
      valueInputOption: 'USER_ENTERED',
      //insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[`${timeNow.getHours()}:${timeNow.getMinutes()}`]],
      },
    };

    let updateRes;

    if (clockInLetter === 'A') {
      updateRes = await gsApi.spreadsheets.values.update(updateOptions);
      isStartingShift = false;
    } else {
      updateOptions.range = `${name}!${clockInLetter}${nextTime}`;
      updateRes = await gsApi.spreadsheets.values.update(updateOptions);
      isStartingShift = true;
      nextTime += 1;
    }

    // console.log('UPDATED INFO: ', updateRes);
  } catch (error) {
    console.log(error);
  }
}
