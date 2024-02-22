import { PageDeleterValidatorState } from "./pdf-page-deleter";

export type PageDeleterValidatorResult = [PageDeleterValidatorState, number, string];

export function validatePagesToDelete(pagesToDelete: string, totalPages: number): PageDeleterValidatorResult {
  let regex1: RegExp = new RegExp(String.raw`^([1-9])(\d*)$`); // RegEx for a Single Number
  let regex2: RegExp = new RegExp(String.raw`^([1-9]{1})([0-9]*)-([0-9]+)$`); // RegEx for a Range (2 Numbers Separated by a '-')
  let validPagesToDelete: number = 0;
  let validatorResultInfo: string = "";
  let validatorState: PageDeleterValidatorState = "CHECKING";

  if (!regex1.test(pagesToDelete) && !regex2.test(pagesToDelete)) {
    validatorResultInfo = "Invalid Format! ❌";
    validatorState = "INVALID";
  } else if (!pagesToDelete.includes("-")) {
    if (parseInt(pagesToDelete) > totalPages) {
      validatorResultInfo = `Invalid Page Number! There are only ${totalPages} pages. ❌`;
      validatorState = "INVALID";
    } else {
      validPagesToDelete = 1;
      validatorResultInfo = "1 page will be deleted. ✅";
      validatorState = "VALID";
    }
  } else {
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
  }

  return [validatorState, validPagesToDelete, validatorResultInfo];
}
