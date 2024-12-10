import Manager from './model';

const get = async () => {
  const employees = await Manager.find().populate({
    path: 'employee',
    populate: { path: 'user' },
  });
  return employees;
};

export const ManagerServices = {
  get,
};
