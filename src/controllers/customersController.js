import Customer from '../models/customer.js';
import createHttpError from 'http-errors';

export async function getAllCustomers(req, res, next) {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error loading customers'));
  }
}

export async function createCustomer(req, res, next) {
  try {
    const { name, email, address, phone } = req.body;
    const newCustomer = await Customer.create({ name, email, address, phone });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    next(createHttpError(500, 'Error adding customer'));
  }
}

export async function updateCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCustomer) throw createHttpError(404, 'Customer not found');
    res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(req, res, next) {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);
    if (!deletedCustomer) throw createHttpError(404, 'Customer not found');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
