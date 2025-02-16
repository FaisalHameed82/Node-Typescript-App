import { Request, Response } from 'express'; // Adjust the path as necessary
import Employee from '../db/employee';

class EmployeeController {
  public async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await Employee.find();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  public async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        res.status(404).json({ message: 'Employee not found' });
      } else {
        res.status(200).json(employee);
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  public async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeData = req.body;
      const newEmployee = new Employee(employeeData);
      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  public async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      const employeeData = req.body;

      // 🔹 Debug: Log incoming request
      console.log('🔹 Received Employee ID:', employeeId);
      console.log('🔹 Received Update Data:', employeeData);

      // Validate MongoDB ObjectId
      if (!employeeId.match(/^[0-9a-fA-F]{24}$/)) {
        console.error('❌ Invalid Employee ID format:', employeeId);
        res.status(400).json({ message: 'Invalid Employee ID format' });
        return;
      }

      // Check if employee exists before updating
      const existingEmployee = await Employee.findById(employeeId);
      if (!existingEmployee) {
        console.error('❌ Employee Not Found:', employeeId);
        res.status(404).json({ message: 'Employee not found' });
        return;
      }

      // 🔹 Debug: Log existing employee data
      console.log('🔹 Existing Employee Data:', existingEmployee);

      // Allowed update fields (prevent unwanted updates)
      const allowedFields = [
        'name',
        'email',
        'department',
        'salary',
        'dateOfJoining',
        'dateOfBirth',
      ];
      const updateFields: any = {};

      Object.keys(employeeData).forEach((key) => {
        if (allowedFields.includes(key) && employeeData[key] !== undefined) {
          updateFields[key] = employeeData[key];
        }
      });

      // 🔹 Debug: Log fields before updating
      console.log('🔹 Fields to Update:', updateFields);

      // Apply the update
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        { $set: updateFields }, // Ensure updates are applied properly
        { new: true, runValidators: true }
      );

      // 🔹 Debug: Log updated data
      console.log('✅ Updated Employee Data:', updatedEmployee);

      if (!updatedEmployee) {
        console.error('❌ Update Failed:', employeeId);
        res.status(500).json({ message: 'Update failed' });
        return;
      }

      res
        .status(200)
        .json({ message: 'Employee updated successfully', updatedEmployee });
    } catch (error) {
      console.error('❌ Update Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      const employeeId = req.params.id;
      const deletedEmployee = await Employee.findByIdAndDelete(employeeId);
      if (!deletedEmployee) {
        res.status(404).json({ message: 'Employee not found' });
      } else {
        res.status(200).json({ message: 'Employee deleted successfully' });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }
}

export default new EmployeeController();
