import { connect } from "../../db";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { date, bill, paper, quantity, waste, sheets, remark } = req.body;

    await connect();

    // Save the form data to MongoDB
    // Example: Saving to a "contacts" collection
    const Inventory = mongoose.model("paper_inventory", {
      date: String,
      bill: String,
      paper: String,
      quantity: String,
      waste: String,
      sheets: String,
      remark: String,
    });

    const newInventory = new Inventory({
      date,
      bill,
      paper,
      quantity,
      waste,
      sheets,
      remark,
    });
    await newInventory.save();

    res.status(201).json({ message: "Data submitted successfully" });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
