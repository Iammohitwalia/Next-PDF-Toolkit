import { PageExtractorValidatorState } from "./pdf-page-extractor";

export type PageExtractorValidatorResult = [PageExtractorValidatorState, number, string];

export function validatePagesToExtract(pagesToExtract: string, totalPages: number): PageExtractorValidatorResult {
  let regex1: RegExp = new RegExp(String.raw`^([1-9])(\d*)$`); // RegEx for a Single Number
  let regex2: RegExp = new RegExp(String.raw`^([1-9])((\,(([1-9])(\d*)))+)$`); // RegEx for Multiple Numbers Separated by ','
  let regex3: RegExp = new RegExp(String.raw`^(([1-9])(\d*))\-(([1-9])(\d*))$`); // RegEx for a Range (2 Numbers Separated by a '-')
  let validPagesToExtract: number = 0;
  let validatorResultInfo: string = "";
  let validatorState: PageExtractorValidatorState = "CHECKING";

  if (!regex1.test(pagesToExtract) && !regex2.test(pagesToExtract) && !regex3.test(pagesToExtract)) {
    validatorResultInfo = "Invalid Format! ❌";
    validatorState = "INVALID";
    return [validatorState, validPagesToExtract, validatorResultInfo];
  }

  if (pagesToExtract.includes(",")) {
    const pageNumbersToDelete: number[] = [];

    for (let pageNumber of pagesToExtract.split(",")) {
      const currentPageNum: number = parseInt(pageNumber);
      if (currentPageNum < 0 || currentPageNum > totalPages) {
        validatorResultInfo = `'${currentPageNum}' - Invalid Page Number! Page number must be between 1 & ${totalPages}. ❌`;
        validatorState = "INVALID";
        return [validatorState, validPagesToExtract, validatorResultInfo];
      }

      if (!pageNumbersToDelete.includes(currentPageNum)) {
        pageNumbersToDelete.push(currentPageNum);
      }

      if (pageNumbersToDelete.length === totalPages) {
        validatorResultInfo = "Invalid! You can't extract all the pages. ❌";
        validatorState = "INVALID";
        return [validatorState, validPagesToExtract, validatorResultInfo];
      }
    }

    validPagesToExtract = pageNumbersToDelete.length;
    validatorResultInfo = `${validPagesToExtract} pages will be extracted. ✅`;
    validatorState = "VALID";
    return [validatorState, validPagesToExtract, validatorResultInfo];
  }

  if (pagesToExtract.includes("-")) {
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

    return [validatorState, validPagesToExtract, validatorResultInfo];
  }

  if (parseInt(pagesToExtract) > totalPages) {
    validatorResultInfo = `Invalid Page Number! There are only ${totalPages} pages. ❌`;
    validatorState = "INVALID";
  } else {
    validPagesToExtract = 1;
    validatorResultInfo = "1 page will be extracted. ✅";
    validatorState = "VALID";
  }

  return [validatorState, validPagesToExtract, validatorResultInfo];
}
