// SIMPLIFIED Google Apps Script for Sigma Audley 2.0 Email Collection
// Copy this entire code into your Google Apps Script project

function doPost(e) {
  const SPREADSHEET_ID = '1TeV1oVnMzZXI9Rqj1QQNMZQo6AhjcbM79TpQ1e9mhSg';
  
  try {
    // Get the data from the POST request
    let email, timestamp, source;
    
    if (e.postData && e.postData.contents) {
      const data = JSON.parse(e.postData.contents);
      email = data.email;
      timestamp = data.timestamp;
      source = data.source;
    } else {
      // Fallback for parameter method
      email = e.parameter.email;
      timestamp = new Date().toISOString();
      source = e.parameter.source || 'Sigma Audley 2.0 Launch Page';
    }
    
    if (!email) {
      throw new Error('No email provided');
    }
    
    // Open the spreadsheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getActiveSheet();
    
    // Create headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Email', 'Source', 'Status']]);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      sheet.getRange(1, 1, 1, 4).setBackground('#dc2626');
      sheet.getRange(1, 1, 1, 4).setFontColor('white');
    }
    
    // Add the new email
    const newRow = [
      new Date(timestamp),
      email,
      source,
      'Subscribed'
    ];
    
    sheet.appendRow(newRow);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, 4).setBackground('#fef2f2');
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success', email: email}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests for testing
  const email = e.parameter.email;
  if (email) {
    return doPost({parameter: {email: email, source: 'Test'}});
  }
  
  return ContentService
    .createTextOutput('Sigma Audley 2.0 Email Service Active - Use POST to submit emails')
    .setMimeType(ContentService.MimeType.TEXT);
}