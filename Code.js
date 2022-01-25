function doPost(request) {
  
  const {userID, sum, category} = request.parameter
  const sheet = SpreadsheetApp.getActiveSheet()
  const maxRows = sheet.getMaxRows()

  if (!userID) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: `Не указан ID пользователя`})).setMimeType(ContentService.MimeType.JSON)
  } else if (!sum) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: `Не указана сумма расходов`})).setMimeType(ContentService.MimeType.JSON)
  } else if (!category) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: `Не указана категория расходов`})).setMimeType(ContentService.MimeType.JSON)
  }

  for(let i = 2; i < maxRows; i++) {
    if (!sheet.getRange(`A${i}`).getValue()) {
      sheet.getRange(`A${i}`).setValue(userID)
      sheet.getRange(`B${i}`).setValue(sum)
      sheet.getRange(`C${i}`).setValue(category)
      break
    }
  }
  
  const result = getResult(request.parameter)
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
}

function doGet(request) {
  const {userID} = request.parameter

  if (!userID) 
    return ContentService.createTextOutput(JSON.stringify({succe: false, error: `Не указан ID пользователя`})).setMimeType(ContentService.MimeType.JSON)
  
  const result = getResult(request.parameter)
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)
}

function getResult({userID, category}) {
  const sheet = SpreadsheetApp.getActiveSheet()
  const maxRows = sheet.getMaxRows()
  const result = {userID, category, sum: 0, success: true}

  for(let i = 2; i < maxRows; i++) {
    let id = sheet.getRange(`A${i}`).getValue()
    let currCategory = sheet.getRange(`C${i}`).getValue()

    if (!id) break
    if (id == userID && (!category || category == currCategory)) {
        result.sum+= sheet.getRange(`B${i}`).getValue() * 1 
    }
  }
  return result
}
