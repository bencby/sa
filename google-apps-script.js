// Google Apps Script for collecting emails from Sigma Audley 2.0 countdown page
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Replace the default code with this script
// 4. Create a new Google Sheet and copy the sheet ID
// 5. Replace 'YOUR_SPREADSHEET_ID' below with your actual sheet ID
// 6. Deploy as web app with execute permissions set to "Anyone"
// 7. Copy the deployment URL and replace 'YOUR_SCRIPT_ID' in index2.0.html

function doPost(e) {
  try {
    // Your actual Google Sheet ID
    const SPREADSHEET_ID = '1TeV1oVnMzZXI9Rqj1QQNMZQo6AhjcbM79TpQ1e9mhSg';
    
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Check if headers exist, if not create them
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'Status']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.getRange(1, 1, 1, 4).setBackground('#dc2626');
      sheet.getRange(1, 1, 1, 4).setFontColor('white');
    }
    
    // Add the new email data
    const newRow = [
      new Date(data.timestamp),
      data.email,
      data.source,
      'Subscribed'
    ];
    
    sheet.appendRow(newRow);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 4).setBorder(true, true, true, true, false, false);
    
    // Set up alternating row colors
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, 4).setBackground('#fef2f2');
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success', row: lastRow}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Sigma Audley 2.0 Email Collection Service is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Optional: Function to get email statistics
function getEmailStats() {
  const SPREADSHEET_ID = '1TeV1oVnMzZXI9Rqj1QQNMZQo6AhjcbM79TpQ1e9mhSg';
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
  
  const totalEmails = sheet.getLastRow() - 1; // Subtract header row
  const todayEmails = sheet.getRange(2, 1, totalEmails, 1)
    .getValues()
    .filter(row => {
      const date = new Date(row[0]);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length;
  
  return {
    total: totalEmails,
    today: todayEmails,
    lastUpdate: new Date().toISOString()
  };
}