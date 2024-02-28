import { PageExtractorValidatorState } from "./pdf-page-extractor";

export type PageExtractorValidatorResult = [PageExtractorValidatorState, number, string];

export function validatePagesToExtract(pagesToExtract: string, totalPages: number): PageExtractorValidatorResult {
  let regex1: RegExp = new RegExp(String.raw`^([1-9])(\d*)$`); // RegEx for a Single Number
  let regex2: RegExp = new RegExp(String.raw`^([1-9]{1})(\d*)-([1-9]{1})(\d*)$`); // RegEx for a Range (2 Numbers Separated by a '-')
  let validPagesToExtract: number = 0;
  let validatorResultInfo: string = "";
  let validatorState: PageExtractorValidatorState = "CHECKING";

  if (!regex1.test(pagesToExtract) && !regex2.test(pagesToExtract)) {
    validatorResultInfo = "Invalid Format! ❌";
    validatorState = "INVALID";
  } else if (!pagesToExtract.includes("-")) {
    if (parseInt(pagesToExtract) > totalPages) {
      validatorResultInfo = `Invalid Page Number! There are only ${totalPages} pages. ❌`;
      validatorState = "INVALID";
    } else {
      validPagesToExtract = 1;
      validatorResultInfo = "1 page will be extracted. ✅";
      validatorState = "VALID";
    }
  } else {
    let firstNumber: number = parseInt(pagesToExtract.split("-")[0]);
    let secondNumber: number = parseInt(pagesToExtract.split("-")[1]);

    if (firstNumber > secondNumber) {
      [firstNumber, secondNumber] = [secondNumber, firstNumber];
    }

    if (firstNumber > totalPages || secondNumber > totalPages || secondNumber - firstNumber + 1 > totalPages) {
      validatorResultInfo = `Invalid Page Number Range! There are only ${totalPages} pages. ❌`;
      validatorState = "INVALID";
    } else if (secondNumber - firstNumber + 1 === totalPages) {
      validatorResultInfo = "Invalid Page Number Range! You can't extract all the pages. ❌";
      validatorState = "INVALID";
    } else {
      validPagesToExtract = secondNumber - firstNumber + 1;
      validatorResultInfo = `${validPagesToExtract} pages will be extracted. ✅`;
      validatorState = "VALID";
    }
  }

  return [validatorState, validPagesToExtract, validatorResultInfo];
}
