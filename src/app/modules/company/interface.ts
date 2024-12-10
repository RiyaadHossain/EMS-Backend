/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_COMPANY_STATUS } from '@/enums/company';
import { Model, Types } from 'mongoose';

export type ICompany = {
  admin: Types.ObjectId
  companyName: string;
  status: ENUM_COMPANY_STATUS;
  email: string;
  phone: string;
  address: string;
};

export interface CompanyModel extends Model<ICompany> {
  isCompanyxist: (id: string) => Promise<ICompany | null>;
}
