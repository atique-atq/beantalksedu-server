export const successCode = 200
export const invalidContentErrorCode = 422
export const errorFileMessage = { data: 'invalid file format' }

interface DetailsInfoJson {
  transactionId: string,
  err:string
}

interface ReturnObject {
  timestamp: number,
  loglevel: string,
  transactionId: string,
  err: string
}

export const jsonFormatData = (formattedTimeStamp:number,
  logStatusPortion:string, detailsInfoJson: DetailsInfoJson):ReturnObject => {
  return {
    timestamp: formattedTimeStamp,
    loglevel: logStatusPortion,
    transactionId: detailsInfoJson.transactionId,
    err: detailsInfoJson.err
  }    
}