import Supplier from '../models/supplier.js';
import createHttpError from 'http-errors';

// 📌 Получить всех поставщиков (GET)
export async function getAllSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch {
    next(createHttpError(500, 'Ошибка загрузки поставщиков'));
  }
}

// 📌 Добавить нового поставщика (POST)
export async function createSupplier(req, res) {
  try {
    const { name, company, address, amount, deliveryDate, status } = req.body;

    // Валидация необходимых данных
    if (!amount || amount < 0) {
      return res
        .status(400)
        .json({ message: 'Сумма закупки (amount) должна быть положительной' });
    }

    if (!deliveryDate) {
      return res.status(400).json({ message: 'Дата доставки (deliveryDate) обязательна' });
    }

    if (!status) {
      return res.status(400).json({ message: 'Статус (status) обязателен' });
    }

    // Создание нового поставщика
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
    console.error("Ошибка при добавлении поставщика:", error.message); // Логирование ошибки
    res.status(500).json({ message: 'Ошибка добавления поставщика', error: error.message });
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
