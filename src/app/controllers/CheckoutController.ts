import pagarme from "pagarme";
import { Request, Response } from "express";
import prisma from "../../lib/prisma";

class CheckoutController {
  async store(req: Request, res: Response) {
    const {
      address,
      customer,
      card_hash,
      items,
      installments,
      amount: amountClient,
    } = req.body;

    const addressFormated = {
      country: "br",
      ...address,
    };

    try {
      const client = await pagarme.client.connect({
        api_key: process.env.PAGARME_API_KEY,
      });

      const fee = 1000;
      const amount = amountClient * 100 + fee;

      const pagarmeTransaction = await client.transactions.create({
        amount: parseInt(amount.toString(), 10),
        ...(card_hash && { card_hash }),
        customer: {
          name: customer.name,
          email: customer.email,
          country: "br",
          external_id: "1",
          type: "individual",
          documents: [
            {
              type: "cpf",
              number: customer.cpf,
            },
            {
              type: "rg",
              number: customer.rg,
            },
          ],
          phone_numbers: [customer.phone],
        },
        billing: {
          name: customer.name,
          address: addressFormated,
        },
        shipping: {
          name: customer.name,
          fee,
          delivery_date: "2021-09-21",
          expedited: false,
          address: addressFormated,
        },
        items: items.map((item: any) => ({
          id: String(item.id),
          title: item.name,
          unit_price: item.price * 100,
          quantity: item.amount,
          tangible: true,
        })),
      });

      const checkout = await prisma.checkout.create({
        data: {
          amount: parseInt(amount.toString(), 10),
          fee,
          // @ts-ignore
          userId: req.userId,
        },
      });

      await items.forEach((item: any) => {
        prisma.checkoutProduct.create({
          data: {
            productId: item.id,
            checkoutId: checkout.id,
            amount: item.amount,
            total: item.amount * item.price,
          },
        });
      });

      const transaction = await prisma.transaction.create({
        data: {
          transaction_id: String(pagarmeTransaction.id),
          status: pagarmeTransaction.status,
          authorization_code: pagarmeTransaction.authorization_code,
          brand: pagarmeTransaction.card_brand,
          authorized_amount: String(pagarmeTransaction.authorized_amount),
          tid: pagarmeTransaction.tid,
          installments,
          checkoutId: checkout.id,
          // @ts-ignore
          userId: req.userId,
        },
      });

      return res.json(transaction);
    } catch (err) {
      return res.status(401).json({ error: "Failled in transaction" });
    }
  }
}

export default new CheckoutController();
