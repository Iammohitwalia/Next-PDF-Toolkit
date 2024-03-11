import { ProcessedFile } from "../models/processed-file";

export type EncryptorValidatorState = "VALID" | "INVALID" | "CHECKING" | "EMPTY";

export interface PdfEncryptorState {
  UploadedFile: ProcessedFile | null;
  Password: string;
  ReTypedPassword: string;
  EncryptorInfo: string;
  EncryptorValidator: EncryptorValidatorState;
  IsEncryptonComplete: boolean;
  IsEncryptonInitiated: boolean;
  MaxSizeAllowed: number;
  FileTypeAllowed: string;
}

export const initialPdfEncryptorState: PdfEncryptorState = {
  UploadedFile: null,
  Password: "",
  ReTypedPassword: "",
  EncryptorInfo: "Re-Enter the Password:",
  EncryptorValidator: "EMPTY",
  IsEncryptonComplete: false,
  IsEncryptonInitiated: false,
  MaxSizeAllowed: 20971520,
  FileTypeAllowed: "application/pdf"
};
