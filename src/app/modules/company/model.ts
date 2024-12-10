import { model, Schema } from 'mongoose';
import { CompanyModel, ICompany } from './interface';
import { ENUM_COMPANY_STATUS } from '@/enums/company';

const companySchema = new Schema<ICompany>(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: Object.values(ENUM_COMPANY_STATUS), default: ENUM_COMPANY_STATUS.IN_ACTIVE },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

companySchema.statics.isCompanyExist = async function (id: string) {
  const isExist = await Company.findById(id);
  return isExist;
};

const Company = model<ICompany, CompanyModel>('Company', companySchema);

export default Company;
