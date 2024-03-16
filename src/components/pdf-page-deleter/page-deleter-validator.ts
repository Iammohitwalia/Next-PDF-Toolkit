import { PageDeleterValidatorState } from "./pdf-page-deleter";

export type PageDeleterValidatorResult = [PageDeleterValidatorState, number, string];

export function validatePagesToDelete(pagesToDelete: string, totalPages: number): PageDeleterValidatorResult {
  let regex1: RegExp = new RegExp(String.raw`^([1-9])(\d*)$`); // RegEx for a Single Number
  let regex2: RegExp = new RegExp(String.raw`^([1-9])((\,(([1-9])(\d*)))+)$`); // RegEx for Multiple Numbers Separated by ','
  let regex3: RegExp = new RegExp(String.raw`^(([1-9])(\d*))\-(([1-9])(\d*))$`); // RegEx for a Range (2 Numbers Separated by a '-')
  let validPagesToDelete: number = 0;
  let validatorResultInfo: string = "";
  let validatorState: PageDeleterValidatorState = "CHECKING";

  if (!regex1.test(pagesToDelete) && !regex2.test(pagesToDelete) && !regex3.test(pagesToDelete)) {
    validatorResultInfo = "Invalid Format! ❌";
    validatorState = "INVALID";
    return [validatorState, validPagesToDelete, validatorResultInfo];
  }

  if (pagesToDelete.includes(",")) {
    const pageNumbersToDelete: number[] = [];

    for (let pageNumber of pagesToDelete.split(",")) {
      const currentPageNum: number = parseInt(pageNumber);
      if (currentPageNum < 0 || currentPageNum > totalPages) {
        validatorResultInfo = `'${currentPageNum}' - Invalid Page Number! Page number must be between 1 & ${totalPages}. ❌`;
        validatorState = "INVALID";
        return [validatorState, validPagesToDelete, validatorResultInfo];
      }

      if (!pageNumbersToDelete.includes(currentPageNum)) {
        pageNumbersToDelete.push(currentPageNum);
      }

      if (pageNumbersToDelete.length === totalPages) {
        validatorResultInfo = "Invalid! You can't delete all the pages. ❌";
        validatorState = "INVALID";
        return [validatorState, validPagesToDelete, validatorResultInfo];
      }
    }

    validPagesToDelete = pageNumbersToDelete.length;
    validatorResultInfo = `${validPagesToDelete} pages will be deleted. ✅`;
    validatorState = "VALID";
    return [validatorState, validPagesToDelete, validatorResultInfo];
  }

  if (pagesToDelete.includes("-")) {
    let firstNumber: number = parseInt(pagesToDelete.split("-")[0]);
    let secondNumber: number = parseInt(pagesToDelete.split("-")[1]);

    if (firstNumber > secondNumber) {
      [firstNumber, secondNumber] = [secondNumber, firstNumber];
    }

    if (firstNumber > totalPages || secondNumber > totalPages || secondNumber - firstNumber + 1 > totalPages) {
      validatorResultInfo = `Invalid Page Number Range! There are only ${totalPages} pages. ❌`;
      validatorState = "INVALID";
    } else if (secondNumber - firstNumber + 1 === totalPages) {
      validatorResultInfo = "Invalid Page Number Range! You can't delete all the pages. ❌";
      validatorState = "INVALID";
    } else {
      validPagesToDelete = secondNumber - firstNumber + 1;
      validatorResultInfo = `${validPagesToDelete} pages will be deleted. ✅`;
      validatorState = "VALID";
    }

    return [validatorState, validPagesToDelete, validatorResultInfo];
  }

  if (parseInt(pagesToDelete) > totalPages) {
    validatorResultInfo = `Invalid Page Number! There are only ${totalPages} pages. ❌`;
    validatorState = "INVALID";
  } else {
    validPagesToDelete = 1;
    validatorResultInfo = "1 page will be deleted. ✅";
    validatorState = "VALID";
  }

  return [validatorState, validPagesToDelete, validatorResultInfo];
}
