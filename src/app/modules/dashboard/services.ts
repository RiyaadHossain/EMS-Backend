import { ENUM_MANAGER_STATUS } from "@/enums/manager"
import Department from "../department/model"
import Manager from "../manager/model"
import Project from "../project/model"
import Employee from "../employee/model"

const stats = async () => {
    const departments = await Department.find().countDocuments()
    const projects = await Project.find().countDocuments()
    const managers = await Manager.find({status: ENUM_MANAGER_STATUS.ACTIVE}).countDocuments()
    const employees = await Employee.find().countDocuments()

    return {departments, projects, managers, employees}
}

export const DashboardServices = {stats}