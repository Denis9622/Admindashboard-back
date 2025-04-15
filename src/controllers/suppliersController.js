import Supplier from '../models/supplier.js';
import createHttpError from 'http-errors';

export async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch {
    next(createHttpError(500, 'Error loading suppliers'));
  }
}

export async function createSupplier(req, res) {
  try {
    const { name, company, address, amount, deliveryDate, status } = req.body;

    if (!amount || amount < 0) {
      return res
        .status(400)
        .json({ message: 'Purchase amount must be positive' });
    }

    if (!deliveryDate) {
      return res.status(400).json({ message: 'Delivery date is required' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const newSupplier = await Supplier.create({
      name,
      company,
      address,
      amount,
      deliveryDate,
      status,
    });

    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error adding supplier:", error.message);
    res.status(500).json({ message: 'Error adding supplier', error: error.message });
  }
}

export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSupplier) throw createHttpError(404, 'Supplier not found');
    res.status(200).json(updatedSupplier);
  } catch (error) {
    next(error);
  }
}

export async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) throw createHttpError(404, 'Supplier not found');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
