import Supplier from '../models/supplier.js';
import createHttpError from 'http-errors';

// 📌 Получить всех поставщиков (GET)
export async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    next(createHttpError(500, 'Ошибка загрузки поставщиков'));
  }
}

// 📌 Добавить нового поставщика (POST)
export async function createSupplier(req, res, next) {
  try {
    const { name, company, address, phone } = req.body;
    const newSupplier = await Supplier.create({
      name,
      company,
      address,
      phone,
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    next(createHttpError(500, 'Ошибка добавления поставщика'));
  }
}

// 📌 Обновить поставщика (PUT)
export async function updateSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const updatedSupplier = await Supplier.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSupplier) throw createHttpError(404, 'Поставщик не найден');
    res.status(200).json(updatedSupplier);
  } catch (error) {
    next(error);
  }
}

// 📌 Удалить поставщика (DELETE)
export async function deleteSupplier(req, res, next) {
  try {
    const { id } = req.params;
    const deletedSupplier = await Supplier.findByIdAndDelete(id);
    if (!deletedSupplier) throw createHttpError(404, 'Поставщик не найден');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
